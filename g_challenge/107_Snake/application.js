window.onload = () => {
	const canvas = document.getElementById("game");
	canvas.width = canvasSize;
	canvas.height = canvasSize;
	const ctx = canvas.getContext("2d");
	document.addEventListener("keydown", moveSnake);
	setInterval(() => game(ctx), 1000/15);
}

const tileSize = 20;
const canvasSize = 800;
const start = canvasSize / 2 / tileSize;

let rendered = false;
let foodX, foodY;
let eaten = false;
let x = start, y = start;
let speed = 0;
let dx = 0, dy = 0;
let len = 3
let snake = null;

const game = (ctx) => {
	if (snake === null) {
		endGame(ctx);
		return;
	}

	rendered = true;
	x += dx * speed;
	y += dy * speed;

	if (x < 0) x += canvasSize / tileSize;
	if (y < 0) y += canvasSize / tileSize;
	if (x === canvasSize / tileSize) x = 0;
	if (y === canvasSize / tileSize) y = 0;

	if (x === foodX && y === foodY) {
		eaten = true;
		++len;
		newFoodPos();
	}

	if (eaten) newFoodPos();
	if (speed) {
		if (!eaten) snake.pop();
		snake.unshift([x, y]);
	}

	eaten = false;

	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvasSize, canvasSize);

	ctx.fillStyle = "#f00";
	ctx.fillRect(foodX * tileSize, foodY * tileSize, tileSize, tileSize);

	snake.forEach(sPos => {
		const [xc, yc] = sPos;
		ctx.fillStyle = "#0f0";
		ctx.fillRect(xc * tileSize, yc * tileSize, tileSize, tileSize);
	})

	if (isInSnake([x, y], true)) {
		endGame(ctx);
	}
}

const moveSnake = (evt) => {
	if (rendered) {
		switch (evt.keyCode) {
			case 37: goLeft();	break;
			case 38: goUp();		break;
			case 39: goRight(); break;
			case 40: goDown(); 	break;
			default: break;
		}
	}
	rendered = false;
}

const goLeft = () => {
	if (!dx) { dx = -1; dy = 0; }
	if (!speed) speed = 1;
}

const goUp = () => {
	if (!dy) { dx = 0; dy = -1; }
	if (!speed) speed = 1;
}

const goRight = () => {
	if (!dx) { dx = 1; dy = 0; }
	if (!speed) speed = 1;
}

const goDown = () => {
	if (!dy) { dx = 0; dy = 1; }
	if (!speed) speed = 1;
}

const resetSnake = () => {
	snake = [[start, start], [start+1, start], [start+2, start]];
}

const isInSnake = ([cx, cy], skipHead = false) => snake.slice(skipHead ? 1 : 0).reduce((ret, curr) => (ret || curr[0] === cx && curr[1] === cy), false)

const newFoodPos = () => {
	while (true) {
		const [fx, fy] = getRandomPos();
		const inSnake = isInSnake([fx, fy]);
		if (!inSnake) {
			foodX = fx; foodY = fy;
			if (speed && len / 5 > speed) {
				// ++speed;
			}
			return;
		}
	}
}

const getRandomPos = () => {
	const x = Math.floor(Math.random() * (canvasSize / tileSize));
	const y = Math.floor(Math.random() * (canvasSize / tileSize));
	return [x, y];
}

const endGame = (ctx) => {
	firstRender = true;
	x = y = start;
	dx = dy = 0;
	speed = 0;
	ctx.clearRect(0, 0, canvasSize, canvasSize);
	resetSnake();
	newFoodPos();
}