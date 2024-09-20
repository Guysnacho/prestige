package workflows

import (
	"errors"
	"net/http"
	util "prestige/util"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

type Driver struct {
	Id           string `json:"id" binding:"required"`
	Active       bool
	Coordinate_x string `json:"coordinateX" binding:"required"`
	Coordinate_y string `json:"coordinateY" binding:"required"`
}

type LeavePoolRequest struct {
	Id string `json:"id" binding:"required"`
}

func JoinPool(user Driver, c *gin.Context, requestID uuid.UUID) (int, string) {
	logger := util.DefaultLogger().With(zap.String("user", user.Id))
	client := util.BuildSupaClient()
	logger.Info("Joining pool")

	_, count, err := client.From("driver").Select("id, active", "planned", true).Eq("id", user.Id).Execute()

	if err != nil {
		logger.Sugar().Warn("user not found")
		c.AbortWithError(http.StatusNotFound, errors.New("user not found"))
	} else if count < 1 {
		logger.Sugar().Warn("user not found")
		c.AbortWithError(http.StatusNotFound, errors.New("user not found"))
	}

	_, _, err = client.From("driver").Update(gin.H{
		"id":           user.Id,
		"active":       true,
		"coordinate_x": user.Coordinate_x,
		"coordinate_y": user.Coordinate_y,
	}, "*", "planned").Eq("id", user.Id).Single().Execute()

	if err != nil {
		logger.Sugar().Warn("Issue joining pool")
		c.AbortWithError(http.StatusInternalServerError, errors.New("issue joining pool, please try again later"))
	}

	logger.Sugar().Info("User added to driver pool")
	return http.StatusOK, "Joined driver pool"
}

func LeavePool(user LeavePoolRequest, c *gin.Context, requestID uuid.UUID) (int, string) {
	logger := util.DefaultLogger().With(zap.String("user", user.Id))
	client := util.BuildSupaClient()
	logger.Info("Leaving pool")

	_, count, err := client.From("driver").Select("id, active", "planned", true).Eq("id", user.Id).Execute()

	if err != nil {
		c.AbortWithError(http.StatusNotFound, errors.New("user not found"))
	} else if count < 1 {
		logger.Sugar().Warn("user not found")
		c.AbortWithError(http.StatusNotFound, errors.New("user not found"))
	}

	_, _, err = client.From("driver").Update(gin.H{
		"id":           user.Id,
		"active":       false,
		"coordinate_x": 0,
		"coordinate_y": 0,
	}, "*", "planned").Eq("id", user.Id).Single().Execute()

	if err != nil {
		logger.Sugar().Warn("Issue leaving pool")
		return http.StatusInternalServerError, "issue leaving pool, please try again later"
	}

	logger.Sugar().Info("User removed from the driver pool")
	return http.StatusOK, "Exited driver pool"
}
