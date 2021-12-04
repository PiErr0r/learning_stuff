// https://github.com/ucisysarch/opencvjs/blob/master/test/features_2d.html
import { image } from "./image";
import { video } from "./video";

function main() {
  // image();
  video();
}

function openCvReady() {
  cv['onRuntimeInitialized'] = () => {
    main();
  };
}

openCvReady();