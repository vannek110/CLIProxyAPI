package config

import (
	"fmt"
	"os"
	"strings"
)

// OAuthConfig holds OAuth client credentials loaded from environment variables.
type OAuthConfig struct {
	GeminiClientID            string
	GeminiClientSecret        string
	AntigravityClientID       string
	AntigravityClientSecret   string
}

// LoadOAuthConfig loads OAuth credentials from environment variables.
// Returns an error if required environment variables are not set.
func LoadOAuthConfig() (*OAuthConfig, error) {
	config := &OAuthConfig{
		GeminiClientID:          strings.TrimSpace(os.Getenv("GEMINI_OAUTH_CLIENT_ID")),
		GeminiClientSecret:      strings.TrimSpace(os.Getenv("GEMINI_OAUTH_CLIENT_SECRET")),
		AntigravityClientID:     strings.TrimSpace(os.Getenv("ANTIGRAVITY_OAUTH_CLIENT_ID")),
		AntigravityClientSecret: strings.TrimSpace(os.Getenv("ANTIGRAVITY_OAUTH_CLIENT_SECRET")),
	}

	// Validate that all required credentials are set
	var missing []string
	if config.GeminiClientID == "" {
		missing = append(missing, "GEMINI_OAUTH_CLIENT_ID")
	}
	if config.GeminiClientSecret == "" {
		missing = append(missing, "GEMINI_OAUTH_CLIENT_SECRET")
	}
	if config.AntigravityClientID == "" {
		missing = append(missing, "ANTIGRAVITY_OAUTH_CLIENT_ID")
	}
	if config.AntigravityClientSecret == "" {
		missing = append(missing, "ANTIGRAVITY_OAUTH_CLIENT_SECRET")
	}

	if len(missing) > 0 {
		return nil, fmt.Errorf("missing required environment variables: %s. Please set them in .env file or environment", strings.Join(missing, ", "))
	}

	return config, nil
}

// GetGeminiClientID returns the Gemini OAuth client ID.
func (c *OAuthConfig) GetGeminiClientID() string {
	return c.GeminiClientID
}

// GetGeminiClientSecret returns the Gemini OAuth client secret.
func (c *OAuthConfig) GetGeminiClientSecret() string {
	return c.GeminiClientSecret
}

// GetAntigravityClientID returns the Antigravity OAuth client ID.
func (c *OAuthConfig) GetAntigravityClientID() string {
	return c.AntigravityClientID
}

// GetAntigravityClientSecret returns the Antigravity OAuth client secret.
func (c *OAuthConfig) GetAntigravityClientSecret() string {
	return c.AntigravityClientSecret
}

// Global OAuth configuration instance
var globalOAuthConfig *OAuthConfig

// InitOAuthConfig initializes the global OAuth configuration.
// Panics if required environment variables are not set.
func InitOAuthConfig() {
	config, err := LoadOAuthConfig()
	if err != nil {
		panic(fmt.Sprintf("Failed to initialize OAuth config: %v", err))
	}
	globalOAuthConfig = config
}

// GetOAuthConfig returns the global OAuth configuration instance.
// Initializes the config if not already done.
func GetOAuthConfig() *OAuthConfig {
	if globalOAuthConfig == nil {
		InitOAuthConfig()
	}
	return globalOAuthConfig
}
