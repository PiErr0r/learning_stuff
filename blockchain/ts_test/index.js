"use strict";
exports.__esModule = true;
var blockchain_1 = require("./blockchain");
var block_1 = require("./block");
var blocksToAdd = 5;
var PolyChain = new blockchain_1["default"]();
for (var i = 0; i < blocksToAdd; ++i) {
    PolyChain.addNewBlock(new block_1["default"]({ sender: 'PiErr0r', reciever: 'who-ever', message: "Block: " + PolyChain.chain.length + " has been added to the chain" }));
}
PolyChain.chain.forEach(function (block) {
    block.print();
});
