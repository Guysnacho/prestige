package handlers

import (
	"net/http"
	workflows "prestige/workflows"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Driver

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

// Rider

func RiderScheduleTrip(c *gin.Context) {
	var body workflows.Rider
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request",
		})
		return
	}

	scheduledTime, err := time.Parse(time.RFC3339Nano, body.Time)
	min := time.Now().Add(time.Hour * 1)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Issue parsing time ",
		})
		return
	} else if min.Compare(scheduledTime) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid trip time",
		})
		return
	}

	status, response := workflows.RequestTrip(body, c)

	if status == http.StatusCreated {
		c.JSON(status, gin.H{
			"message":   "Your trip has been scheduled",
			"requestId": response,
		})
	} else {
		c.JSON(status, gin.H{
			"message": response,
		})
	}

}

// Fetch map

func FetchMap(c *gin.Context) {
	var body workflows.Rider
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request",
		})
		return
	}

	scheduledTime, err := time.Parse(time.RFC3339Nano, body.Time)
	min := time.Now().Add(time.Hour * 1)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Issue parsing time ",
		})
		return
	} else if min.Compare(scheduledTime) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid trip time",
		})
		return
	}

	status, response := workflows.RequestTrip(body, c)

	if status == http.StatusCreated {
		c.JSON(status, gin.H{
			"message":   "Your trip has been scheduled",
			"requestId": response,
		})
	} else {
		c.JSON(status, gin.H{
			"message": response,
		})
	}

}
