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

	status, message := workflows.JoinPool(body, c, requestID)

	c.JSON(status, gin.H{
		"message":   message,
		"requestId": requestID,
	})
}

func DriverEndDrive(c *gin.Context) {
	requestID := uuid.New()
	var body workflows.LeavePoolRequest
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message":   "Invalid request",
			"requestId": requestID,
		})
		return
	}

	status, message := workflows.LeavePool(body, c, requestID)

	c.JSON(status, gin.H{
		"message":   message,
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
