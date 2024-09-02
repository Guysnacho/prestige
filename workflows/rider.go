package workflows

import util "prestige/util"

type User struct {
	Name string `json:"name" binding:"required"`
}

func RequestTrip(user User) {
	logger := util.DefaultLogger()

	logger.Info("Requesting ride")
}
