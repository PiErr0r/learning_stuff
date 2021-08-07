// helpers
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
