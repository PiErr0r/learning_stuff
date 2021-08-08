// condition functions
export const eqFn:	ConditionFn = (a, b) => a === b;
export const leqFn:	ConditionFn = (a, b) => a <= b;
export const geqFn:	ConditionFn = (a, b) => a >= b;
export const gtFn:	ConditionFn = (a, b) => a > b;
export const ltFn:	ConditionFn = (a, b) => a < b;

// algebraic functions
export const addFn:AlgFn = (a, b) => a + b;
export const subFn:AlgFn = (a, b) => a - b;
export const mulFn:AlgFn = (a, b) => a * b;
export const divFn:AlgFn = (a, b) => a / b;

// sort points in clockwise direction
export const clockWise:SortPointsFn = (a, b) => ( Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x));

// rgn
export const newRand:SAlgFn = (n) => Math.floor(Math.random() * n);

// functions to generate position around some point
export const getX = (i:number, n:number, r: number, x:number) => (x+r*Math.cos(2*Math.PI*i/n));
export const getY = (i:number, n:number, r: number, y:number) => (y+r*Math.sin(2*Math.PI*i/n));
// get mid y and x position from array of particles
export const getMidX = (p:IParticle[]) => (p.reduce((a, c) => (a + c.position.x), 0)/p.length);
export const getMidY = (p:IParticle[]) => (p.reduce((a, c) => (a + c.position.y), 0)/p.length);


export const getRandomColor = () => {
	const tmp = Math.random();
	switch(true) {
		case tmp < 0.2: return "#f00";
		case tmp < 0.4: return "#0f0";
		case tmp < 0.6: return "#00f";
		case tmp < 0.8: return "#f0f";
		default: 				return "#ff0";
	}
}