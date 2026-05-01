# Email Client Backend - Vercel Serverless

Backend API for the email client using Nylas and Vercel Serverless Functions.

## Deployment

1. Push to GitHub
2. Import to Vercel
3. Add environment variable: `NYLAS_API_KEY`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/accounts/list` - List connected accounts
- `POST /api/accounts/save` - Save account grant ID
- `DELETE /api/accounts/delete?grantId=xxx` - Delete account
- `GET /api/emails/list?grantId=xxx&folder=inbox` - List emails
- `GET /api/emails/get?grantId=xxx&messageId=xxx` - Get single email
- `POST /api/emails/send` - Send email
- `PATCH /api/emails/update` - Update email (mark read/starred)
- `DELETE /api/emails/delete?grantId=xxx&messageId=xxx` - Delete email
- `GET /api/emails/search?grantId=xxx&q=query` - Search emails
- `GET /api/folders/list?grantId=xxx` - List folders
