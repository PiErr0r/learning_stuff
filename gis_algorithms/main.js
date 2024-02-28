const {
  Segment,
  Point,
  Polygon,
  getIntersectionPoint,
  pipCross,
  pipWn1,
  point2line,
  sideplr,
  spDist,
  testIntersect,
} = require('./geometry')
{
  const a = new Point(1, 2);
  const b = new Point(1, 2);
  const c = new Point(2, 4);
  const d = new Point(1, 2, 4);

  console.log(`${d.z}`)
  console.log(a.manhattan(c))

  const [lat1, lon1] = [40, -83];
  const [lat2, lon2] = [39.91, 116.56];

  console.log(spDist(lat1, lon1, lat2, lon2))
}
{
  const pt1 = new Point(10, 0);
  const l1 = new Segment(new Point(0, 100), new Point(0, 1));
  console.log(point2line(pt1, l1))
  const pt2 = new Point(0, 10);
  const l2 = new Segment(new Point(1000, 0.01), new Point(-100, 0));
  console.log(point2line(pt2, l2))
  const pt3 = new Point(0, 0);
  const l3 = new Segment(new Point(0, 10), new Point(10, 0));
  console.log(point2line(pt3, l3))
  const pt4 = new Point(0, 0);
  const l4 = new Segment(new Point(10, 10), new Point(10, 10));
  console.log(point2line(pt4, l4))
}
{
  const p1 = new Point(0, 0);
  const p2 = new Point(0, 10);
  const p3 = new Point(10, 10);
  const p4 = new Point(10, 0);
  const pl1 = new Polygon(p1, p2, p3, p4);
  const pl2 = new Polygon(p4, p3, p2, p1);
  console.log(pl1.area(), pl1.centroid())
  console.log(pl2.area(), pl2.centroid())
}
{
  const pt1 = new Point(1, 1);
  const pt2 = new Point(-1, 1);
  const pt3 = new Point(0, 0.5);
  const line = new Segment(new Point(0, 0), new Point(0, 1));
  console.log(sideplr(pt1, line.lp, line.rp))
  console.log(sideplr(pt2, line.lp, line.rp))
  console.log(sideplr(pt3, line.lp, line.rp))
  console.log(`${new Segment(pt1, pt2)}`)
}
{
  const pt1 = new Point(1, 2);
  const pt2 = new Point(3, 4);
  const pt3 = new Point(2, 1);
  const pt4 = new Point(1, 4);
  const s1 = new Segment(pt1, pt2);
  const s2 = new Segment(pt3, pt4);
  const s3 = new Segment(pt1, pt2);
  if (testIntersect(s1, s2)) {
    console.log('!',getIntersectionPoint(s1, s2))
  } else {
    console.log("NO")
  }
  console.log(s1.eq(s3))
}
{
  const points = [ [0,10], [5,0], [10,10], [15,0], [20,10], [25,0], [30,20], [40,20], [45,0], [50,50], [40,40], [30,50], [25,20], [20,50], [15,10], [10,50], [8, 8], [4,50]]
    .map(pt => new Point(...pt));
  const ppgon = new Polygon(...points);
  // console.log(ppgon)
  const inout = (pip) => (pip ? "IN" : "OUT");
  let point = new Point(10, 30)
  console.log(`Point ${point} is ${inout(pipCross(point, ppgon)[0])}`);
  point = new Point(10, 20)
  console.log(`Point ${point} is ${inout(pipCross(point, ppgon)[0])}`);
  point = new Point(20, 40)
  console.log(`Point ${point} is ${inout(pipCross(point, ppgon)[0])}`);
  point = new Point(5, 40)
  console.log(`Point ${point} is ${inout(pipCross(point, ppgon)[0])}`);
}
{
  const points = [ [0,10], [5,0], [10,10], [15,0], [20,10], [25,0], [30,20], [40,20], [45,0], [50,50], [40,40], [30,50], [25,20], [20,50], [15,10], [10,50], [8, 8], [4,50]]
    .map(pt => new Point(...pt));
  const ppgon = new Polygon(...points);
  // console.log(ppgon)
  const inout = (pip) => (pip ? "IN" : "OUT");
  let point = new Point(10, 30)
  console.log(`Point ${point} is ${inout(pipWn1(point, ppgon)[0])}`);
  point = new Point(10, 20)
  console.log(`Point ${point} is ${inout(pipWn1(point, ppgon)[0])}`);
  point = new Point(20, 40)
  console.log(`Point ${point} is ${inout(pipWn1(point, ppgon)[0])}`);
  point = new Point(5, 40)
  console.log(`Point ${point} is ${inout(pipWn1(point, ppgon)[0])}`);
}