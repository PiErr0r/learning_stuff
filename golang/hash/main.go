package main

import (
	"crypto/sha256"
	"fmt"
	"math"
	"time"
)

func mapArr(in []byte) {
	for i := 0; i < len(in); i++ {
		in[i] = mapTo(in[i], ' ', '~')
	}
}

func mapTo(x, mn, mx byte) byte {
	/*
	* c = [0, 255]
	* 0 => mn
	* 255 => mx
	* [1] mn = 0 * a + b
	* [2] mx = 255 * a + b
	* [2] - [1] => mx - mn = 255 * a => a = (mx - mn) / 255
	* [1] => b = mn
	* */
	b := float64(mn)
	a := float64(mx-mn) / 255.0
	res := byte(math.Floor(a*float64(x) + b))
	return res
}

func main() {
	fmt.Println("vim-go")
	h := sha256.New()
	h.Write([]byte("test"))
	//h.Write([]byte("test2"))
	h.Write([]byte("test2test2test2test2test2test2"))
	data := "01001509327453945272658"
	a := h.Sum([]byte(data))
	mapArr(a[len(data):])

	h2 := sha256.New()
	// add data to hash
	h2.Write([]byte("test"))
	// add salt to hash
	//h2.Write([]byte("test2test2test2test2test2test2"))
	// write plain data to the beginning (not hashed)
	b := h2.Sum([]byte(data))
	mapArr(b[len(data):])
	fmt.Println(string(a), len(a))
	fmt.Println(string(b), len(b))
	fmt.Println(string(a) == string(b))

	t := time.Now().Unix()
	fmt.Println(t)
}
