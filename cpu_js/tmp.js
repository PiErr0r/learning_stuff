// state instructions
const NOP = 0x00;
const HLT = 0xFF;

// memory instuctions
const MOV_LIT_REG 		= 0x10;
const MOV_REG_REG 		= 0x11;
const MOV_REG_MEM 		= 0x12;
const MOV_MEM_REG 		= 0x13;
const MOV_LIT_MEM 		= 0x14;
const MOV_REG_PTR_REG = 0x15;
const MOV_LIT_OFF_REG	=  0x16;

// stack instructions
const PSH_LIT 				= 0x17;
const PSH_REG 				= 0x18;
const PSH_MEM 				= 0x19;
const POP_REG 				= 0x1A;

// arithmetic  and logic instructions
const ADD_LIT_REG 		= 0x1B;
const ADD_REG_REG 		= 0x1C;
const SUB_LIT_REG 		= 0x1D;
const SUB_REG_LIT 		= 0x1E;
const SUB_REG_REG 		= 0x1F;
const MUL_LIT_REG			= 0x20;
const MUL_REG_REG			= 0x21;
//const DIV_LIT 			= 0x22;
//const ODIV_LIT			= 0x23;
//const DIV_REG 			= 0x24;
//const ODIV_REG 			= 0x25;
const LSF_LIT_REG			= 0x26;
const LSF_REG_REG			= 0x27;
//const OLSH_LIT 			= 0x28;
//const OLSH_REG 			= 0x29;
const RSF_LIT_REG			= 0x2A;
const RSF_REG_REG			= 0x2B;
//const ORSH_LIT 			= 0x2C;
//const ORSH_REG 			= 0x2D;
const AND_REG_LIT			= 0x2E;
const AND_REG_REG			= 0x2F;
const OR_REG_LIT			= 0x30;
const OR_REG_REG			= 0x31;
const XOR_REG_LIT			= 0x32;
const XOR_REG_REG			= 0x33;
const NOT 						= 0x34;
const INC_REG 				= 0x35;
const DEC_REG 				= 0x36;
//const SWAP 					= 0x37;
//const BIT_REG 			= 0x38;
//const CLR_BIT 			= 0x39;

// control instructions
//const JMP_LIT 			= 0x3A;
//const JMP_REG 			= 0x3B;
//const JMP_LR_S			= 0x3C;
//const JMP_LR_U			= 0x3D;
const JEQ_REG 				= 0x3E
const JEQ_LIT 				= 0x3F
const JNE_REG 				= 0x40;
const JNE_LIT 				= 0x41;
const JLT_REG 				= 0x42;
const JLT_LIT 				= 0x43;
const JGT_REG 				= 0x44;
const JGT_LIT 				= 0x45;
const JLE_REG 				= 0x46;
const JLE_LIT 				= 0x47;
const JGE_REG 				= 0x48;
const JGE_LIT 				= 0x49;
//const JZ 						= 0x4A;
//const JNZ 					= 0x4B;
//const JF_LIT 				= 0x4C;
//const JF_REG 				= 0x4D;
//const JNF_LIT 			= 0x4E;
//const JNF_REG 			= 0x4F;

// comparison instructions
//const CMP_LIT 			= 0x50;
//const CMP_REG 			= 0x51;
//const CBS_REG_U			= 0x52;
//const CBS_REG_s			= 0x53;
//const CS_REG_U 			= 0x54;
//const CS_REG_S 			= 0x55;
//const CSF_REG_U			= 0x56;
//const CSF_REG_S			= 0x57;
//const RCBS_REG_U		= 0x58;
//const RCBS_REG_S		= 0x59;
//const RCS_REG_U			= 0x5A;
//const RCS_REG_S			= 0x5B;
//const RCSF_REG_U		= 0x5C;
//const RCSF_REG_S		= 0x5D;

// system instructions
const CAL_LIT			= 0x5E;
const CAL_REG			= 0x5F;
const RET					= 0x60;

module.exports = {
	NOP,
	HLT,

  MOV_LIT_REG,
  MOV_REG_REG,
  MOV_REG_MEM,
  MOV_MEM_REG,
	MOV_LIT_MEM,
	MOV_REG_PTR_REG,
	MOV_LIT_OFF_REG,

	PSH_LIT,
	PSH_REG,
	PSH_MEM,
	POP_REG,

  ADD_LIT_REG,
  ADD_REG_REG,
	SUB_LIT_REG,
	SUB_REG_LIT,
	SUB_REG_REG,
	MUL_LIT,
	MUL_REG,
	LSF_REG_LIT,
	LSF_REG_REG,
	RSF_REG_LIT,
	RSF_REG_REG,
	AND_REG_LIT,
	AND_REG_REG,
	OR_REG_LIT,
	OR_REG_REG,
	XOR_REG_LIT,
	XOR_REG_REG,
	NOT,
	INC_REG,
	DEC_REG,

	JEQ_REG,
	JEQ_LIT,
	JNE_REG,
	JNE_LIT,
	JLT_REG,
	JLT_LIT,
	JGT_REG,
	JGT_LIT,
	JLE_REG,
	JLE_LIT,
	JGE_REG,
	JGE_LIT,

  CAL_LIT,
  CAL_REG,
  RET,
};
