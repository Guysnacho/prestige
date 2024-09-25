package workflows

import (
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

	_, count, err := client.From("member").Select("id", "planned", true).Eq("id", req.Id).Execute()

	if err != nil || count < 1 {
		logger.Sugar().Error("user not found")
		logger.Sugar().Error(err.Error())
		return http.StatusNotFound, "user not found"
	}

	data, count, err := client.From("trip").Insert(gin.H{
		"rider":       req.Id,
		"pickup_time": req.Time,
		"pickup_lng":  req.Pickup.Lng,
		"pickup_lat":  req.Pickup.Lat,
		"dest_lng":    req.Destination.Lng,
		"dest_lat":    req.Destination.Lng,
	}, false, "", "*", "planned").Eq("id", req.Id).Single().Execute()

	fmt.Printf("%08b", data)

	if err != nil || count < 1 {
		logger.Sugar().Warn("Issue starting trip")
		logger.Sugar().Error(err.Error())
		return http.StatusInternalServerError, "We had an issue starting your trip, please try again later"
	}

	logger.Sugar().Info("Trip initiated")
	return http.StatusOK, "Trip initiated"
}
