const SHEET_NAME = 'Signups'

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents)
    const signup = {
      name: cleanValue(payload.name),
      email: cleanValue(payload.email),
      phone: cleanValue(payload.phone),
      country: cleanValue(payload.country),
    }
    if (!signup.name || !signup.email || !signup.phone || !signup.country) {
      throw new Error('Name, email, phone number, and country are required')
    }
    const sheet = getSignupsSheet()

    sheet.appendRow([
      new Date(),
      signup.name,
      signup.email,
      signup.phone,
      signup.country,
    ])

    return jsonResponse({ ok: true })
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message })
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: 'Candy Farm signups' })
}

function getSignupsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(SHEET_NAME)

  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Signed Up', 'Name', 'Email', 'Phone number', 'Country'])
    sheet.setFrozenRows(1)
  }

  return sheet
}

function cleanValue(value) {
  return String(value || '').trim()
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}
