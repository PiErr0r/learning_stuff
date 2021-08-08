import Vector from "Geometry/Vector";
import Particle from "./Particle";

class ParticleGravity implements IParticleForceGenerator {
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

export default ParticleGravity;