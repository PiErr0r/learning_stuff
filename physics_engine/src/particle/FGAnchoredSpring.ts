import Particle from "./Particle";
import Vector from "Geometry/Vector";

class FGAnchoredSpring implements IForceGenerator {
	anchor: Vector;
	springConstant: number;
	restLength: number;
	constructor(anchor:Vector, springConstant:number, restLength:number) {
		this.anchor = anchor;
		this.springConstant = springConstant;
		this.restLength = restLength;
	}

	updateForce(particle: Particle, duration: number): void {
		const force = particle.position.copy();
		force.sub(this.anchor);
		const m = this.springConstant * Math.abs(force.magnitude() - this.restLength);
		force.normalize();
		force.mul(-m);
		particle.addForce(force);
	}
}

export default FGAnchoredSpring;