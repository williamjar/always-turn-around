package services

import (
	"errors"
	"fmt"
	"github.com/williamjar/always-turn-around/database"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

type JWTService interface {
	ParseToken(token string) (jwt.Claims, error)
	GenerateToken(user *database.User) (string, error)
	IsAuthorized() gin.HandlerFunc
}

type JWTUtil struct {
	key []byte
}

func NewJWTUtil(key string) *JWTUtil {
	return &JWTUtil{[]byte(key)}
}

type UserClaims struct {
	jwt.RegisteredClaims
	Username string
}

func (j *JWTUtil) ParseToken(tokenStr string) (jwt.Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return j.key, nil
	})
	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return token.Claims, nil
}

func (j *JWTUtil) GenerateToken(user *database.User) (string, error) {
	tkn := jwt.New(jwt.SigningMethodHS256)
	claims := UserClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "fyllekjøring.no",
			Subject:   fmt.Sprint(user.ID),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 3)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		Username: user.Username,
	}

	tkn.Claims = claims
	return tkn.SignedString(j.key)
}

func (j *JWTUtil) IsAuthorized() gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth == "" || !strings.HasPrefix(strings.ToLower(auth), "bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
			return
		}
		tokenString := strings.TrimPrefix(auth, "Bearer ")
		token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(t *jwt.Token) (interface{}, error) {
			return j.key, nil
		})
		if err != nil {
			fmt.Println(err)
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "mangled token"})
			return
		}
		if !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "invalid token"})
			return
		}

		c.Set("claims", token.Claims)
		c.Next()
	}
}
