import Particle from "Particle/Particle";
import ParticleContact from "Particle/ParticleContact";
import Vector from "Geometry/Vector";
import Link from "./Link";

class Rod extends Link {
	length: number;
	constructor(p1:Particle, p2: Particle, length:number) {
		super(p1, p2);
		this.length = length;
	}

	fillContact(contact: ParticleContact, limit: number): number {
		const currentLen = this.currentLength();
		if (currentLen === this.length) return 0;

		contact.particle[0] = this.particle[0];
		contact.particle[1] = this.particle[1];

		const normal = Vector.sub(this.particle[0].position, this.particle[1].position);
		normal.normalize();

		if (currentLen > this.length) {
			contact.contactNormal = normal;
			contact.penetration = currentLen - this.length;
		} else {
			contact.contactNormal = normal.mul(-1);
			contact.penetration = this.length - currentLen;
		}

		return 1;
	}
}

export default Rod;