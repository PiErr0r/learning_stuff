#!/bin/bash

gcc \
	main.c \
	chunk.c \
	memory.c \
	debug.c \
	value.c \
	-o clox
