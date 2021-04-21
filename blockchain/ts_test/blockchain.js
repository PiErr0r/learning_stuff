"use strict";
exports.__esModule = true;
var block_1 = require("./block");
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.difficulty = 4;
        this.chain = [this.createGenesisBlock()];
    }
    Blockchain.prototype.createGenesisBlock = function () {
        return new block_1["default"]({ sender: "", reciever: "", message: "" }, 0, undefined, '0');
    };
    Blockchain.prototype.getLastBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    Blockchain.prototype.addNewBlock = function (newBlock) {
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.index = this.getLastBlock().index + 1;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    };
    Blockchain.prototype.isChainValid = function () {
        for (var i = 0; i < this.chain.length; ++i) {
            if (this.chain[i].hash !== this.chain[i].calculateHash()) {
                throw new Error("Block " + i + " is corrupted");
            }
            if (i > 0 && this.chain[i].previousHash !== this.chain[i - 1].hash) {
                throw new Error("Block " + (i - 1) + " is corrupted");
            }
        }
        return true;
    };
    return Blockchain;
}());
exports["default"] = Blockchain;
