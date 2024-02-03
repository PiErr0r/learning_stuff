package greetings

import (
	"errors"
	"fmt"
	"math/rand"
)

func Hello(name string) (string, error) {
	if name == "" {
		return "", errors.New("Empty name")
	}
	message := fmt.Sprintf(randomFormat(), name)
	return message, nil
}

func Hellos(names []string) (map[string]string, error) {
	res := make(map[string]string)
	for _, name := range names {
		msg, err := Hello(name)
		if err != nil {
			return nil, err
		}
		res[name] = msg
	}
	return res, nil
}

func randomFormat() string {
	formats := []string{
		"Hello %s. Welcome!",
		"Oh! General %s",
		"Who the fuck are you %s?"}

	return formats[rand.Intn(len(formats))]
}
