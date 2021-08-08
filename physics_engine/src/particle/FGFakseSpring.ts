import Particle from "./Particle";
import Vector from "Geometry/Vector";

class FGFakeSpring implements IForceGenerator {
	anchor: Vector;
	springConstant: number;
	damping: number;
	constructor(anchor:Vector, springConstant:number, damping:number) {
		this.anchor = anchor
		this.springConstant = springConstant
		this.damping = damping
	}

	updateForce(particle: Particle, duration: number): void {
		if (!particle.hasFiniteMass()) return;
		const pos = particle.position.copy()
			.sub(this.anchor);

		const gamma = 0.5 * Math.sqrt(4 * this.springConstant - this.damping * this.damping);
		if (gamma === 0) return;

		const c = pos.copy()
			.mul(this.damping / (2 * gamma))
			.addScaled(particle.velocity, 1 / gamma);
		const target = pos.copy()
			.mul(Math.cos(gamma * duration))
			.addScaled(c, Math.sin(gamma * duration));
		target.mul(Math.exp(-0.5 * duration * this.damping));

		const accel = Vector.sub(target, pos)
			.mul(1 / (duration * duration))
			.addScaled(particle.velocity, -duration) // this should be subScaled but since there is no such method we use negative duration

		particle.addForce(Vector.mul(accel, particle.getMass()));
	}
}

export default FGFakeSpring;