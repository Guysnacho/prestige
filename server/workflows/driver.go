package workflows

import (
	"errors"
	util "prestige/util"

	"go.uber.org/zap"
)

type Driver struct {
	Id           string `json:"id" binding:"required"`
	Active       bool
	Coordinate_x float32 `json:"coordinateX" binding:"required"`
	Coordinate_y float32 `json:"coordinateY" binding:"required"`
}

func JoinPool(user Driver) error {
	logger := util.DefaultLogger().With(zap.String("user", user.Id))
	client := util.BuildSupaClient()
	logger.Info("Joining pool")

	_, count, err := client.From("driver").Select("id, active", "planned", true).Eq("id", user.Id).Execute()

	if err != nil {
		logger.Sugar().Warn("Issue joining pool")
		return err
	} else if count < 1 {
		logger.Sugar().Warn("user not found")
		return errors.New("user not found")
	}

	_, _, err = client.From("driver").Update(map[string]interface{}{
		"id":           user.Id,
		"active":       true,
		"coordinate_x": user.Coordinate_x,
		"coordinate_y": user.Coordinate_y,
	}, "*", "planned").Eq("id", user.Id).Single().Execute()

	if err != nil {
		logger.Sugar().Warn("Issue joining pool")
		return err
	}

	logger.Sugar().Info("User added to driver pool")
	return nil
}
