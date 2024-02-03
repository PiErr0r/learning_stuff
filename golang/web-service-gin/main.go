package main

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	_ "embed"
)

type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

//go:embed albums
var albumsStr string
var albums []album = make([]album, 0)

func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

func getAlbumById(c *gin.Context) {
	id := c.Param("id")
	for _, al := range albums {
		if id == al.ID {
			c.IndentedJSON(http.StatusOK, al)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}

func postAlbum(c *gin.Context) {
	var newAlbum album

	if err := c.BindJSON(&newAlbum); err != nil {
		return
	}

	albums = append(albums, newAlbum)
	c.IndentedJSON(http.StatusOK, newAlbum)
	DBPostProcess()
}

func DBSetup() {
	als := strings.Split(albumsStr, "\n")
	for _, al := range als {
		if len(al) == 0 {
			break
		}
		c := strings.Split(al, ";")
		fmt.Println(c)
		price, err := strconv.ParseFloat(c[3], 64)
		if err != nil {
			panic(fmt.Sprintf("%v\nBad db entry: %s", err, al))
		}
		nal := album{ID: c[0], Title: c[1], Artist: c[2], Price: price}
		albums = append(albums, nal)
	}
}

func DBPostProcess() {
	strs := make([]string, 0)
	for _, al := range albums {
		price := strconv.FormatFloat(al.Price, 'f', 2, 64)
		arr := []string{al.ID, al.Title, al.Artist, price}
		strs = append(strs, strings.Join(arr, ";"))
	}

	wrt := []byte(strings.Join(strs, "\n"))
	err := os.WriteFile("albums", wrt, 0664)
	if err != nil {
		panic(err)
	}
}

func main() {
	DBSetup()
	router := gin.Default()
	router.GET("/albums", getAlbums)
	router.GET("/albums/:id", getAlbumById)
	router.POST("/albums", postAlbum)

	router.Run("localhost:8888")
	DBPostProcess()
}
