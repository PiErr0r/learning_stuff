import Vector from "Geometry/Vector";

class Particle implements IParticle {
	position: Vector;
	velocity: Vector;
	acceleration: Vector;
	private _forceAcc: Vector = new Vector();
	private _damping: number = 0.995;
	private _inverseMass: number = 0;
	constructor(mass?:number, p?:Vector, v?:Vector, a?:Vector, damping?:number) {
		if (mass === 0) throw new Error("Particle cannot have mass 0");
		if (mass !== undefined) this._inverseMass = 1 / mass;
		this.position = p === undefined ? new Vector() : p;
		this.velocity = v === undefined ? new Vector() : v;
		this.acceleration = a === undefined ? new Vector() : a;
		if (damping !== undefined) this._damping = damping;
	}

	copy(): Particle {
		return new Particle(
			1/this._inverseMass,
			this.position.copy(),
			this.velocity.copy(),
			this.acceleration.copy(),
			this._damping
		)
	}

	getMass():number {
		return 1 / this._inverseMass;
	}
	setMass(m:number) {
		if (m === 0) throw new Error("Particle cannot have mass 0");
		this._inverseMass = 1 / m;
	}
	get inverseMass():number {
		return this._inverseMass
	}
	set inverseMass(value:number) {
		this._inverseMass = value;
	}

	get damping():number {
		return this._damping;
	}
	set damping(value:number) {
		this._damping = value;
	}

	logForceAcc(p?:'x'|'y'|'z'):void {
		if (p === undefined) 	
			console.log(this._forceAcc);
		else
			console.log(this._forceAcc[p]);
	}

	integrate(t:number): void {
		if (t === 0) throw new Error("Time difference cannot be 0");

		this.position.addScaled(this.velocity, t); // add here a * (t^2 / 2) if necessary
		// // bounce functionality
		// if (this.position.y <= 100) {
		// 	this.position.y = 100;
		// 	this.velocity.y *= -0.8;
		// 	this.acceleration.y *= -0.8;
		// }
		const resAcceleration = this.acceleration.copy();
		resAcceleration.addScaled(this._forceAcc, this._inverseMass);
		this.velocity.addScaled(resAcceleration, t);
		this.velocity.mul(Math.pow(this._damping, t));
	}

	clearAcc() {
		this._forceAcc.clear();
	}

	addForce(f:Vector) {
		this._forceAcc.add(f);
	}

	hasFiniteMass(): boolean {
		return this._inverseMass !== 0;
	}
}

export default Particle;