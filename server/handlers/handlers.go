package handlers

import (
	"net/http"
	workflows "prestige/workflows"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func DriverStartDrive(c *gin.Context) {
	requestID := uuid.New()
	var body workflows.Driver
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message":   "Invalid request",
			"requestId": requestID,
		})
		return
	}

	err := workflows.JoinPool(body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message":   "Issue joining pool, please try again later",
			"requestId": requestID,
		})
		return
	}

	c.JSON(200, gin.H{
		"message":   "Joined driver pool",
		"requestId": requestID,
	})
}

func RiderRequestTrip(c *gin.Context) {
	requestID := uuid.New()
	var body workflows.Rider
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
