package workflows

import (
	"encoding/json"
	"net/http"
	util "prestige/util"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type Rider struct {
	Id          string        `json:"id" binding:"required"`
	Time        string        `json:"time" binding:"required"`
	Pickup      util.Location `json:"pickup" binding:"required"`
	Destination util.Location `json:"destination" binding:"required"`
}

func RequestTrip(req Rider, c *gin.Context) (int, string) {
	logger := util.DefaultLogger().With(zap.String("user", req.Id))
	client := util.BuildSupaClient()
	logger.Info("Requesting trip")

	_, count, err := client.From("member").Select("id", "planned", true).Eq("id", req.Id).Execute()

	if err != nil || count < 1 {
		logger.Sugar().Error("user not found")
		if err != nil {
			logger.Sugar().Error(err.Error())
		}
		return http.StatusNotFound, "user not found"
	}

	data, _, err := client.From("trip").Insert(gin.H{
		"rider":       req.Id,
		"pickup_time": req.Time,
		"pickup_lng":  req.Pickup.Lng,
		"pickup_lat":  req.Pickup.Lat,
		"dest_lng":    req.Destination.Lng,
		"dest_lat":    req.Destination.Lng,
	}, false, "", "", "planned").ExecuteString()

	if err != nil {
		logger.Sugar().Warn("Issue starting trip")
		logger.Sugar().Error(err.Error())
		return http.StatusInternalServerError, "We had an issue starting your trip, please try again later"
	}

	var trip []map[string]string
	err = json.Unmarshal([]byte(data), &trip)

	if len(trip) < 1 && err != nil {
		logger.Sugar().Warn("Issue starting trip")
		logger.Sugar().Error(err.Error())
		return http.StatusInternalServerError, "We had an issue starting your trip, please try again later"
	}
	// https://yourbasic.org/golang/fmt-printf-reference-cheat-sheet/#string-or-byte-slice
	logger.Sugar().Info("Trip initiated | ID ", trip[0]["id"])
	return http.StatusCreated, trip[0]["id"]
}
