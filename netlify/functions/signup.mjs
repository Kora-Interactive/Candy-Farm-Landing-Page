export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const endpoint = process.env.GOOGLE_SHEETS_ENDPOINT?.trim()
    if (!endpoint) {
        return new Response(JSON.stringify({ ok: false, error: 'Google Sheets endpoint is not configured in Netlify' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    try {
        const payload = await request.json()
        if (!payload?.name || !payload?.email || !payload?.phone || !payload?.country) {
            return new Response(JSON.stringify({ ok: false, error: 'Name, email, phone number, and country are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
        })
        const text = await response.text()
        let result

        try {
            result = JSON.parse(text)
        } catch {
            const isHtml = /^\s*<!doctype html|^\s*<html/i.test(text)
            result = {
                ok: false,
                error: isHtml
                    ? 'Google Apps Script returned an HTML error page. GOOGLE_SHEETS_ENDPOINT must be the deployed Web App URL ending in /exec.'
                    : text || 'Google Sheets returned an invalid response',
            }
        }

        return new Response(JSON.stringify(result), {
            status: response.ok && result.ok !== false ? 200 : 502,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Signup failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
