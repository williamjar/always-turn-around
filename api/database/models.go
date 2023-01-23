package database

// User represents a user
type User struct {
	ID           int64   `json:"id"`
	Username     string  `json:"username"`
	PasswordHash string  `json:"password_hash,omitempty"`
	Created      string  `json:"created"`
	Balance      float64 `json:"balance"`
	Credits      float64 `json:"credits"`
}
