const Block = require('./block');

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 4;
	}

	createGenesisBlock() {
		return new Block('Genesis Block', 0, undefined, '0');
	}

	getLastBlock() {
		return this.chain[this.chain.length - 1];
	}

	addNewBlock(newBlock) {
		newBlock.previousHash = this.getLastBlock().hash;
		newBlock.index = this.getLastBlock().index + 1;
		newBlock.hash = newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isChainValid() {
		const chain = this.chain;
		for (let i = 0; i < chain.length; ++i) {
			if (chain[i].hash !== chain[i].calculateHash()) {
				throw new Error(`Block ${i} has been corrupted`);
				return false;
			}

			if (i > 0 && chain[i].previousHash !== chain[i-1].hash) {
				throw new Error(`Block ${i-1} has been corrupted`);
				return false;
			}
		}
		return true;
	}
}

let blocksToAdd = 5;

const PolyChain = new Blockchain();

for (let i = 0; i < blocksToAdd; ++i) {
	PolyChain.addNewBlock(new Block({ sender: 'PiErr0r', reciever: 'who-ever', message: `Block: ${PolyChain.chain.length} has been added to the chain` }));
}

PolyChain.chain.forEach(block => {
	console.log(block);
})