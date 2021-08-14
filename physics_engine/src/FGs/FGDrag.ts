import Particle from "./Particle";

class FGDrag implements IForceGenerator {
	k1: number = 0; // coeff velocity drag
	k2: number = 0; // coeff velocity drag squared
	constructor(k1?:number, k2?:number) {
		if (k1 !== undefined) this.k1 = k1;
		if (k2 !== undefined) this.k2 = k2;
	}

	updateForce(particle: Particle, duration: number):void {
		const force = particle.velocity.copy();
		const m = force.magnitude();
		const dragCoeff = this.k1 * m + this.k2 * m * m;
		force.normalize();
		force.mul(-dragCoeff);
		particle.addForce(force);
	}
}

export default FGDrag;