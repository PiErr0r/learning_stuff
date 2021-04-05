const { inspect } = require('util');
const A = require('arcsecond');
const T = require('./types');
const instructionParser = require('./instructions');

const deepLog = x => console.log(inspect(x, { depth: Infinity, colors: true }));

const simpleExpr = 'mov $42, r4';
const complexExpr = 'mov [$42 + !loc - ($05 * ($31 + !var) - $07)], r4';
const test1 = 'mov $42  , &r3, r7'
const test2 = 'add r1, r2'
const test3 = 'sub [!loc - $12], r2'

const res = instructionParser.run(test3);
deepLog(res);