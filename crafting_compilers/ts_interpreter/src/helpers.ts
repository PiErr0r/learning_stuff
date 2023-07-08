
const MAP = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
function randomString(n: number): string {
	let s = '';
	for (let i = 0; i < n; ++i) {
		const r = Math.floor(Math.random() * MAP.length);
		s += MAP[r];
	}
	return s;
}

export { randomString };