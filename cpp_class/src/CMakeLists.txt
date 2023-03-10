
add_library(Kolegij Kolegij.cpp)

# state that anybody linking to us needs to include the current source dir
# to find MathFunctions.h, while we don't.
target_include_directories(Kolegij
          INTERFACE ${CMAKE_CURRENT_SOURCE_DIR}
          )

add_library(Student Student.cpp)

# state that anybody linking to us needs to include the current source dir
# to find MathFunctions.h, while we don't.
target_include_directories(Student
          INTERFACE ${CMAKE_CURRENT_SOURCE_DIR}
          )
