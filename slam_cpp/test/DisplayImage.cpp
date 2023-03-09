#include <opencv2/opencv.hpp>
#include <stdio.h>

// using namespace cv;

#include <opencv2/opencv.hpp>

#include <iostream>
#include <string>
#include <filesystem>
#include <unistd.h>

using std::cout; using std::cin;
using std::endl; using std::string;
using std::filesystem::current_path;

int main(int argc, char** argv)
{
  cout << "Current working directory: " << current_path() << endl;
	//std::cout << cv::getBuildInformation() << std::endl;
	if (argc != 2) {
		printf("usage: DisplayImage.out <Image_Path>\n");
		return -1;
	}

	cv::Mat image;
	image = cv::imread(argv[1], 1);
	if (!image.data) {
		printf("No image data \n");
		return -1;
	}
	
	cv::namedWindow("Display Image", cv::WINDOW_AUTOSIZE);
	cv::imshow("Display Image", image);
	cv::waitKey(0);
	return 0;
}

