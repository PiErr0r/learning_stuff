import Blockchain from './blockchain';
import Block from './block';

let blocksToAdd:number = 5;

const PolyChain:Blockchain = new Blockchain();

for (let i = 0; i < blocksToAdd; ++i) {
	PolyChain.addNewBlock(new Block({ sender: 'PiErr0r', reciever: 'who-ever', message: `Block: ${PolyChain.chain.length} has been added to the chain` }));
}

PolyChain.chain.forEach(block => {
	block.print();
})