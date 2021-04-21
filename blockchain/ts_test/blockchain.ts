import Block from "./block";

class Blockchain {
	chain: Block[]
	readonly difficulty: number = 4
	constructor() {
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock():Block {
		return new Block({sender: "", reciever: "", message: ""}, 0, undefined, '0');
	}

	getLastBlock():Block {
		return this.chain[this.chain.length - 1];
	}

	addNewBlock(newBlock:Block):void {
		newBlock.previousHash = this.getLastBlock().hash;
		newBlock.index = this.getLastBlock().index + 1;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isChainValid():boolean {
		for (let i = 0; i < this.chain.length; ++i) {
			if (this.chain[i].hash !== this.chain[i].calculateHash()) {
				throw new Error(`Block ${i} is corrupted`);
			}
			if (i > 0 && this.chain[i].previousHash !== this.chain[i-1].hash) {
				throw new Error(`Block ${i-1} is corrupted`);
			}
		}
		return true;
	}
}

export default Blockchain;