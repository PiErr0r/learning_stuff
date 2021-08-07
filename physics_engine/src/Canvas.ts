import Point from "./Point";
const light = "#efefef";
const dark =  "#101010"

class Canvas {
	ctx: CanvasRenderingContext2D;
	theme: theme;
	POINT_OPTS = {
		fillStyleDark: "#efefef",
		fillStyleLight: "#101010",
		radius: 5,
	};
	constructor(theme?:theme) {
		this.theme = theme === undefined ? "dark" : theme;
		const canvas = document.getElementById("screen") as HTMLCanvasElement;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.backgroundColor = this.theme === "dark" ? dark : light
		this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	}

	getPointFillStyle():string {
		return this.POINT_OPTS[this.theme === "dark" ? "fillStyleDark" : "fillStyleLight"];
	}

	drawPoint(pt: Point, opts: PointOpts = {}) {
		const fillStyle:string = opts.fillStyle === undefined ? this.getPointFillStyle() : opts.fillStyle;
		const radius:number = opts.radius === undefined ? this.POINT_OPTS.radius : opts.radius;
		const { x, y } = pt;
	  this.ctx.beginPath();
	  this.ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
	  this.ctx.fillStyle = fillStyle;
	  this.ctx.fill();
	}

	drawPoints(pts:Point[]):void {
		pts.forEach(pt => this.drawPoint(pt));
	}

	drawLine() {

	}

	drawLines() {

	}
}

export default Canvas;