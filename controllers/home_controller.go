package controllers

import (
	"github.com/byttl/byt/web"
	"github.com/gin-gonic/gin"
	"net/http"
)

type HomeController struct {
}

func NewHomeController(s *web.Server) *HomeController {

	ctl := &HomeController{}

	s.GET("/", ctl.getHome)
	s.StaticFile("/favicon.ico", "./static/favicon.ico")

	return ctl
}

func (ctl *HomeController) getHome(c *gin.Context) {

	c.HTML(http.StatusOK, "index.html", nil)
}
