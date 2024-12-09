#!/bin/bash

if [ -f ./clox ]; then
	rm clox;
fi


echo "Build"
gcc *.c \
	-o clox

if [ -f ./clox ]; then
	echo "Run"
	./clox $1;
fi
