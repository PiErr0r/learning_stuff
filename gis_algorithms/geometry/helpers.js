
function degrees(rad) {
	return rad * 180 / Math.PI;
}

function radians(deg) {
	return deg * Math.PI / 180;
}

module.exports = {
	degrees,
	radians,
}