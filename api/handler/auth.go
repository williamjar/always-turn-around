package handler

import (
	"github.com/williamjar/always-turn-around/database"
	"github.com/williamjar/always-turn-around/services"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	r   *gin.Engine
	db  database.DB
	jwt services.JWTService
}

func NewAuthHandler(r *gin.Engine, db database.DB, jwtService services.JWTService) {
	h := &AuthHandler{r, db, jwtService}

	g := h.r.Group("/api/auth")
	g.POST("/login", h.login())
	g.POST("/register", h.register())
}

func (h *AuthHandler) login() gin.HandlerFunc {
	type LoginBody struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	return func(c *gin.Context) {
		var loginBody LoginBody
		if err := c.BindJSON(&loginBody); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{CodeError, "bad request"})
			return
		}

		user, err := h.db.GetUserByUsername(loginBody.Username)
		if err != nil || !CheckPasswordHash(loginBody.Password, user.PasswordHash) {
			c.JSON(http.StatusUnauthorized, ErrorResponse{CodeError, "invalid username or password"})
			return
		}

		token, err := h.jwt.GenerateToken(user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{CodeError, "internal server error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": token,
		})
	}
}

func (h *AuthHandler) register() gin.HandlerFunc {
	type RegisterBody struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	return func(c *gin.Context) {
		var registerBody RegisterBody
		if err := c.BindJSON(&registerBody); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{CodeError, "bad request"})
			return
		}

		if _, err := h.db.GetUserByUsername(registerBody.Username); err == nil {
			c.JSON(http.StatusConflict, ErrorResponse{CodeError, "username already taken"})
			return
		}

		hash, err := HashPassword(registerBody.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{CodeError, "internal server error"})
			return
		}

		user, err := h.db.CreateUser(&database.User{
			Username:     registerBody.Username,
			PasswordHash: hash,
			Created:      time.Now().Format(time.RFC3339),
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{CodeError, "internal server error"})
			return
		}

		token, err := h.jwt.GenerateToken(user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{CodeError, "internal server error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": token,
		})
	}
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

/*
type User struct {
	UserID   int64
	Username string
}

func getAuthMiddleWare(secretKey string, db database.DB) *jwt.GinJWTMiddleware {
	identityKey := "id"
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:       "fyllekjøring.no",
		Key:         []byte(secretKey),
		Timeout:     time.Hour * 24 * 3,
		IdentityKey: identityKey,

		PayloadFunc: func(data interface{}) jwt.MapClaims {
			if v, ok := data.(*User); ok {
				return jwt.MapClaims{
					identityKey: v.UserID,
					"username":  v.Username,
				}
			}
			return jwt.MapClaims{}
		},

		IdentityHandler: func(c *gin.Context) interface{} {
			claims := jwt.ExtractClaims(c)

			user := User{}
			ok := false
			if user.UserID, ok = claims[identityKey].(int64); ok == false {
				return nil
			}
			if user.Username, ok = claims["username"].(string); ok == false {
				return nil
			}
			return &user
		},

		Authenticator: func(ctx *gin.Context) (interface{}, error) {
		},

		Authorizator: func(data interface{}, c *gin.Context) bool {
			if _, ok := data.(*User); ok {
				return true
			}
			return false
		},

		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, ErrorResponse{CodeError, message})
		},

		TokenLookup:   "header: Authorization",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
	})

	if err != nil {
		log.Fatalf("JWT middleware setup failed:", err)
	}

	return authMiddleware
}
*/
