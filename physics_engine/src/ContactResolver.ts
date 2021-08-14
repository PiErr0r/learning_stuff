import ParticleContact from "Particle/ParticleContact";

class ContactResolver {
	protected iterations: number;
	protected iterationsUsed: number = 0;
	constructor (iterations: number) {
		this.iterations = iterations;
	}

	setIterations(i: number) {
		this.iterations = i;
	}

	resolveContacts(contactArray: ParticleContact[], numContacts: number, duration: number):void {
		this.iterationsUsed = 0;
		while (this.iterationsUsed < this.iterations) {
			let max = 0;
			let maxIndex = numContacts;
			for (let i = 0; i < numContacts; ++i) {
				const sepVel = contactArray[i].calculateSeparatingVelocity();
				if (sepVel < max) {
					max = sepVel;
					maxIndex = i;
				}
			}
			contactArray[maxIndex].resolve(duration);
			++this.iterationsUsed;
		}
	}
}

export default ContactResolver;