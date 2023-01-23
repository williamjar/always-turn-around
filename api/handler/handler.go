package handler

import (
	"context"
	"fmt"
	"github.com/williamjar/always-turn-around/database"
	"github.com/williamjar/always-turn-around/services"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Code int

const (
	CodeError Code = 1 << iota
)

type ErrorResponse struct {
	Code    Code   `json:"code"`
	Message string `json:"message"`
}

type Handler struct {
	e  *gin.Engine
	db database.DB
}

type Config struct {
	JwtUtil services.JWTService
	DB      database.DB
}

func NewHandler(conf *Config) *Handler {
	h := &Handler{
		gin.Default(),
		conf.DB,
	}

	h.e.Use(Cors())

	NewAuthHandler(h.e, conf.DB, conf.JwtUtil)

	h.e.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	return h
}

func (h *Handler) Run(address string) error {
	srv := &http.Server{
		Addr:    address,
		Handler: h.e,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Println("ERROR:", err)
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	return srv.Shutdown(context.Background())
}

func Cors() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "OPTIONS", "DELETE"},
		AllowHeaders:     []string{"Origin", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}
