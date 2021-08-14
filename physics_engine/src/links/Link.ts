import Particle from "Particle/Particle";
import ParticleContact from "Particle/ParticleContact";
import Vector from "Geometry/Vector";

class Link implements ILink {
	particle: PContact = [null, null];
	constructor(p1: Particle, p2: Particle) {
		this.particle[0] = p1;
		this.particle[1] = p2;
	}

	protected currentLength() {
		const relativePos = Vector.sub(this.particle[0].position, this.particle[0].position);
		return relativePos.magnitude();
	}

	fillContact(contact: ParticleContact, limit: number): number {
		return 0;	
	}
}

export default Link;