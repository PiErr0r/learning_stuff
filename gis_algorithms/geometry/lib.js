const { Point } = require('./point');
const { radians } = require('./helpers');

function testIntersect(s1, s2) {
	let lsign = sideplr(s2.lp0, s1.lp0, s1.rp);
	let rsign = sideplr(s2.rp, s1.lp0, s1.rp);
	if (lsign * rsign > 0) return false;
	lsign = sideplr(s1.lp0, s2.lp0, s2.rp);
	rsign = sideplr(s1.rp, s2.lp0, s2.rp);
	if (lsign * rsign > 0) return false;
	return true;
}

function getIntersectionPoint(s1, s2) {
	let [x1, y1] = s1.lp0;
	let [x2, y2] = s1.rp;
	let [x3, y3] = s2.lp0;
	let [x4, y4] = s2.rp;
	if (s1.lp.lt(s2.lp)) {
		[x1, x2, y1, y2, x3, x4, y3, y4] = [x3, xs4, y3, y4, x1, x2, y1, y2];
	}
	let alpha1 = 0, alpha2 = 0;
	if (x1 !== x2)
		alpha1 = (y2 - y1) / (x2 - x1);
	if (x3 !== x4)
		alpha2 = (y4 - y3) / (x4 - x3);
	if (x1 === x2) {
		const y = alpha2 * (x1 - x3) + y3;
		return new Point(x1, y);
	}
	if (x3 === x4) {
		const y = alpha1 * (x3 - x1) + y1;
		return new Point(x3, y);
	}
	if (alpha1 === alpha2)
		return null;
	const x = (alpha1 * x1 + alpha2 * x3 + y3 - y1) / (alpha1 - alpha2);
	const y = alpha1 * (x - x1) + y1;
	return new Point(x, y);
}

function point2line(pt, segment) {
	const dy = segment.lp.y - segment.rp.y;
	const dx = segment.lp.x - segment.rp.x;
	const a = dy;
	const b = -dx;
	const c = segment.lp.y * dx - segment.lp.x * dy;
	const [x, y] = pt;

	if (a === 0 && b === 0) 
		return pt.distance(segment.lp);
	else
		return Math.abs(a * x + b * y + c) / Math.sqrt(a*a + b*b);
}

function sideplr(pt, pt1, pt2) {
	/*
	 * result:
	 * 1  if pt is on the right side of the segment
	 * 0  if pt is on the segment
	 * -1 if pt is on the left side of the segment
	 **/
	return Math.sign((pt.x - pt1.x) * (pt2.y - pt1.y) - (pt2.x - pt1.x) * (pt.y - pt1.y));
}

function spDist(lat1, lon1, lat2, lon2, R = 6371 /* km */) {
	// phi = latitude, lambda = longitude
	const phi1 = radians(lat1);
	const phi2 = radians(lat2);
	const lambda1 = radians(lon1);
	const lambda2 = radians(lon2);
	const sPhi = Math.sin(Math.abs(phi1 - phi2) / 2);
	const sPhi2 = sPhi * sPhi;
	const sLambda = Math.sin(Math.abs(lambda1 - lambda2) / 2)
	const sLambda2 = sLambda * sLambda;
	const a = sPhi2 + Math.cos(phi1) * Math.cos(phi2) * sLambda2;
	const c = 2 * Math.asin(Math.min(1, Math.sqrt(a)));
	return c * R;
}

module.exports = {
	testIntersect,
	getIntersectionPoint,
	point2line,
	sideplr,
	spDist,
}