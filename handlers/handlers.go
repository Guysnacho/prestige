package handlers

import (
	"net/http"
	workflows "prestige/workflows"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func DriverRequestTrip(c *gin.Context) {
	requestID := uuid.New()
	var body workflows.User
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message":   "Invalid request",
			"requestId": requestID,
		})
		return
	}
	workflows.JoinPool(body)

	c.JSON(200, gin.H{
		"message":   "Joined driver pool",
		"requestId": requestID,
	})
}

func RiderRequestTrip(c *gin.Context) {
	requestID := uuid.New()
	var body workflows.User
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message":   "Invalid request",
			"requestId": requestID,
		})
		return
	}
	workflows.RequestTrip(body)

	c.JSON(200, gin.H{
		"message":   "ride requested",
		"requestId": requestID,
	})
}
