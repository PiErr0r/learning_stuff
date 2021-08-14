import Particle from "Particle/Particle";
import Vector from "Geometry/Vector";

class ParticleContact {
	particle: PContact = [new Particle(), null];
	restitution: number = 0;
	contactNormal: Vector = new Vector();
	penetration: number = 0;

	constructor(p1: Particle, p2?: Particle, restitution?:number, penetration?:number) {
		this.particle[0] = p1;
		if (p2 !== undefined) {
			this.particle[1] = p2;
		}
		if (restitution !== undefined) this.restitution = restitution;
		if (penetration !== undefined) this.penetration = penetration;
	}

  resolve(duration: number): void {
		this.resolveVelocity(duration);
		this.resolveInterPenetration(duration);
	}

	calculateSeparatingVelocity(): number {
		const relativeVelocity = this.particle[0].velocity.copy();
		if (this.particle[1] !== null) relativeVelocity.sub(this.particle[1].velocity);
		return relativeVelocity.dot(this.contactNormal);
	}

	private resolveVelocity(duration: number): void {
		const sepVelocity = this.calculateSeparatingVelocity();
		if (sepVelocity > 0) return;

		let newSepVelocity = sepVelocity * this.restitution;

		const accCausedVelocity = this.particle[0].acceleration.copy();
		if (this.particle[1] !== null) {
			accCausedVelocity.sub(this.particle[1].acceleration);
		}
		const accCausedSepVelocity = accCausedVelocity.dot(this.contactNormal) * duration;
		if (accCausedVelocity < 0) {
			newSepVelocity += this.restitution * accCausedSepVelocity;
			if (newSepVelocity < 0) newSepVelocity = 0;
		}

		const deltaVelocity = newSepVelocity - sepVelocity;
		let totalInverseMass = this.particle[0].inverseMass;
		if (this.particle[1] !== null) totalInverseMass += this.particle[1].inverseMass;

		if (totalInverseMass <= 0) return;
		const impulse = deltaVelocity / totalInverseMass;
		const impulsePerMass = Vector.mul(this.contactNormal, impulse);
		this.particle[0].addScaled(impulsePerMass, this.particle[0].inverseMass);

		if (this.particle[1] !== null) {
			this.particle[1].addScaled(impulsePerMass, -this.particle[1].inverseMass);
		}
	}

	private resolveInterPenetration(duration: number): void {
		if (this.penetration <= 0) return;

		let totalInverseMass = this.particle[0].inverseMass;
		if (this.particle[1] !== null) totalInverseMass += this.particle[1].inverseMass;

		if (totalInverseMass <= 0) return;

		const movePerIMass = Vector.mul(this.contactNormal, -this.penetration/totalInverseMass);

		this.particle[0].velocity.addScaled(movePerIMass, this.particle[0].inverseMass);
		if (this.particle[1] !== null) {
			this.particle[1].velocity.addScaled(movePerIMass, this.particle[1].inverseMass);
		}
	}

}

export default ParticleContact;