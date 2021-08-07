import { addFn, subFn, mulFn, divFn } from "./helpers";
import { eqFn, leqFn, geqFn, ltFn, gtFn } from "./helpers"

type param = 'x'|'y'|'z';
const params:param[] = ['x', 'y', 'z'];

class Vector implements IVector {
	x:number;
	y:number;
	z:number;
	h:number = 1;
	constructor(x?:number, y?:number, z?:number) {
		this.x = x === undefined ? 0 : x;
		this.y = y === undefined ? 0 : y;
		this.z = z === undefined ? 0 : z;
	}

	copy(): Vector {
		return new Vector(this.x, this.y, this.z);
	}

	log(): void {
		const Obj:IVector = {x:0,y:0,z:0,h:0};
		params.forEach((p:param) => {
			Obj[p] = this[p];
		});
		console.log(Obj);
	}

	vectorAlg(A: number|Vector, algFn:AlgFn): Vector {
		if (typeof A === "number") {
			params.forEach((p:param) => {
				this[p] = algFn(this[p], A);
			})
		} else {
			params.forEach((p:param) => {
				this[p] = algFn(this[p], A[p]);
			})
		}
		return this;
	}
	add(A: Vector): Vector { return this.vectorAlg(A, addFn); }
	sub(A: Vector): Vector { return this.vectorAlg(A, subFn);	}
	mul(a: number): Vector { return this.vectorAlg(a, mulFn); }
	div(a: number): Vector { return this.vectorAlg(a, divFn); }
	addScaled(A:Vector, s:number) {
		return this.add(Vector.mul(A, s));
	}

	vectorBool(A: Vector, boolFn: ConditionFn) {
		let res = true;
		params.forEach((p:param) => res &&= boolFn(this[p], A[p]));
		return res;
	}
	eq(A: Vector) { return this.vectorBool(A, eqFn); }
	gt(A: Vector) { return this.vectorBool(A, gtFn); }
	lt(A: Vector) { return this.vectorBool(A, ltFn); }
	geq(A: Vector) { return this.vectorBool(A, geqFn); }
	leq(A: Vector) { return this.vectorBool(A, leqFn); }

	dot(A: Vector): number {
		let sum = 0;
		params.forEach((p:param) => {
			sum += this[p] * A[p];
		});
		return sum;
	}

	cross(A: Vector): Vector {
		return new Vector(
			this.y * A.z - this.z * A.y,
			this.z * A.x - this.x * A.z,
			this.x * A.y - this.y * A.x
		);
	}

	magnitude(): number {
		let sum = 0;
		params.forEach((p:param) => {
			sum += this[p] * this[p];
		})
		return Math.sqrt(sum);
	}

	squareMagniture(): number {
		let sum = 0;
		params.forEach((p:param) => {
			sum += this[p] * this[p];
		})
		return sum;
	}

	normalize(): Vector {
		const m = this.magnitude();
		return this.div(m);
	}

	invert(): Vector {
		params.forEach((p:param) => {
			this[p] *= -1;
		});
		return this;
	}

	static vectorAlg(A: Vector, B: Vector|number, algFn:AlgFn): Vector {
		if (typeof B === "number") {
			return new Vector (algFn(A.x, B), algFn(A.y, B), algFn(A.z, B));
		} else {
			return new Vector (algFn(A.x, B.x), algFn(A.y, B.y), algFn(A.z, B.z));
		}
	}
	static add(A: Vector, B: Vector): Vector { return Vector.vectorAlg(A, B, addFn); }
	static sub(A: Vector, B: Vector): Vector { return Vector.vectorAlg(A, B, subFn); }
	static mul(A: Vector, B:number): Vector { return Vector.vectorAlg(A, B, mulFn); }
	static div(A: Vector, B:number): Vector { return Vector.vectorAlg(A, B, divFn); }
	static addScaled(A:Vector, B:Vector, s:number) {
		return Vector.add(A, Vector.mul(B, s));
	}

	static vectorBool(A: Vector, B:Vector, boolFn: ConditionFn) {
		let res = true;
		params.forEach((p:param) => res &&= boolFn(A[p], B[p]));
		return res;
	}
	static eq(A: Vector, B: Vector) { return Vector.vectorBool(A, B, eqFn); }
	static gt(A: Vector, B: Vector) { return Vector.vectorBool(A, B, gtFn); }
	static lt(A: Vector, B: Vector) { return Vector.vectorBool(A, B, ltFn); }
	static geq(A: Vector, B: Vector) { return Vector.vectorBool(A, B, geqFn); }
	static leq(A: Vector, B: Vector) { return Vector.vectorBool(A, B, leqFn); }
}

export default Vector;