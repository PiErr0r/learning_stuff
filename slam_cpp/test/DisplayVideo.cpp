#include "opencv2/opencv.hpp"
#include <iostream>
#include <string>
#include <filesystem>
#include <unistd.h>

#include "test.hpp"
 
using namespace std;
 
int main(int argc, char** argv) {
    test("HI!");
	if (argc != 2) {
		printf("usage: DisplayVideo.out <Video_Path>\n");
		return -1;
	}

    // Create a VideoCapture object and open the input file
    // If the input is the web camera, pass 0 instead of the video file name
    const string source = argv[1];           // the source file name
    cout << "!!! " << source << " " << argv[1] << " " << argv[0] << endl;
    cv::VideoCapture cap(argv[1]); 
    // Check if camera opened successfully
    if(!cap.isOpened()){
        cout << "Error opening video stream or file" << endl;
        return -1;
    }
   
    // cv::namedWindow("Display Image", cv::WINDOW_AUTOSIZE);
    cv::namedWindow("image",cv::WINDOW_NORMAL);
    cv::resizeWindow("image", 960,540);


    while(1){
    
        cv::Mat frame;
        // Capture frame-by-frame
        cap >> frame;
    
        // If the frame is empty, break immediately
        if (frame.empty())
        break;
    
        // Display the resulting frame
        cv::imshow("image", frame);
    
        // Press  ESC on keyboard to exit
        char c=(char)cv::waitKey(25);
        if(c==27)
        break;
    }
  
    // When everything done, release the video capture object
    cap.release();
    
    // Closes all the frames
    cv::destroyAllWindows();
    
    return 0;
}