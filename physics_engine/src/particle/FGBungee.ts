import Particle from "./Particle";

class FGBungee implements IForceGenerator {
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
		let m = force.magnitude();
		if (m < this.restLength) return;
		m = this.springConstant * (this.restLength - m);
		force.normalize();
		force.mul(-m);
		particle.addForce(force);
	}
}

export default FGBungee;