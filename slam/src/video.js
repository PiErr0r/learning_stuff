/*
 * use this to capture camera feed
  // navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  //   .then(function(stream) {
  //     video.srcObject = stream;
  //     video.play();
  //   })
  //   .catch(function(err) {
  //     console.log("An error occurred! " + err);
  //   });
  */

import { FeatureExtractor } from "./feature_extractor";
import { FPS } from "./constants";

function initData(video) {
  let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
  let cap = new cv.VideoCapture(video);
  return [src, dst, cap];  
}

function video() {
  let video = document.getElementById("videoSrc");
  video.src = "videos/test_countryroad.mp4";

  const [src, dst, cap] = initData(video);
  const FE = new FeatureExtractor();
  let streaming = false;

  console.log(cv)

  function processVideo() {
    try {
      if (!streaming) {
        return;
      }

      let begin = Date.now();

      // start processing.
      cap.read(src);
      video.pause();
      FE.extract(src);
      const copy = src.clone();
      // console.log(FE.corners.size())
      for (let i = 0; i < FE.matches.length; ++i) {
        if (FE.matches[i] && FE.matches[i][0] && FE.matches[i][1]) {
          const pt1 = new cv.Point(FE.matches[i][0].pt.x, FE.matches[i][0].pt.y);
          const pt2 = new cv.Point(FE.matches[i][1].pt.x, FE.matches[i][1].pt.y);
          cv.circle(copy, pt1, 4, [0, 255, 0, 255], 1, 8, 0);
          cv.circle(copy, pt2, 4, [0, 255, 0, 255], 1, 8, 0);
          cv.line(copy, pt1, pt2, [0, 0, 255, 255], 1);
        }
      }
      // use this below when you need to draw keypoints on img
      // cv.drawKeypoints(src, FE.kp, dst, [0, 255, 0, 255]);
      cv.imshow('canvasOutputVideo', copy);
      copy.delete();

      // schedule the next one.
      let delay = 1000/FPS - (Date.now() - begin);
      video.play();
      setTimeout(() => processVideo(), delay);
    } catch (err) {
      console.error(err);
    }
  };

  document.onkeydown = (evt) => {
    if (evt.keyCode === 32) {
      if (streaming) {
        streaming = false;
        video.pause();
      } else {
        streaming = true;
        video.play();
        processVideo();
      }
    }
  }

  window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'Cleanup the data';

    if (!src.empty()) {
      e.preventDefault();
      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      dst.delete();
      src.delete();
      FE.destroy();
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }
  });
}

export {
  video
}