// https://github.com/ucisysarch/opencvjs/blob/master/test/features_2d.html

function image() {
  return;
  let imgElement = document.getElementById("imageSrc")
  imgElement.src = "imgs/lena.jpg";


  imgElement.onload = function() {
    // let mat = cv.imread(imgElement);
    console.log("A")
    let src = cv.imread(imgElement);
    let dst = new cv.Mat();
    // To distinguish the input and output, we graying the image.
    // You can try different conversions.
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow('canvasOutput', dst);
    src.delete();
    dst.delete();

  }
}

class FeatureExtractor {
  constructor() {
    this.orb = new cv.ORB(3000);
    this.kp = new cv.KeyPointVector();
    this.des = new cv.Mat();
  }

  extract(img) {
    this.orb.detect(img, this.kp);
    this.orb.compute(img, this.kp, this.des);
  }

  destroy() {
    this.kp.delete();
    this.des.delete();
  }
}

function video() {
  let video = document.getElementById("videoSrc"); // video is the id of video tag
  video.src = "videos/test_countryroad.mp4";
  // video.play();
  // navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  //   .then(function(stream) {
  //     video.srcObject = stream;
  //     video.play();
  //   })
  //   .catch(function(err) {
  //     console.log("An error occurred! " + err);
  //   });

  let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
  let cap = new cv.VideoCapture(video);

  let streaming = false;

  document.onkeydown = (evt) => {
    if (evt.keyCode === 32 && streaming) {
      streaming = false;
      video.pause();
    }
    else if (evt.keyCode === 32) {
      streaming = true;
      video.play();
      processVideo();
    }
  }
  // console.log(cv)
  window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'It looks like you have been editing something. '

    if (!src.empty()) {
      e.preventDefault();
      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      dst.delete();
      src.delete();
      FE.destroy();
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }
  });

  const FPS = 30;
  const FE = new FeatureExtractor();

  function processVideo() {
    try {
      if (!streaming) {
        return;
      }
      let begin = Date.now();
      // start processing.
      cap.read(src);
      FE.extract(src)
      cv.drawKeypoints(src, FE.kp, dst, [0, 255, 0, 255]);
      cv.imshow('canvasOutputVideo', dst);

      // schedule the next one.
      let delay = 1000/FPS - (Date.now() - begin);

      setTimeout(processVideo, delay);
    } catch (err) {
      console.error(err);
    }
  };
}

function main() {
  image();
  video();
}

function openCvReady() {
  cv['onRuntimeInitialized'] = () => {
    main();
  };
}

openCvReady();