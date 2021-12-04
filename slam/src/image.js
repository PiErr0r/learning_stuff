function image() {
  let imgElement = document.getElementById("imageSrc")
  imgElement.src = "imgs/lena.jpg";


  imgElement.onload = function() {
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

export {
  image
}