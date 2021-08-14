type ConditionFn = (a:number, b:number) => boolean;
type SAlgFn = (n:number) => number;
type AlgFn = (a:number, b:number) => number;
type SortPointsFn = (a:Point, b:Point) => number;
type theme = "dark"|"light";

interface IPoint {
	x: number,
	y: number
}

interface DrawOpts {
	fillStyle?: string;
	strokeStyle?: string;
	radius?: number;
	drawPoints?: boolean;
	lineWidth?: number;
}

interface IVector {
	x:number;
	y:number;
	z:number;
	h:number; // homogenous coordinate
}

interface IParticle {
	position: Vector,
	velocity: Vector,
	acceleration: Vector
}

type PContact = [Particle, Particle|null];

interface IForceGenerator {
	updateForce: (p:Particle, duration:number) => void;
}

interface IContactGenerator {
	addContact: (contact: ParticleContact, limit: number) => number;
}

interface ILink {
	particle: PContact;
	fillContact: (contact: ParticleContact, limit: number) => number;
}