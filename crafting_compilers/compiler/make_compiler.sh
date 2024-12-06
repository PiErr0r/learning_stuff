#!/bin/bash

echo "Build"
gcc \
	main.c \
	chunk.c \
	memory.c \
	debug.c \
	value.c \
	vm.c \
	-o clox

echo "Run"
./clox;
