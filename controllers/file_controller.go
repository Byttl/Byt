package controllers

import (
	"github.com/byttl/byt/models"
	"github.com/byttl/byt/web"
	"github.com/gin-gonic/gin"
	"net/http"
)

type FileController struct {
}

func NewFileController(s *web.Server) *FileController {

	ctl := &FileController{}

	s.POST("/upload", ctl.postUpload)
	s.GET("/f/:id/*filename", ctl.getFile)
	s.GET("/f/:id", ctl.getFile)

	return ctl
}

func (fctl *FileController) postUpload(c *gin.Context) {

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, models.NewError("Missing file"))
		return
	}
	defer file.Close()

	f, err := models.NewFile(file, header)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.NewError(err.Error()))
		return
	}

	c.JSON(http.StatusCreated, map[string]interface{}{
		"file": f.URL(c.Request),
	})
}

func (fctl *FileController) getFile(c *gin.Context) {

	id := c.Param("id")

	c.File(models.FilePath(id))
}
