# Build OpenCV

- place yourseld in opencv parent directory and run: `mkdir build && cd build`
- then run: `cmake ../opencv/ -DCMAKE_BUILD_TYPE=RELEASE -DWITH_GTK=ON -DWITH_FFMPEG=ON`
- `make -j4` !!! IMPORTANT !!! dont run with more jobs especially if you are using PC otherwise
- `sudo make install`
- it should then install opencv to `/usr/local/include/opencv4`

- currently it is build with ffmpeg so it can open video stream
- additionally you should build it with Eigen, so there is more Linear Algebra included, or so I think
