package workflows

import (
	util "prestige/util"

	"go.uber.org/zap"
)

type Driver struct {
	Id           string `json:"id" binding:"required"`
	Active       bool
	Coordinate_x float32
	Coordinate_y float32
}

func JoinPool(user Driver) error {
	logger := util.DefaultLogger().With(zap.String("user", user.Id))
	client := util.BuildSupaClient()
	logger.Info("Joining pool")

	_, count, err := client.From("driver").Update(map[string]interface{}{
		"id":     user.Id,
		"active": true,
	}, "*", "planned").Eq("id", user.Id).Execute()

	if err != nil {
		logger.Sugar().Warn("Issue joining pool")
		return err
	}

	logger.Sugar().Info("User added to driver pool. Updated rows - ", count)
	return nil
}
