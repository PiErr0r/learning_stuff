// import { SHA256 } from 'crypto-js';
const { SHA256 } = require('crypto-js');

type Data = {
	sender: string;
	reciever: string;
	message: string;
}

class Block {
	data: Data
	debug: boolean = true
	index: number = 0
	ts: string = String(new Date())
	nonce: number
	previousHash: string = ""
	hash: string
	constructor(data: Data, index?:number, ts?:string, previousHash?:string) {
		this.data = data;
		if (index) this.index = index;
		if (ts) this.ts = ts;

		if (previousHash) this.previousHash = previousHash;
		this.nonce = 0;
		this.hash = this.calculateHash()
	}

	mineBlock(difficulty:number):void {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
			this.hash = this.calculateHash();
			++this.nonce;
		}

		if (this.debug) {
			console.log(`Block: ${this.index} Nonce: ${this.nonce}	Hash: ${this.hash}`);
		}
	}

	calculateHash():string {
		return SHA256(JSON.stringify(this.data) + this.index.toString() + this.ts + this.previousHash + this.nonce.toString()).toString();
	}

	print():void {
		console.log(`Block: ${this.index}; Hash: ${this.hash}`);
	}
}

export default Block;