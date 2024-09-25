package workflows

import util "prestige/util"

type Rider struct {
	Id          string `json:"id" binding:"required"`
	Time        string `json:"time" binding:"required"`
	Pickup      util.Location
	Destination util.Location
}

func RequestTrip(user Rider) {
	logger := util.DefaultLogger()

	logger.Info("Requesting ride")
}
