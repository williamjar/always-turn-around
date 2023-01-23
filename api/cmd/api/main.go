package main

import (
	"encoding/json"
	"fmt"
	"github.com/williamjar/always-turn-around/database"
	"github.com/williamjar/always-turn-around/handler"
	"github.com/williamjar/always-turn-around/services"
	"os"
)

type Config struct {
	JWTKey string `json:"jwt_key"`
}

func main() {
	file, err := os.ReadFile("./config.json")
	if err != nil {
		panic("config file not found")
	}
	var config *Config
	err = json.Unmarshal(file, &config)
	if err != nil {
		panic("mangled config file, fix it")
	}

	// dependencies
	db, err := database.NewJsonDatabase("./data.json")
	if err != nil {
		panic(err)
	}
	defer func(db *database.JsonDB) {
		err := db.Close()
		if err != nil {
			fmt.Println(err)
		}
	}(db)

	jwtUtil := services.NewJWTUtil(config.JWTKey)

	// server
	h := handler.NewHandler(&handler.Config{JwtUtil: jwtUtil, DB: db})

	// run server
	// this will block
	err = h.Run(":8080")
	if err != nil {
		fmt.Println(err)
	}
}
