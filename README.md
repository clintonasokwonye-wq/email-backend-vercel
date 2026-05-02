# Zoho Mail Backend

Simple backend that connects directly to Zoho Mail via IMAP/SMTP.

## Environment Variables

Set these in Vercel:

- `ZOHO_EMAIL` = info@unicajabanco.sbs
- `ZOHO_PASSWORD` = kki48YPYwekR

## Endpoints

- GET /api/health - Health check
- GET /api/emails/list - Fetch emails from Zoho
- POST /api/emails/send - Send email via Zoho SMTP
- PATCH /api/emails/update - Update email (star/read status)
