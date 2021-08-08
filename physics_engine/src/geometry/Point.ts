import { addFn, subFn } from "Lib/helpers";

class Point implements IPoint {
	x: number;
	y: number;
	constructor(x:number, y:number) {
		this.x = x;
		this.y = y;
	}

	copy() {
		return new Point(this.x, this.y);
	}

	pointAlg(A: Point, algFn: AlgFn): Point {
		this.x = algFn(this.x, A.x);
		this.y = algFn(this.y, A.y);
		return this;
	}

	add(A: Point): Point {
		return this.pointAlg(A, addFn);
	}

	sub(A: Point): Point {
		return this.pointAlg(A, subFn);
	}

	static pointAlg(A: Point, B: Point, algFn: AlgFn): Point {
		return new Point(algFn(A.x, B.x), algFn(A.y, B.y))
	}

	static add(A: Point, B: Point): Point {
		return Point.pointAlg(A, B, addFn);
	}

	static sub(A: Point, B: Point): Point {
		return Point.pointAlg(A, B, subFn);
	}
}

export default Point;