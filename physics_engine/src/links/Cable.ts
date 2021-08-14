import Particle from "Particle/Particle";
import ParticleContact from "Particle/ParticleContact";
import Vector from "Geometry/Vector";
import Link from "./Link";

class Cable extends Link {
	maxLength: number = 0;
	restitution: number = 0;
	constructor(p1:Particle, p2: Particle, maxLength:number, restitution:number) {
		super(p1, p2);
		this.maxLength = maxLength;
		this.restitution = restitution;
	}

	fillContact(contact: ParticleContact, limit: number): number {
		const length = this.currentLength();
		if (length < this.maxLength) return 0;

		contact.particle[0] = this.particle[0];
		contact.particle[1] = this.particle[1];

		const normal = Vector.sub(this.particle[1].position, this.particle[0].position);
		normal.normalize();
		
		contact.contactNormal = normal;
		contact.penetration = length - this.maxLength;
		contact.restitution = this.restitution;

		return 1;
	}
}

export default Cable;