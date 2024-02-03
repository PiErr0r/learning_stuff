package main

import (
	"fmt"
	"log"

	"example.com/greetings"
)

func main() {
	log.SetPrefix("greetings: ")
	log.SetFlags(0)

	message, err := greetings.Hello("test")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(message)

	names := []string{"a", "b", "c", "d", "e", "f"}
	messages, err := greetings.Hellos(names)
	if err != nil {
		log.Fatal(err)
	}
	for _, msg := range messages {
		fmt.Println(msg)
	}

}
