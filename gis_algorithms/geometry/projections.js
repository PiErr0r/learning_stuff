const { radians, degrees } = require('./helpers');

const latitudes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

// length of parallels at each latitude in latitudes
const A = [1.0000, 0.9986, 0.9954, 0.9900, 0.9822, 0.9730, 0.9600, 0.9427, 0.9216, 0.8962, 0.8679, 0.8350, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322];

// length from each parallel to the equator
// these values must be multiplied by 0.5072
const B = [0.0000, 0.0620, 0.1240, 0.1860, 0.2480, 0.3100, 0.3720, 0.4340, 0.4958, 0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1.0000];

function findLE(data, x) {
	let l = 0, r = data.length;
	while (l + 1 < r) {
		const mid = l + ((r - l) >> 1);
		if (mid <= x) {
			l = mid;
		} else {
			r = mid;
		}
	}
	if (l === 0 && data[0] > x) return -1;
	return l;
}

function getInterpolationRange(sidelen, n, i) {
	const il = i < sidelen ? Math.max(0, i - sidelen + 1) : i - sidelen + 1;
	const ir = i >= n - sidelen ? Math.min(n, i + sidelen + 1) : i + sidelen + 1;
	return [il, ir];
}

function neville(dx, dy, x) {
	const p = [];
	for (let i = 0; i < dx.length; ++i) {
		for (let j = 0; j < (dx.length - i); ++j) {
			if (i === 0) {
				p.push(dy[j]);
			} else {
				p[j] = ((x - dx[i+j]) * p[j] + (dx[j] - x) * p[j + 1]) / (dx[j] - dx[i + j]);
			}
		}
	}
	return p[0];
}

function transformRobinson(lon, lat) {
	const n = lat.length;
	let south = false;
	if (lat < 0) {
		south = true;
		lat = Math.abs(lat);
	}
	if (lat > 90) {
		throw new Error("Latitude is bigger than 90!");
	}
	const i = findLE(latitudes, lat);
	let [il, ir] = getInterpolationRange(2, n, i);
	let y = neville(latitudes.slice(il, ir), B.slice(il, ir), lat);
	if (lat < 38) {
		[il, ir] = getInterpolationRange(1, n, i);
	}

	let x = neville(latitudes.slice(il, ir), A.slice(il, ir), lat);
	y = 0.5072 * y / 2;
	dx = x / 360
	x = dx * lon;
	if (south) y = -y;
	return [x, y, il, i, ir];
}

function optTheta(lat, verbose = false) {
	const lat1 = radians(lat);
	let theta = lat1;
	while (true) {
		const dtheta = -(theta + Math.sin(theta) - Math.PI * Math.sin(lat1)) / (1 + Math.cos(theta));
		if (verbose) {
			console.log(`theta = ${degrees(theta)}\ndelta = ${degrees(dtheta)}`);
		}
		if (parseInt(1000000 * dtheta) === 1) 
			break;
		theta += dtheta;
	}
	return theta / 2;
}

function transformMollweide(lon, lat, lon0 = 0, R = 1) {
	let lon1 = lon - lon0;
	if (lon0 !== 0) {
		if (lon1 > 180) {
			lon1 = -((180 + lon0) + (lon1 - 180));
		} else if (lon1 < -180) {
			lon1 = (180 - lon0) - (lon1 + 180);
		}
	}
	const theta = optTheta(lat);
	const xDeg = R * lon1 * Math.cos(theta) * Math.sqrt(8) / Math.PI; 
	const x = radians(xDeg);
	const y = Math.sqrt(2) * R * Math.sin(theta);
	return [x, y];
}

module.exports = {
	transformRobinson,

}