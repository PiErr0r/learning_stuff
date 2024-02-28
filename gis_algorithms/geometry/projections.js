

function neville(dx, dy, x) {
	const p = [];
	for (let i = 0; i < dx.length; ++i) {
		for (let j = 0; j < (dx.length - i); ++j) {
			if (i === 0) {
				p.push(dy[j]);
			} else {
				p[j] = ((x - dx[i+j]) * p[j] + (datax[j] - x) * p[j + 1]) / (dx[j] - dx[i + j]);
			}
		}
	}
	return p[0];
}

module.exports = {
	neville,
}