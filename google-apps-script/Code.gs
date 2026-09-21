const SHEET_NAME = 'Signups'
const TESTER_GROUP_EMAIL = 'candy-farm-closed-test@googlegroups.com'
const TESTER_GROUP_URL = 'https://groups.google.com/g/candy-farm-closed-test'

function doPost(event) {
  try {
    if (!event || !event.postData || !event.postData.contents) {
      throw new Error('No signup payload received by Google Apps Script')
    }
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
    const lock = LockService.getScriptLock()
    lock.waitLock(10000)
    try {
      const sheet = getSignupsSheet()
      sheet.appendRow([
        new Date(),
        signup.name,
        signup.email,
        signup.phone,
        signup.country,
      ])
      SpreadsheetApp.flush()
      let groupAdded = false
      let groupError = ''
      try {
        groupAdded = addToTesterGroup(signup.email)
      } catch (groupFailure) {
        groupError = groupFailure instanceof Error ? groupFailure.message : String(groupFailure)
      }
      return jsonResponse({ ok: true, sheet: sheet.getName(), row: sheet.getLastRow(), groupAdded, groupError, groupUrl: TESTER_GROUP_URL })
    } finally {
      lock.releaseLock()
    }
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message })
  }
}

function addToTesterGroup(email) {
  try {
    AdminDirectory.Members.get(TESTER_GROUP_EMAIL, email)
    return true
  } catch (error) {
    if (!String(error).includes('Not Found')) throw error
  }

  AdminDirectory.Members.insert({
    email: email,
    role: 'MEMBER',
    delivery_settings: 'ALL_MAIL',
  }, TESTER_GROUP_EMAIL)

  return true
}

function doGet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = spreadsheet && spreadsheet.getSheetByName(SHEET_NAME)
  return jsonResponse({
    ok: true,
    service: 'Candy Farm signups',
    spreadsheet: spreadsheet ? spreadsheet.getName() : null,
    sheet: sheet ? sheet.getName() : SHEET_NAME,
    rows: sheet ? sheet.getLastRow() : 0,
    testerGroup: TESTER_GROUP_EMAIL,
    testerGroupUrl: TESTER_GROUP_URL,
  })
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
