// import Point from "./Point";
const light = "#efefef";
const dark =  "#101010";

class Canvas {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	theme: theme;
	private POINT_OPTS = {
		fillStyleDark: "#efefef",
		fillStyleLight: "#101010",
		radius: 5,
	};
	constructor(theme?:theme) {
		this.theme = theme === undefined ? "dark" : theme;
		this.canvas = document.getElementById("screen") as HTMLCanvasElement;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.backgroundColor = this.theme === "dark" ? dark : light
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

		// window.addEventListener("resize", function(this:Canvas) {
		// 	this.canvas.width = window.innerWidth;
		// 	this.canvas.height = window.innerHeight;
		// }.bind(this));
	}

	clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	getFillStyle():string {
		return this.POINT_OPTS[this.theme === "dark" ? "fillStyleDark" : "fillStyleLight"];
	}

	drawPoint(pt: IPoint, opts: DrawOpts = {}):void {
		const fillStyle:string = opts.fillStyle === undefined ? this.getFillStyle() : opts.fillStyle;
		const radius:number = opts.radius === undefined ? this.POINT_OPTS.radius : opts.radius;
		const { x, y } = pt;
	  this.ctx.beginPath();
	  this.ctx.arc(x, this.canvas.height - y, radius, 0, 2 * Math.PI, true);
	  this.ctx.fillStyle = fillStyle;
	  this.ctx.fill();
	}

	drawPoints(pts:IPoint[]):void {
		pts.forEach(pt => this.drawPoint(pt));
	}

	drawLine() {

	}

	drawLines() {

	}

	drawRect(botL: IPoint, topR: IPoint, opts: DrawOpts = {}): void {
		const fillStyle = opts.fillStyle === undefined ? this.getFillStyle() : opts.fillStyle;
		const drawPoints = opts.drawPoints === undefined ? false : opts.drawPoints;
		this.ctx.fillStyle = fillStyle;
		this.ctx.beginPath();
		this.ctx.moveTo(botL.x, this.canvas.height - botL.y);
		if (drawPoints) this.drawPoint({ x: botL.x, y: botL.y}, opts);
		this.ctx.lineTo(topR.x, this.canvas.height - botL.y);
		if (drawPoints) this.drawPoint({ x: topR.x, y: botL.y}, opts);
		this.ctx.lineTo(topR.x, this.canvas.height - topR.y);
		if (drawPoints) this.drawPoint({ x: topR.x, y: topR.y}, opts);
		this.ctx.lineTo(botL.x, this.canvas.height - topR.y);
		if (drawPoints) this.drawPoint({ x: botL.x, y: topR.y}, opts);
		this.ctx.closePath();
		this.ctx.fill();
	}
}

export default Canvas;