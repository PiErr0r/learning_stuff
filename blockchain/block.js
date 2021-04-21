const { SHA256 } = require('crypto-js');

class Block {
	constructor(data, index, ts = String(new Date()), previousHash) {
		this.data = data;
		this.index = index;
		this.ts = ts;

		this.nonce = 0;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	mineBlock(difficulty) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
			++this.nonce;
			this.hash = this.calculateHash()
		}

		console.log(`Block: ${this.index} Nonce: ${this.nonce}	Hash: ${this.hash}`);
	}

	calculateHash() {
		return SHA256(JSON.stringify(this.data) + this.index + this.ts + this.previousHash + this.nonce).toString();
	}
}

module.exports = Block;