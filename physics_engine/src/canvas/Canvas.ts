// import Point from "./Point";
const light = "#efefef";
const dark =  "#101010";

class Canvas {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	theme: theme;
	private OPTS = {
		fillStyleDark: "#efefef",
		fillStyleLight: "#101010",
		strokeStyleDark: "#efefef",
		strokeStyleLight: "#101010",
		radius: 5,
		lineWidth: 2,
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
		return this.OPTS[this.theme === "dark" ? "fillStyleDark" : "fillStyleLight"];
	}

	getStrokeStyle():string {
		return this.OPTS[this.theme === "dark" ? "strokeStyleDark" : "strokeStyleLight"];
	}

	drawPoint(pt: IPoint, opts: DrawOpts = {}):void {
		const fillStyle:string = opts.fillStyle === undefined ? this.getFillStyle() : opts.fillStyle;
		const radius:number = opts.radius === undefined ? this.OPTS.radius : opts.radius;
		const { x, y } = pt;
	  this.ctx.beginPath();
	  this.ctx.arc(x, this.canvas.height - y, radius, 0, 2 * Math.PI, true);
	  this.ctx.fillStyle = fillStyle;
	  this.ctx.fill();
	}

	drawPoints(pts:IPoint[]):void {
		pts.forEach(pt => this.drawPoint(pt));
	}

	drawLine(pt1: IPoint, pt2: IPoint, opts: DrawOpts = {}):void {
		const lineWidth = opts.lineWidth === undefined ? this.OPTS.lineWidth : opts.lineWidth;
		const strokeStyle = opts.strokeStyle === undefined ? this.getStrokeStyle() : opts.strokeStyle;
		this.ctx.strokeStyle = strokeStyle;
		this.ctx.lineWidth = lineWidth;
		this.ctx.beginPath();
		this.ctx.moveTo(pt1.x, this.canvas.height - pt1.y);
		this.ctx.lineTo(pt2.x, this.canvas.height - pt2.y);
		this.ctx.stroke();
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