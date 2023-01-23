package database

import (
	"github.com/google/uuid"
	"math/big"
	"time"
)

// User represents a user
type User struct {
	ID           int64   `json:"id"`
	Username     string  `json:"username"`
	PasswordHash string  `json:"password_hash"`
	Created      string  `json:"created"`
	Balance      float64 `json:"balance"`
	Credits      float64 `json:"credits"`
}

// Game represents a game
type Game struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

// Spin represents a spin within a Game
type Spin struct {
	ID        uuid.UUID `json:"id"`
	Seed      *big.Int  `json:"seed"`
	GameID    uuid.UUID `json:"game_id"`
	UserID    uuid.UUID `json:"user_id"`
	Bet       float64   `json:"bet"`
	Outcome   float64   `json:"outcome"`
	Timestamp time.Time `json:"timestamp"`
}
