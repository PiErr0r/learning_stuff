import Particle from "Particle/Particle";
import ParticleContact from "Particle/ParticleContact";
import ParticleForceRegistry from "Particle/ParticleForceRegistry";
import ContactResolver from "Contact/ContactResolver";

interface ParticleRegistration {
	particle: Particle;
	next: ParticleRegistration|null;
}

interface ContactGenRegistration {
	gen: IContactGenerator;
	next: ContactGenRegistration;
}

class ParticleWorld {
	firstParticle: ParticleRegistration|null = null;
	registry: ParticleForceRegistry = new ParticleForceRegistry();
	resolver: ContactResolver = new ContactResolver();
	firstContactGen: ContactGenRegistration|null = null;
	contacts: ParticleContact[] = [];
	maxContacts: number;
	iterations: number;
	constructor(maxContacts: number, iterations: number = 0) {
		this.maxContacts = maxContacts;
		this.iterations = iterations;
	}

	startFrame(): void {
		let reg = this.firstParticle;
		while (reg !== null) {
			reg.particle.clearAcc();
			reg = reg.next;
		}
	}

	generateContacts(): number {
		let limit = this.maxContacts;
		let i = 0;
		let reg = this.firstContactGen;

		while (reg !== null) {
			const used = reg.gen.addContact(this.contacts[i], limit);
			limit -= used;
			i += used;

			if (limit <= 0) break;
			reg = reg.next;
		}
		return this.maxContacts - limit;
	}

	integrate(duration: number): void {
		let reg = this.firstParticle;
		while (reg !== null) {
			reg.particle.integrate(duration);
			reg = reg.next;
		}
	}

	runPhysics(duration: number): void {
		this.registry.updateForces(duration);
		this.integrate(duration);
		const usedContacts = this.generateContacts();
		this.resolver.setIterations(2 * usedContacts);
		this.resolver.resolveContacts(this.contacts, usedContacts, duration);
	}

}

export default ParticleWorld;