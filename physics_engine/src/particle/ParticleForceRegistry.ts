import Particle from "./Particle";

interface ParticleForceRegistration {
	particle: Particle;
	fg: IForceGenerator;
}
type Registry = Array<ParticleForceRegistration>;

class ParticleForceRegistry {
	registrations: Registry = [];
	
	add(particle: Particle, fg: IForceGenerator):void {
		this.registrations.push({ particle, fg });
	}

	remove(particle: Particle, fg: IForceGenerator):void {
		let toRemove = -1;
		for (let i = 0; i < this.registrations.length; ++i) {
			if (particle === this.registrations[i].particle && 
					fg === this.registrations[i].fg) 
			{
				toRemove = i;
				break;
			}
		}
		if (toRemove !== -1) {
			this.registrations.splice(toRemove, 1);
		}
	}

	clear():void {
		this.registrations = [];
	}

	updateForces(duration:number):void {
		for (let i = 0; i < this.registrations.length; ++i) {
			this.registrations[i].fg.updateForce(
				this.registrations[i].particle, duration
			);
		}
	}
}

export default ParticleForceRegistry;