import Particle from "Particle/Particle";

class FGSpring implements IForceGenerator {
	other: Particle;
	springConstant: number;
	restLength: number;
	constructor(other:Particle, springConstant:number, restLength:number) {
		this.other = other;
		this.springConstant = springConstant;
		this.restLength = restLength;
	}

	updateForce(particle: Particle, duration: number):void {
		const force = particle.position.copy();
		force.sub(this.other.position);
		const m = this.springConstant * Math.abs(force.magnitude() - this.restLength);
		force.normalize();
		force.mul(-m);
		particle.addForce(force);
	}
}

export default FGSpring;