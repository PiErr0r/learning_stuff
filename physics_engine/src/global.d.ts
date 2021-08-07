type ConditionFn = (a:number, b:number) => boolean;
type AlgFn = (a:number, b:number) => number;
type SortPointsFn = (a:Point, b:Point) => number;
type theme = "dark"|"light";

interface IPoint {
	x: number,
	y: number
}

interface PointOpts {
	fillStyle?: string;
	radius?: number;
}

interface IVector {
	x:number;
	y:number;
	z:number;
	h:number; // homogenous coordinate
}