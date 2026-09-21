export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const endpoint = process.env.GOOGLE_SHEETS_ENDPOINT
    if (!endpoint) {
        return new Response(JSON.stringify({ ok: false, error: 'Google Sheets endpoint is not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    try {
        const payload = await request.json()
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
            result = { ok: response.ok, error: text || 'Google Sheets returned an invalid response' }
        }

        return new Response(JSON.stringify(result), {
            status: response.ok && result.ok !== false ? 200 : 502,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Signup failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
