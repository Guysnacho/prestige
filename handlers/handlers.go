package handlers

import (
	workflows "prestige/workflows"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

var Domain = "prestige-api"

type message struct {
	Name string `json:"name" binding:"required"`
}

func DriverRequestTrip(c *gin.Context) {
	requestID := uuid.New()
	workflows.JoinPool()

	c.JSON(200, gin.H{
		"message":   "Joined driver pool",
		"requestId": requestID,
	})
}

func RiderRequestTrip(c *gin.Context) {
	requestID := uuid.New()
	workflows.RequestTrip()

	c.JSON(200, gin.H{
		"message":   "ride requested",
		"requestId": requestID,
	})
}
