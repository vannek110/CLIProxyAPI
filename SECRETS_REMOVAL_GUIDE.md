# Removing Hardcoded Secrets from CLIProxyAPI

## Overview

This guide explains how the hardcoded OAuth secrets have been removed from the codebase and moved to environment variables for better security.

## Changes Made

### 1. Files Modified

The following files had hardcoded OAuth credentials removed:

- `internal/api/handlers/management/api_tools.go`
- `internal/auth/gemini/gemini_auth.go`
- `internal/runtime/executor/gemini_cli_executor.go`

### 2. New Files Created

- `internal/config/oauth_config.go` - Centralized OAuth configuration loader
- `.env.example` - Example environment variables file

## Setup Instructions

### Option 1: Using Environment Variables (Recommended for Production)

1. **Create a `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** and add your OAuth credentials:
   ```env
   GEMINI_OAUTH_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   GEMINI_OAUTH_CLIENT_SECRET=your-actual-client-secret
   ANTIGRAVITY_OAUTH_CLIENT_ID=your-antigravity-client-id.apps.googleusercontent.com
   ANTIGRAVITY_OAUTH_CLIENT_SECRET=your-antigravity-client-secret
   ```

3. **Load environment variables** before running:
   ```bash
   # On Windows (PowerShell)
   Get-Content .env | ForEach-Object {
       if ($_ -match '^([^=]+)=(.*)$') {
           [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
       }
   }
   
   # On Linux/Mac
   export $(cat .env | xargs)
   ```

4. **Run the application**:
   ```bash
   ./cli-proxy-api
   ```

### Option 2: Using Default Values (For Development/Testing Only)

If you don't set environment variables, the application will fall back to the original default OAuth credentials. This is for backward compatibility only and **should not be used in production**.

**⚠️ WARNING:** The default credentials are publicly visible in git history and should be considered compromised. For production use, always set your own credentials via environment variables.

## How It Works

### Configuration Loading

The `internal/config/oauth_config.go` file provides:

- `LoadOAuthConfig()` - Loads credentials from environment variables
- `GetOAuthConfig()` - Returns the global OAuth configuration instance
- Getter methods with fallback to defaults for backward compatibility:
  - `GetGeminiClientID()`
  - `GetGeminiClientSecret()`
  - `GetAntigravityClientID()`
  - `GetAntigravityClientSecret()`

### Usage in Code

Instead of hardcoded constants:
```go
const geminiOAuthClientID = "hardcoded-value"
```

The code now uses:
```go
config.GetOAuthConfig().GetGeminiClientID()
```

## Security Best Practices

1. **Never commit `.env` files** - Already added to `.gitignore`
2. **Use unique credentials** for each environment (dev, staging, production)
3. **Rotate credentials** regularly
4. **Restrict OAuth scopes** to minimum required permissions
5. **Monitor OAuth usage** in Google Cloud Console

## Obtaining OAuth Credentials

To get your own OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Desktop app** as the application type
7. Copy the Client ID and Client Secret to your `.env` file

## Troubleshooting

### Error: "gemini-cli auth metadata missing"

This means the OAuth configuration couldn't be loaded. Check:
- Environment variables are set correctly
- `.env` file exists and is properly formatted
- No typos in variable names

### Error: "failed to exchange token"

This usually means:
- Invalid Client ID or Client Secret
- OAuth consent screen not configured
- Required scopes not enabled in Google Cloud Console

## Reverting to Defaults

If you need to use the original default credentials temporarily:

1. Unset all OAuth environment variables
2. The application will automatically fall back to defaults
3. **Remember:** This is only for development/testing!

## Next Steps

After removing secrets from the code:

1. **Rewrite git history** to remove secrets from all commits (optional but recommended)
2. **Revoke old OAuth credentials** in Google Cloud Console
3. **Create new credentials** for production use
4. **Update deployment scripts** to load environment variables

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository.
