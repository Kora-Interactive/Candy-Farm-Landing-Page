import { createServer } from 'node:http'
import { mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as XLSX from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.API_PORT || 8787)
const DATA_DIR = path.join(__dirname, 'data')
const WORKBOOK_PATH = path.join(DATA_DIR, 'signups.xlsx')
const SHEET_NAME = 'Beta Signups'

const headers = ['Signed Up', 'Name', 'Email', 'Phone number', 'Country']

function sendJson(response, status, payload) {
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    })
    response.end(JSON.stringify(payload))
}

async function readRequestBody(request) {
    let body = ''
    for await (const chunk of request) {
        body += chunk
        if (body.length > 100_000) throw new Error('Request body too large')
    }
    return JSON.parse(body)
}

function cleanSignup(input) {
    const signup = {
        name: typeof input?.name === 'string' ? input.name.trim() : '',
        email: typeof input?.email === 'string' ? input.email.trim() : '',
        phone: typeof input?.phone === 'string' ? input.phone.trim() : '',
        country: typeof input?.country === 'string' ? input.country.trim() : '',
    }

    if (Object.values(signup).some(value => !value)) {
        throw new Error('Name, email, phone number, and country are required')
    }
    if (!/^\S+@\S+\.\S+$/.test(signup.email)) {
        throw new Error('Please provide a valid email address')
    }
    return signup
}

async function appendSignup(signup) {
    await mkdir(DATA_DIR, { recursive: true })
    let workbook

    try {
        await access(WORKBOOK_PATH)
        workbook = XLSX.readFile(WORKBOOK_PATH)
    } catch {
        workbook = XLSX.utils.book_new()
    }

    const existingSheet = workbook.Sheets[SHEET_NAME]
    const rows = existingSheet ? XLSX.utils.sheet_to_json(existingSheet, { header: headers, defval: '' }) : []
    const normalizedRows = rows.length && rows[0]['Signed Up'] === 'Signed Up' ? rows.slice(1) : rows

    normalizedRows.push({
        'Signed Up': new Date().toISOString(),
        Name: signup.name,
        Email: signup.email,
        'Phone number': signup.phone,
        Country: signup.country,
    })

    const sheet = XLSX.utils.json_to_sheet(normalizedRows, { header: headers })
    workbook.Sheets[SHEET_NAME] = sheet
    if (!workbook.SheetNames.includes(SHEET_NAME)) workbook.SheetNames.push(SHEET_NAME)
    XLSX.writeFile(workbook, WORKBOOK_PATH)
}

const server = createServer(async (request, response) => {
    if (request.method === 'OPTIONS') return sendJson(response, 204, {})
    if (request.method === 'GET' && request.url === '/api/health') return sendJson(response, 200, { ok: true })

    if (request.method === 'POST' && request.url === '/api/signups') {
        try {
            const signup = cleanSignup(await readRequestBody(request))
            await appendSignup(signup)
            return sendJson(response, 201, { ok: true })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to save signup'
            const status = message.includes('required') || message.includes('valid email') ? 400 : 500
            return sendJson(response, status, { ok: false, error: message })
        }
    }

    sendJson(response, 404, { ok: false, error: 'Not found' })
})

server.listen(PORT, () => {
    console.log(`Candy Farm signup backend running at http://localhost:${PORT}`)
    console.log(`Workbook output: ${WORKBOOK_PATH}`)
})
