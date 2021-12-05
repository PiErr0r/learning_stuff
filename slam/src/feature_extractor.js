

class FeatureExtractor {
  constructor() {
    this.orb = new cv.ORB();
    this.bf = new cv.BFMatcher(cv.NORM_HAMMING);
    this.kps = new cv.KeyPointVector();
    this.corners = new cv.Mat();
    this.des = new cv.Mat();
    this.matches = [];
    this.noArray = new cv.Mat();
    this.last = {};
    this.imgGray = new cv.Mat();
  }

  makeKp(x, y) {
    return {
      pt: new cv.Point(x, y),
      size: 20,
      angle: -1,
      response: 0,
      octave: 0,
      class_id: -1,
    };
  }

  extract(img) {
    // this.orb.detect(img, this.kp);

    cv.cvtColor(img, this.imgGray, cv.COLOR_RGBA2GRAY, 0);
    cv.goodFeaturesToTrack(
      this.imgGray, // input
      this.corners, // output
      3000,         // maxCorners
      0.01,         // qualityLevel
      3,            // minDistance
    );

    this.kps.delete();
    this.kps = new cv.KeyPointVector();
    for (let i = 0; i < this.corners.rows; ++i) {
      const x = this.corners.floatAt(i, 0);
      const y = this.corners.floatAt(i, 1);
      this.kps.push_back(this.makeKp(x, y));
    }

    this.orb.compute(img, this.kps, this.des);
    const matchesVector = new cv.DMatchVectorVector();
    if (this.last.des && this.last.des.matSize.length) {
      this.bf.knnMatch(this.des, this.last.des, matchesVector, 2);
    }

    this.matches.splice(0, this.matches.length);
    for (let i = 0; i < matchesVector.size(); ++i) {
      const twos = matchesVector.get(i);
      const m = twos.get(0);
      const n = twos.get(1);

      if (m.distance < 0.65*n.distance) {
        this.matches.push([ this.kps.get(m.queryIdx), this.last.kps.get(m.trainIdx) ]);
      }
    }
    // console.log(this.matches.length)
    this.last = {
      des: this.des.clone(),
      kps: this.kps.clone()
    }

    matchesVector.delete();
  }

  destroy() {
    this.kps.delete();
    this.des.delete();
    // this.matches.delete();
    this.noArray.delete();
    this.corners.delete();
    if (this.last.des) {
      this.last.des.delete();
    }
    if (this.last.kps) {
      this.last.kps.delete();
    }
    this.imgGray.delete();
  }
}

export { FeatureExtractor }