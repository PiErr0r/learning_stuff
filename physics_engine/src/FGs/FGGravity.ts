import Particle from "Particle/Particle";
import Vector from "Geometry/Vector";

class FGGravity implements IForceGenerator {
	gravity: Vector = new Vector(0, -10, 0);
	constructor(g?:Vector) {
		if (g !== undefined) {
			this.gravity = g;
		}
	}
	
	updateForce(particle: Particle, duration: number): void {
		if (!particle.hasFiniteMass()) return;
		particle.addForce(Vector.mul(this.gravity, particle.getMass()));
	}
}

export default FGGravity;