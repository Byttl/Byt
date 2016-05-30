package controllers

import (
	"github.com/byttl/byt/web"
	"github.com/gin-gonic/gin"
	"net/http"
)

type TextController struct {
}

func NewTextController(s *web.Server) *TextController {

	ctl := &TextController{}

	s.GET("/text", ctl.getText)

	return ctl
}

func (ctl *TextController) getText(c *gin.Context) {

	c.HTML(http.StatusOK, "text.html", nil)
}
