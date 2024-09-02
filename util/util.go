package util

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func DefaultLogger() *zap.Logger {
	config := zap.NewDevelopmentConfig()
	config.Level.SetLevel(zapcore.InfoLevel)

	var err error
	logger, err := config.Build()
	if err != nil {
		panic("Failed to setup logger")
	}

	return logger
}
