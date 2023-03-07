#!/bin/bash

echo "cmake_minimum_required(VERSION 2.8)
project( $1 )
find_package( OpenCV REQUIRED )
include_directories( \${OpenCV_INCLUDE_DIRS} )
add_executable( $1 $1.cpp )
target_link_libraries( $1 \${OpenCV_LIBS} )
" > CMakeLists.txt;
# exit
if cmake . && make; then
    ls $2;
    echo $2
    ./$1 $2
else
    echo "Failed compilation";
fi;