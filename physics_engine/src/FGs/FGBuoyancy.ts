import Particle from "./Particle";
import Vector from "Geometry/Vector";

class FGBuoyancy implements IForceGenerator {
	maxDepth: number;
	volume: number;
	liquidH: number;
	liquidRo: number;
	constructor(maxDepth:number, volume:number, liquidH:number, liquidRo:number = 1000) {
		this.maxDepth = maxDepth;
		this.volume = volume;
		this.liquidH = liquidH;
		this.liquidRo = liquidRo;
	}

	updateForce(particle: Particle, duration: number): void {
		const depth = particle.position.y;
		const force = new Vector();
		if (depth >= this.liquidH + this.maxDepth) return;
		if (depth <= this.liquidH - this.maxDepth) {
			force.y = this.liquidRo * this.volume;
			particle.addForce(force);
			return;
		}
		force.y = this.liquidRo * this.volume * 
			Math.abs(depth - this.maxDepth - this.liquidH) / (2 * this.maxDepth);
		particle.addForce(force);
	}
}

export default FGBuoyancy;