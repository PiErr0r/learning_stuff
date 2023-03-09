cmake_minimum_required(VERSION 3.15)
project(Class)
add_executable(Class main.cpp)
add_subdirectory(src)

target_link_libraries(Class PUBLIC Kompleksni)
