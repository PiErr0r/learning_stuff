const eraseScreen = () => {
	process.stdout.write('\x1b[2J');
}

const moveTo = (x, y) => {
	process.stdout.write(`\x1b[${y};${x}H`);
};

const setRegular = () => {
	process.stdout.write('\x1b[0m');
}

const setBold = () => {
	process.stdout.write('\x1b[1m');
}

const setDim = () => {
	process.stdout.write('\x1b[2m');	
}

const setItalic = () => {
	process.stdout.write('\x1b[3m');
}

const setUnderlined = () => {
	process.stdout.write('\x1b[4m');
}

const setBlinking = () => {
	process.stdout.write('\x1b[5m');
}

const setReverse = () => {
	process.stdout.write('\x1b[7m');
}

const setInvisible = () => {
	process.stdout.write('\x1b[8m');
}

const cmds = {
	0x00: () => setRegular(),
	0x01: () => setBold(),
	0x02: () => setDim(),
	0x03: () => setItalic(),
	0x04: () => setUnderlined(),
	0x05: () => setBlinking(),
	0x07: () => setReverse(),
	0x08: () => setInvisible(),
	0xff: () => eraseScreen(),
}

const execCommand = (cmd) => {
	switch (cmd) {
		case 0x01: setBold(); break;
		case 0x02: setDim(); break;
		case 0x03: setItalic(); break;
		case 0x04: setUnderlined(); break;
		case 0x05: setBlinking(); break;
		case 0x07: setReverse(); break;
		case 0x08: setInvisible(); break;
		case 0xfe: setRegular(); break; // because I want to keep 0x00 as an empty one
		case 0xff: eraseScreen(); break;
		default: break; // no such command
	}
}

const createScreenDevice = () => {
	return {
		getUint16: () => 0,
		getUint8: () => 0,
		setUint16: (address, data) => {
			const command = (data & 0xff00) >> 8;
			const characterValue = data & 0x00ff;
			if (command !== 0x00) {
				execCommand(command);
			}

			const x = (address % 16) + 1;
			const y = Math.floor(address / 16) + 1;
			moveTo(x * 2, y);
			const char = String.fromCharCode(characterValue);
			process.stdout.write(char);
		},
		setUint8: () => 0,
	};
};

module.exports = createScreenDevice;