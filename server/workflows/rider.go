package workflows

import util "prestige/util"

type Rider struct {
	Name string `json:"name" binding:"required"`
}

func RequestTrip(user Rider) {
	logger := util.DefaultLogger()

	logger.Info("Requesting ride")
}
