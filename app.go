package main

import (
	"github.com/byttl/byt/controllers"
	"github.com/byttl/byt/web"
	"github.com/gotoolz/env"
)

func main() {

	s := web.NewServer()
	controllers.NewHomeController(s)
	controllers.NewFileController(s)
	controllers.NewTextController(s)

	s.Run(env.GetDefault("LISTEN_ADDR", ":8080")) // listen and serve
}
