package workflows

import (
	"errors"
	"fmt"
	"net/http"
	util "prestige/util"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type Rider struct {
	Id          string `json:"id" binding:"required"`
	Time        string `json:"time" binding:"required"`
	Pickup      util.Location
	Destination util.Location
}

func RequestTrip(req Rider, c *gin.Context) (int, string) {
	logger := util.DefaultLogger().With(zap.String("user", req.Id))
	client := util.BuildSupaClient()
	logger.Info("Joining pool")

	_, count, err := client.From("member").Select("id, active", "planned", true).Eq("id", req.Id).Execute()

	if err != nil || count < 1 {
		logger.Sugar().Warn("user not found")
		c.AbortWithError(http.StatusNotFound, errors.New("user not found"))
	}

	data, count, err := client.From("trip").Insert(gin.H{
		"user_id":  req.Id,
		"pickup_x": req.Pickup.Lat,
		"pickup_y": req.Pickup.Lng,
		"dest_x":   req.Destination.Lng,
		"dest_y":   req.Destination.Lng,
	}, false, "", "*", "planned").Eq("id", req.Id).Single().Execute()

	fmt.Printf("%08b", data)

	if err != nil {
		logger.Sugar().Warn("Issue starting trip")
		c.AbortWithError(http.StatusInternalServerError, errors.New("We had an issue starting your trip, please try again later"))
	}

	logger.Sugar().Info("Trip initiated")
	return http.StatusOK, "Joined driver pool"
}
