#!/bin/bash

echo "Build"
gcc *.c \
	-o clox

echo "Run"
./clox test.lox;
