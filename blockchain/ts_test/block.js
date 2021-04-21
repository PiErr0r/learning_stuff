"use strict";
exports.__esModule = true;
// import { SHA256 } from 'crypto-js';
var SHA256 = require('crypto-js').SHA256;
var Block = /** @class */ (function () {
    function Block(data, index, ts, previousHash) {
        this.debug = true;
        this.index = 0;
        this.ts = String(new Date());
        this.previousHash = "";
        this.data = data;
        if (index)
            this.index = index;
        if (ts)
            this.ts = ts;
        if (previousHash)
            this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    Block.prototype.mineBlock = function (difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.hash = this.calculateHash();
            ++this.nonce;
        }
        if (this.debug) {
            console.log("Block: " + this.index + " Nonce: " + this.nonce + "\tHash: " + this.hash);
        }
    };
    Block.prototype.calculateHash = function () {
        return SHA256(JSON.stringify(this.data) + this.index.toString() + this.ts + this.previousHash + this.nonce.toString()).toString();
    };
    Block.prototype.print = function () {
        console.log("Block: " + this.index + "; Hash: " + this.hash);
    };
    return Block;
}());
exports["default"] = Block;
