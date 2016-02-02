package models

import (
	"fmt"
	"github.com/gotoolz/env"
	"github.com/nu7hatch/gouuid"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
)

type File struct {
	Id       string `json:"id"`
	Filename string `json:"filename"`
}

func NewFile(f multipart.File, h *multipart.FileHeader) (*File, error) {

	id, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}

	file := &File{
		Id:       id.String(),
		Filename: h.Filename,
	}

	fd, err := file.createFile()
	if err != nil {
		return nil, err
	}
	defer fd.Close()

	if _, err := io.Copy(fd, f); err != nil {
		return nil, err
	}

	return file, nil
}

func (f *File) createFile() (*os.File, error) {
	return os.Create(FilePath(f.Id))
}

func (f *File) URL(r *http.Request) string {

	scheme := "http"
	if r.URL.Scheme == "https" {
		scheme = "https"
	}

	return fmt.Sprintf("%s://%s/f/%s/%s", scheme, r.Host, f.Id, url.QueryEscape(f.Filename))
}

func FilePath(id string) string {
	return fmt.Sprintf("%s/%s", env.GetDefault("UPLOAD_DIR", "./upload"), id)
}
