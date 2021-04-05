const A = require('arcsecond');
const {
	litReg,
	regLit,
	regReg,
	regMem,
	memReg,
	litMem,
	regPtrReg,
	litOffReg,
	noArg,
	singleReg,
	singleLit,
} = require('./formats')

const mov = A.choice([
	regReg('mov', 'MOV_REG_REG'),
	litReg('mov', 'MOV_LIT_REG'),
	memReg('mov', 'MOV_MEM_REG'),
	regMem('mov', 'MOV_REG_MEM'),
	litMem('mov', 'MOV_LIT_MEM'),
	regPtrReg('mov', 'MOV_REG_PTR_REG'),
	litOffReg('mov', 'MOV_LIT_OFF_REG'),
]);

const add = A.choice([
	litReg('add', 'ADD_LIT_REG'),
	regReg('add', 'ADD_REG_REG'),
]);

const sub = A.choice([
	litReg('sub', 'SUB_LIT_REG'),
	regReg('sub', 'SUB_REG_REG'),
	regLit('sub', 'SUB_REG_LIT'),
]);

const mul = A.choice([
	litReg('mul', 'MUL_LIT_REG'),
	regReg('mul', 'MUL_REG_REG'),
]);

const lsf = A.choice([
	regLit('lsf', 'LSF_REG_LIT'),
	regReg('lsf', 'LSF_REG_REG'),
]);

const rsf = A.choice([
	regLit('rsf', 'RSF_REG_LIT'),
	regReg('rsf', 'RSF_REG_REG'),
]);

const and = A.choice([
	litReg('and', 'AND_LIT_REG'),
	regReg('and', 'AND_REG_REG'),
]);

const or = A.choice([
	litReg('or', 'OR_LIT_REG'),
	regReg('or', 'OR_REG_REG'),
]);

const xor = A.choice([
	litReg('xor', 'XOR_LIT_REG'),
	regReg('xor', 'XOR_REG_REG'),
]);

const inc = singleReg('inc', 'INC_REG');
const dec = singleReg('dec', 'DEC_REG');
const not = singleReg('not', 'NOT');

const jeq = A.choice([
	regMem('jeq', 'JEQ_REG'),
	litMem('jeq', 'JEQ_LIT'),
]);

const jne = A.choice([
	regMem('jne', 'JNE_REG'),
	litMem('jne', 'JNE_LIT'),
]);

const jlt = A.choice([
	regMem('jlt', 'JLT_REG'),
	litMem('jlt', 'JLT_LIT'),
]);

const jle = A.choice([
	regMem('jle', 'JLE_REG'),
	litMem('jle', 'JLE_LIT'),
]);

const jgt = A.choice([
	regMem('jgt', 'JGT_REG'),
	litMem('jgt', 'JGT_LIT'),
]);

const jge = A.choice([
	regMem('jge', 'JGE_REG'),
	litMem('jge', 'JGE_LIT'),
]);

const psh = A.choice([
	singleLit('psh', 'PSH_LIT'),
	singleReg('psh', 'PSH_REG'),
]);

const pop = singleReg('pop', 'POP_REG');

const cal = A.choice([
	singleLit('cal', 'CAL_LIT'),
	singleReg('cal', 'CAL_REG'),
]);

const ret = noArg('ret', 'RET');
const hlt = noArg('hlt', 'HLT');

module.exports = A.choice([
	mov,
	add,
	sub,
	mul,
	lsf,
	rsf,
	and,
	or,
	xor,
	inc,
	dec,
	not,
	jeq,
	jne,
	jlt,
	jle,
	jgt,
	jge,
	psh,
	pop,
	cal,
	ret,
	hlt,
]);