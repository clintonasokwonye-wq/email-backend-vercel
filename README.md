# Zoho Mail Backend - Multi-Account Support

Simple backend that connects to Zoho Mail via IMAP/SMTP.

## Features

- ✅ Support for multiple Zoho accounts
- ✅ No environment variables needed
- ✅ Credentials passed securely in requests
- ✅ Works with any Zoho Mail account

## Endpoints

- GET /api/health - Health check
- POST /api/emails/list - Fetch emails (requires email + password in body)
- POST /api/emails/send - Send email (requires email + password in body)
- POST /api/emails/update - Update email (requires email + password in body)

## Security

Credentials are passed in request body and NOT stored on server.
Use HTTPS in production to encrypt credentials in transit.
