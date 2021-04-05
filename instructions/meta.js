const instructionTypes = {
	litReg: 0,
	regLit: 1,
	regLit8: 2,
	regReg: 3,
	regMem: 4,
	memReg: 5,
	litMem: 6,
	regPtrReg: 7,
	litOffReg: 8,
	noArg: 9,
	singleReg: 10,
	singleLit: 11,
};

const instructionTypeSizes = {
	litReg: 4,
	regLit: 4,
	regLit8: 3,
	regReg: 3,
	regMem: 4,
	memReg: 4,
	litMem: 5,
	regPtrReg: 3,
	litOffReg: 5,
	noArg: 1,
	singleReg: 2,
	singleLit: 3,
};

const meta = [
	// state instructions
	{
		instruction: 'NOP',
		opcode:0x00,
		type: instructionTypes.noArg,
		size: instructionTypeSizes.noArg,
		mnemonic: 'nop',
	},
	{
		instruction: 'HLT',
		opcode:0xFF,
		type: instructionTypes.noArg,
		size: instructionTypeSizes.noArg,
		mnemonic: 'hlt'
	},

	// memory instuctions
	{
		instruction: 'MOV_LIT_REG',
		opcode: 0x10,
		type: instructionTypes.litReg,
		size: instructionTypeSizes.litReg,
		mnemonic: 'mov'
	},
	{
		instruction: 'MOV_REG_REG',
		opcode: 0x11,
		type: instructionTypes.regReg,
		size: instructionTypeSizes.regReg,
		mnemonic: 'mov'
	},
	{
		instruction: 'MOV_REG_MEM',
		opcode: 0x12,
		type: instructionTypes.regMem,
		size: instructionTypeSizes.regMem,
		mnemonic: 'mov'
	},
	{
		instruction: 'MOV_MEM_REG',
		opcode: 0x13,
		type: instructionTypes.memReg,
		size: instructionTypeSizes.memReg,
		mnemonic: 'mov'
	},
	{
		instruction: 'MOV_LIT_MEM',
		opcode: 0x14,
		type: instructionTypes.litMem,
		size: instructionTypeSizes.litMem,
		mnemonic: 'mov'
	},
	{
		instruction: 'MOV_REG_PTR_REG',
		opcode:0x15,
		type: instructionTypes.regPtrReg,
		size: instructionTypeSizes.regPtrReg,
		mnemonic: 'mov'
	},
	{
		instruction: 'MOV_LIT_OFF_REG',
		opcode: 0x16,
		type: instructionTypes.litOffReg,
		size: instructionTypeSizes.litOffReg,
		mnemonic: 'mov'
	},

	// stack instructions
	{
		instruction: 'PSH_LIT',
		opcode: 0x17,
		type: instructionTypes.singleLit,
		size: instructionTypeSizes.singleLit,
		mnemonic: 'psh'
	},
	{
		instruction: 'PSH_REG',
		opcode: 0x18,
		type: instructionTypes.singleReg,
		size: instructionTypeSizes.singleReg,
		mnemonic: 'psh'
	},
	{
		instruction: 'PSH_MEM',
		opcode: 0x19
	},
	{
		instruction: 'POP_REG',
		opcode: 0x1A,
		type: instructionTypes.singleReg,
		size: instructionTypeSizes.singleReg,
		mnemonic: 'pop'
	},

	// arithmetic  and logic instructions
	{
		instruction: 'ADD_LIT_REG',
		opcode: 0x1B,
		type: instructionTypes.litReg,
		size: instructionTypeSizes.litReg,
		mnemonic: 'add'
	},
	{
		instruction: 'ADD_REG_REG',
		opcode: 0x1C,
		type: instructionTypes.regReg,
		size: instructionTypeSizes.regReg,
		mnemonic: 'add'
	},
	{
		instruction: 'SUB_LIT_REG',
		opcode: 0x1D,
		type: instructionTypes.litReg,
		size: instructionTypeSizes.litReg,
		mnemonic: 'sub'
	},
	{
		instruction: 'SUB_REG_LIT',
		opcode: 0x1E,
		type: instructionTypes.regLit,
		size: instructionTypeSizes.regLit,
		mnemonic: 'sub'
	},
	{
		instruction: 'SUB_REG_REG',
		opcode: 0x1F,
		type: instructionTypes.regReg,
		size: instructionTypeSizes.regReg,
		mnemonic: 'sub'
	},
	{
		instruction: 'MUL_LIT_REG',
		opcode: 0x20,
		type: instructionTypes.litReg,
		size: instructionTypeSizes.litReg,
		mnemonic: 'mul'
	},
	{
		instruction: 'MUL_REG_REG',
		opcode: 0x21,
		type: instructionTypes.regReg,
		size: instructionTypeSizes.regReg,
		mnemonic: 'mul'
	},
	//const DIV_LIT 			= 0x22
	//const ODIV_LIT			= 0x23
	//const DIV_REG 			= 0x24
	//const ODIV_REG 			= 0x25
	{
		instruction: 'LSF_REG_LIT',
		opcode: 0x26,
		type: instructionTypes.regLit,
		size: instructionTypeSizes.regLit,
		mnemonic: 'lsf'
	},
	{
		instruction: 'LSF_REG_REG',
		opcode: 0x27,
		type: instructionTypes.regReg,
		size: instructionTypeSizes.regReg,
		mnemonic: 'lsf'
	},
	//const OLSH_LIT 			= 0x28
	//const OLSH_REG 			= 0x29
	{
		instruction: 'RSF_REG_LIT',
		opcode: 0x2A,
		type: instructionTypes.regLit,
		size: instructionTypeSizes.regLit,
		mnemonic: 'rsf'
	},
	{
		instruction: 'RSF_REG_REG',
		opcode: 0x2B,
		type: instructionTypes.regLit,
		size: instructionTypeSizes.regLit,
		mnemonic: 'rsf'
	},
	//const ORSH_LIT 			= 0x2C
	//const ORSH_REG 			= 0x2D
	{
		instruction: 'AND_LIT_REG',
		opcode: 0x2E,
		type: instructionTypes.litReg,
		size: instructionTypeSizes.litReg,
		mnemonic: 'and'
	},
	{
		instruction: 'AND_REG_REG',
		opcode: 0x2F,
		type: instructionTypes.regReg,
		size: instructionTypeSizes.regReg,
		mnemonic: 'and'
	},
	{
		instruction: 'OR_LIT_REG',
		opcode: 0x30,
		type: instructionTypes.litReg,
		size: instructionTypeSizes.litReg,
		mnemonic: 'or'
	},
	{
		instruction: 'OR_REG_REG',
		opcode: 0x31,
		type: instructionTypes.regReg,
		size: instructionTypeSizes.regReg,
		mnemonic: 'or'
	},
	{
		instruction: 'XOR_LIT_REG',
		opcode: 0x32,
		type: instructionTypes.litReg,
		size: instructionTypeSizes.litReg,
		mnemonic: 'xor'
	},
	{
		instruction: 'XOR_REG_REG',
		opcode: 0x33,
		type: instructionTypes.regReg,
		size: instructionTypeSizes.regReg,
		mnemonic: 'xor'
	},
	{
		instruction: 'NOT',
		opcode: 0x34,
		type: instructionTypes.singleReg,
		size: instructionTypeSizes.singleReg,
		mnemonic: 'not'
	},
	{
		instruction: 'INC_REG',
		opcode: 0x35,
		type: instructionTypes.singleReg,
		size: instructionTypeSizes.singleReg,
		mnemonic: 'inc'
	},
	{
		instruction: 'DEC_REG',
		opcode: 0x36,
		type: instructionTypes.singleReg,
		size: instructionTypeSizes.singleReg,
		mnemonic: 'dec'
	},
	//const SWAP 					= 0x37
	//const BIT_REG 			= 0x38
	//const CLR_BIT 			= 0x39

	// control instructions
	//const JMP_LIT 			= 0x3A
	//const JMP_REG 			= 0x3B
	//const JMP_LR_S			= 0x3C
	//const JMP_LR_U			= 0x3D
	{
		instruction: 'JEQ_REG',
		opcode: 0x3E,
		type: instructionTypes.regMem,
		size: instructionTypeSizes.regMem,
		mnemonic: 'jeq'
	},
	{
		instruction: 'JEQ_LIT',
		opcode: 0x3F,
		type: instructionTypes.litMem,
		size: instructionTypeSizes.litMem,
		mnemonic: 'jeq'
	},
	{
		instruction: 'JNE_REG',
		opcode: 0x40,
		type: instructionTypes.regMem,
		size: instructionTypeSizes.regMem,
		mnemonic: 'jne'
	},
	{
		instruction: 'JNE_LIT',
		opcode: 0x41,
		type: instructionTypes.litMem,
		size: instructionTypeSizes.litMem,
		mnemonic: 'jne'
	},
	{
		instruction: 'JLT_REG',
		opcode: 0x42,
		type: instructionTypes.regMem,
		size: instructionTypeSizes.regMem,
		mnemonic: 'jlt'
	},
	{
		instruction: 'JLT_LIT',
		opcode: 0x43,
		type: instructionTypes.litMem,
		size: instructionTypeSizes.litMem,
		mnemonic: 'jlt'
	},
	{
		instruction: 'JGT_REG',
		opcode: 0x44,
		type: instructionTypes.regMem,
		size: instructionTypeSizes.regMem,
		mnemonic: 'jgt'
	},
	{
		instruction: 'JGT_LIT',
		opcode: 0x45,
		type: instructionTypes.litMem,
		size: instructionTypeSizes.litMem,
		mnemonic: 'jgt'
	},
	{
		instruction: 'JLE_REG',
		opcode: 0x46,
		type: instructionTypes.regMem,
		size: instructionTypeSizes.regMem,
		mnemonic: 'jle'
	},
	{
		instruction: 'JLE_LIT',
		opcode: 0x47,
		type: instructionTypes.litMem,
		size: instructionTypeSizes.litMem,
		mnemonic: 'jle'
	},
	{
		instruction: 'JGE_REG',
		opcode: 0x48,
		type: instructionTypes.regMem,
		size: instructionTypeSizes.regMem,
		mnemonic: 'jge'
	},
	{
		instruction: 'JGE_LIT',
		opcode: 0x49,
		type: instructionTypes.litMem,
		size: instructionTypeSizes.litMem,
		mnemonic: 'jge'
	},
	//const JZ 						= 0x4A
	//const JNZ 					= 0x4B
	//const JF_LIT 				= 0x4C
	//const JF_REG 				= 0x4D
	//const JNF_LIT 			= 0x4E
	//const JNF_REG 			= 0x4F

	// comparison instructions
	//const CMP_LIT 			= 0x50
	//const CMP_REG 			= 0x51
	//const CBS_REG_U			= 0x52
	//const CBS_REG_s			= 0x53
	//const CS_REG_U 			= 0x54
	//const CS_REG_S 			= 0x55
	//const CSF_REG_U			= 0x56
	//const CSF_REG_S			= 0x57
	//const RCBS_REG_U		= 0x58
	//const RCBS_REG_S		= 0x59
	//const RCS_REG_U			= 0x5A
	//const RCS_REG_S			= 0x5B
	//const RCSF_REG_U		= 0x5C
	//const RCSF_REG_S		= 0x5D

	// system instructions
	{
		instruction: 'CAL_LIT',
		opcode: 0x5E,
		type: instructionTypes.singleLit,
		size: instructionTypeSizes.singleLit,
		mnemonic: 'cal'
	},
	{
		instruction: 'CAL_REG',
		opcode: 0x5F,
		type: instructionTypes.singleReg,
		size: instructionTypeSizes.singleReg,
		mnemonic: 'cal'
	},
	{
		instruction: 'RET',
		opcode: 0x60,
		type: instructionTypes.noArg,
		size: instructionTypeSizes.noArg,
		mnemonic: 'ret'
	},
]

module.exports = {
	meta,
	instructionTypes
};