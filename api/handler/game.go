package handler

import (
	crand "crypto/rand"
	"encoding/binary"
	"github.com/gin-gonic/gin"
	"github.com/williamjar/always-turn-around/database"
	"github.com/williamjar/always-turn-around/services"
	"math/rand"
	"net/http"
)

type GameHandler struct {
	r  *gin.Engine
	db database.DB
	j  services.JWTService
}

func NewGameHandler(r *gin.Engine, db database.DB, j services.JWTService) {
	h := &GameHandler{r, db, j}

	g := h.r.Group("/games")
	g.GET("/")                 // get all games
	g.GET("/:id")              // get game info
	g.POST("/:id", spinGame()) // spin game
}

func getGames() gin.HandlerFunc {
	return func(c *gin.Context) {

	}
}

func getGame() gin.HandlerFunc {
	return func(c *gin.Context) {

	}
}

func spinGame() gin.HandlerFunc {
	type spinBody struct {
		Bet float64 `json:"bet" binding:"required"`
	}

	return func(c *gin.Context) {
		var body spinBody
		if err := c.BindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{CodeError, "bad request"})
			return
		}

		res := spin(body.Bet)

		c.JSON(http.StatusOK, gin.H{
			"seed":    res.seed,
			"outcome": res.outcome,
			"line":    res.line,
		})
	}
}

type spinResult struct {
	seed    int64
	outcome float64
	line    []int
}

func generateSeed() (int64, error) {
	seed := make([]byte, 8)
	if _, err := crand.Read(seed); err != nil {
		return 0, err
	}
	return int64(binary.BigEndian.Uint64(seed)), nil
}

func spin(bet float64) *spinResult {
	seed, _ := generateSeed()
	r := rand.New(rand.NewSource(seed))

	var line []int
	m := make(map[int]int)
	for i := 0; i < 3; i++ {
		n := r.Intn(5)
		m[n] += 1
		line = append(line, n)
	}

	outcome := 0.0
	if m[0] == 3 {
		outcome += bet * 20
	}

	return &spinResult{
		seed:    seed,
		outcome: outcome,
		line:    line,
	}
}
