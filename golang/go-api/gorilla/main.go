package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

type homeHandler struct{}

func (h *homeHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("This is a home page!\n"))
}

func main() {
	router := mux.NewRouter()
	home := homeHandler{}
	router.HandleFunc("/", home.ServeHTTP)
	fmt.Println("Serving on localhost:8000")
	http.ListenAndServe(":8000", router)
}
