# Google Sheets signup storage

## 1. Create the sheet

1. Create a new Google Sheet.
2. Open **Extensions > Apps Script**.
3. Replace the default script with the contents of `google-apps-script/Code.gs`.
4. Save the project.

## 2. Deploy the webhook

1. In Apps Script, choose **Deploy > New deployment**.
2. Select **Web app** as the deployment type.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone**.
5. Deploy and copy the generated `/exec` URL.

The first request creates a `Signups` tab with these columns:

`Signed Up | Name | Email | Phone number | Country`

## 3. Connect the frontend

In Netlify, add this server-side environment variable under **Site configuration > Environment variables**:

```env
GOOGLE_SHEETS_ENDPOINT=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Then redeploy. The browser posts to `/api/signups`; Netlify forwards it to Apps Script without a browser CORS request.

The value must be the deployed `/exec` URL, not the Apps Script editor URL.
