const createMemory = require('./createMemory');
const instructions = require('./instructions');

class CPU {
  constructor(memory) {
    this.memory = memory;

    this.registerNames = [
      'ip', 'acc', // instruction pointer, accumulator
      'r1', 'r2', 'r3', 'r4', // general purpose registers
      'r5', 'r6', 'r7', 'r8',
      'sp', 'fp'
    ];

    this.registers = createMemory(this.registerNames.length * 2); // every reg is 2 byte wide
    this.registerMap = this.registerNames.reduce((map, name, i) => {
      map[name] = i * 2;
      return map;
    }, {});

    this.halted = false;
    this.setRegister('sp', 0xFFFF - 1);
    this.setRegister('fp', 0xFFFF - 1);

    this.stackFrameSize = 0;
  }

  debug() {
    this.registerNames.forEach(name => {
      console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`)
    });
    console.log();
  }

  viewMemoryAt(address, n = 8) {
    const nextNBytes = Array.from({length: n}, (_, i) => 
      this.memory.getUint8(address + i)
    ).map(v => `0x${v.toString(16).padStart(2, '0')}`);
    console.log(`0x${address.toString(16).padStart(4, '0')}: ${nextNBytes.join(' ')}`);
  }

  viewRegisterValue(name) {
    if (!name in this.registerMap) {
      throw new Error(`viewRegisterValue: No register found with name: '${name}'`);
    }

    const value = this.getRegister(name);
    console.log(`${name}: ${value.toString(16).padStart(4, '0')}`);
  }

  getRegister(name) {
    if (!(name in this.registerMap)) {
      throw new Error(`getRegister: No register found with name: '${name}'`);
    }

    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegister(name, value) {
    if (!(name in this.registerMap)) {
      throw new Error(`setRegister: No register found with name '${name}'`);
    }

    this.registers.setUint16(this.registerMap[name], value);
  }

  fetch() {
    const nextInstructionAddress = this.getRegister('ip');
    const instruction = this.memory.getUint8(nextInstructionAddress);
    this.setRegister('ip', nextInstructionAddress + 1);
    return instruction;
  }

  fetch16() {
    const nextInstructionAddress = this.getRegister('ip');
    const instruction = this.memory.getUint16(nextInstructionAddress);
    this.setRegister('ip', nextInstructionAddress + 2);
    return instruction;
  }

  fetchRegisterIndex() {
    return (this.fetch() % this.registerNames.length) * 2;
  }

  push(value) {
    const spAddress = this.getRegister('sp');
    this.memory.setUint16(spAddress, value);
    this.setRegister('sp', spAddress - 2);
    this.stackFrameSize += 2;
  }

  pushState() {
    for (let i = 1; i <= 8; ++i) {
      this.push(this.getRegister(`r${i}`)); // push general registers
    }
    this.push(this.getRegister('ip'));
    this.push(this.stackFrameSize + 2); // +2 because sp will increase on push
    this.setRegister('fp', this.getRegister('sp'));
    this.stackFrameSize = 0;
  }

  pop() {
    const nextSpAddress = this.getRegister('sp') + 2;
    this.setRegister('sp', nextSpAddress);
    this.stackFrameSize -= 2;
    return this.memory.getUint16(nextSpAddress);
  }

  popState() {
    const framePointerAddress = this.getRegister('fp');
    this.setRegister('sp', framePointerAddress);
    const stackFrameSize = this.pop();
    this.stackFrameSize = stackFrameSize;
    this.setRegister('ip', this.pop());
    for (let i = 8; i >= 1; --i) {
      this.setRegister(`r${i}`, this.pop());
    }

    const nArgs = this.pop();
    for (let i = 0; i < nArgs; ++i) {
      this.pop();
    }

    this.setRegister('fp', framePointerAddress + stackFrameSize);
  }

  execute(instruction) {
    switch (instruction) {
      case instructions.NOP.opcode: {
        return;
      }
      case instructions.HLT.opcode: {
        return true;
      }

      /***********************
       * memory instructions *
       **********************/
      // move literal to register
      case instructions.MOV_LIT_REG.opcode: {
        const value = this.fetch16();
        const r = this.fetchRegisterIndex();
        this.registers.setUint16(r, value);
        return;
      }
      // move register to register
      case instructions.MOV_REG_REG.opcode: {
        const rFrom = this.fetchRegisterIndex();
        const rTo = this.fetchRegisterIndex();
        this.registers.setUint16(rTo, this.registers.getUint16(rFrom));
        return;
      }
      // move register to memory
      case instructions.MOV_REG_MEM.opcode: {
        const rFrom = this.fetchRegisterIndex();
        const address = this.fetch16();
        this.memory.setUint16(address, this.registers.getUint16(rFrom));
        return;
      }
      // move memory to register
      case instructions.MOV_MEM_REG.opcode: {
        const address = this.fetch16();
        const rTo = this.fetchRegisterIndex();
        this.registers.setUint16(rTo, this.memory.getUint16(address));
        return;
      }
      // move literal to memory
      case instructions.MOV_LIT_MEM.opcode: {
        const value = this.fetch16();
        const address = this.fetch16();
        this.memory.setUint16(address, value);
        return;
      }
      // move register pointer to register
      case instructions.MOV_REG_PTR_REG.opcode: {
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const ptr = this.registers.getUint16(r1);
        const value = this.memory.getUint16(ptr);
        this.registers.setUint16(r2, value);
        return;
      }
      // move literal address + register value to register
      case instructions.MOV_LIT_OFF_REG.opcode: {
        const address = this.fetch16();
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const offset = this.registers.getUint16(r1);

        const value = this.memory.getUint16(address + offset);
        this.registers.setUint16(r2);
        return;
      }

      /**********************
       * stack instructions *
       *********************/
      case instructions.PSH_LIT.opcode: { // push literal
        const value = this.fetch16();
        this.push(value);
        return;
      }
      case instructions.PSH_REG.opcode: { // push register
        const r = this.fetchRegisterIndex();
        this.push(this.registers.getUint16(r));
        return;
      }
      case instructions.POP_REG.opcode: { // pop register
        const r = this.fetchRegisterIndex();
        const value = this.pop();
        this.registers.setUint16(r, value);
        return;
      }

      /*************************************
       * arithmetic and logic instructions *
       ************************************/
      // add literal to register
      case instructions.ADD_LIT_REG.opcode: {
        const value = this.fetch16();
        const r = this.fetchRegisterIndex();
        const rValue = this.registers.getUint16(r);
        this.setRegister('acc', value + rValue);
        return;
      }
      // add register to regiister
      case instructions.ADD_REG_REG.opcode: {
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const rValue1 = this.registers.getUint16(r1);
        const rValue2 = this.registers.getUint16(r2);
        this.setRegister('acc', rValue1 + rValue2);
        return;
      }
      // subtract literal from register
      case instructions.SUB_LIT_REG.opcode: {
        const value = this.fetch16();
        const r = this.fetchRegisterIndex();
        const rValue = this.registers.getUint16(r);
        this.setRegister('acc', rValue - value);
        return;
      }
      // subtract register from literal
      case instructions.SUB_REG_LIT.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.fetch16();
        const rValue = this.registers.getUint16(r);
        this.setRegister('acc', value - rValue);
        return;
      }
      // subtract register from register
      case instructions.SUB_REG_REG.opcode: {
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const rValue1 = this.registers.getUint16(r1);
        const rValue2 = this.registers.getUint16(r2);
        this.setRegister('acc', rValue1 - rValue2);
        return;
      }
      // multiply litrral by register
      case instructions.MUL_LIT_REG.opcode: {
        const value = this.fetch16();
        const r = this.fetchRegisterIndex();
        const rValue = this.registers.getUint16(r);
        this.setRegister('acc', value * rValue);
        return;
      }
      // multiply register by register
      case instructions.MUL_REG_REG.opcode: {
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const rValue1 = this.registers.getUint16(r1);
        const rValue2 = this.registers.getUint16(r2);
        this.setRegister('acc', rValue1 * rValue2);
        return;
      }
      // left shift register by literal
      case instructions.LSF_REG_LIT.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.fetch16();
        const rValue = this.registers.getUint16(r);
        this.registers.setUint16(r, rValue << value);
        return;
      }
      // left shift register by register
      case instructions.LSF_REG_REG.opcode: {
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const rValue1 = this.registers.getUint16(r1);
        const rValue2 = this.registers.getUint16(r2);
        this.registers.setUint16(r1, rValue1 << rValue2);
        return;
      }
      // right shift register by literal
      case instructions.RSF_REG_LIT.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.fetch16();
        const rValue = this.registers.getUint16(r);
        this.registers.setUint16(r, rValue >> value);
        return;
      }
      // right shift register by register
      case instructions.RSF_REG_REG.opcode: {
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const rValue1 = this.registers.getUint16(r1);
        const rValue2 = this.registers.getUint16(r2);
        this.registers.setUint16(r1, rValue1 >> rValue2);
        return;
      }
      // binary and register and literal
      case instructions.AND_LIT_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.fetch16();
        const rValue = this.registers.getUint16(r);
        this.setRegister('acc', rValue & value);
        return;
      }
      // binary and register and register
      case instructions.AND_REG_REG.opcode: {
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const rValue1 = this.registers.getUint16(r1);
        const rValue2 = this.registers.getUint16(r2);
        this.setRegister('acc', rValue1 & rValue2);
        return;
      }
      // binary or register and literal
      case instructions.OR_LIT_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.fetch16();
        const rValue = this.registers.getUint16(r);
        this.setRegister('acc', rValue | value);
        return;
      }
      // binary or register and register
      case instructions.OR_REG_REG.opcode: {
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const rValue1 = this.registers.getUint16(r1);
        const rValue2 = this.registers.getUint16(r2);
        this.setRegister('acc', rValue1 | rValue2);
        return;
      }
      // binary xor register and literal
      case instructions.XOR_LIT_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.fetch16();
        const rValue = this.registers.getUint16(r);
        this.setRegister('acc', rValue ^ value);
        return;
      }
      // binary xor register and register
      case instructions.XOR_REG_REG.opcode: {
        const r1 = this.fetchRegisterIndex();
        const r2 = this.fetchRegisterIndex();
        const rValue1 = this.registers.getUint16(r1);
        const rValue2 = this.registers.getUint16(r2);
        this.setRegister('acc', rValue1 ^ rValue2);
        return;
      }
      // binary not register
      case instructions.NOT.opcode: {
        const r = this.fetchRegisterIndex();
        const rValue = this.registers.getUint16(r);
        this.setRegister('acc', (~rValue) & 0xffff);
        return;
      }
      // increment register
      case instructions.INC_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.registers.getUint16(r);
        this.registers.setUint16(r, value + 1);
        return;
      }
      // decrement register
      case instructions.DEC_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.registers.getUint16(r);
        this.registers.setUint16(r, value - 1);
        return;
      }


      /************************
       * control instructions *
       ***********************/
      // jump if equal register
      case instructions.JEQ_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.registers.getUint16(r);
        const address = this.fetch16();
        if (value === this.getRegister('acc')) {
          this.setRegister('ip', address);
        }
        return;
      }
      // jump if equal literal
      case instructions.JEQ_LIT.opcode: {
        const value = this.fetch16();
        const address = this.fetch16();
        if (value === this.getRegister('acc')) {
          this.setRegister('ip', address);
        } 
        return;
      }
      // jump if not equal register
      case instructions.JNE_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.registers.getUint16(r);
        const address = this.fetch16();
        if (value !== this.getRegister('acc')) {
          this.setRegister('ip', address);
        }
        return;
      }
      // jump if not equal literal
      case instructions.JNE_LIT.opcode: {
        const value = this.fetch16();
        const address = this.fetch16();
        if (value !== this.getRegister('acc')) {
          this.setRegister('ip', address);
        } 
        return;
      }
      // jump if less than register
      case instructions.JLT_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.registers.getUint16(r);
        const address = this.fetch16();
        if (value < this.getRegister('acc')) {
          this.setRegister('ip', address);
        }
        return;
      }
      // jump if less than literal
      case instructions.JLT_LIT.opcode: {
        const value = this.fetch16();
        const address = this.fetch16();
        if (value < this.getRegister('acc')) {
          this.setRegister('ip', address);
        } 
        return;
      }
      // jump if greater than register
      case instructions.JGT_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.registers.getUint16(r);
        const address = this.fetch16();
        if (value > this.getRegister('acc')) {
          this.setRegister('ip', address);
        }
        return;
      }
      // jump if greater than literal
      case instructions.JGT_LIT.opcode: {
        const value = this.fetch16();
        const address = this.fetch16();
        if (value > this.getRegister('acc')) {
          this.setRegister('ip', address);
        } 
        return;
      }
      // jump if less or equal to register
      case instructions.JLE_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.registers.getUint16(r);
        const address = this.fetch16();
        if (value <= this.getRegister('acc')) {
          this.setRegister('ip', address);
        }
        return;
      }
      // jump if less or equal to literal
      case instructions.JLE_LIT.opcode: {
        const value = this.fetch16();
        const address = this.fetch16();
        if (value <= this.getRegister('acc')) {
          this.setRegister('ip', address);
        } 
        return;
      }
      // jump if greater or equal to register
      case instructions.JGE_REG.opcode: {
        const r = this.fetchRegisterIndex();
        const value = this.registers.getUint16(r);
        const address = this.fetch16();
        if (value >= this.getRegister('acc')) {
          this.setRegister('ip', address);
        }
        return;
      }
      // jump if greater or rqual to literal
      case instructions.JGE_LIT.opcode: {
        const value = this.fetch16();
        const address = this.fetch16();
        if (value >= this.getRegister('acc')) {
          this.setRegister('ip', address);
        } 
        return;
      }

      /***********************
       * system instructions *
       **********************/
      case instructions.CAL_LIT.opcode: { // call literal (memory)
        const address = this.fetch16();
        this.pushState();
        this.setRegister('ip', address);
        return;
      }
      case instructions.CAL_REG.opcode: { // call register
        const r = this.fetchRegisterIndex();
        const address = this.registers.getUint16(r);
        this.pushState();
        this.setRegister('ip', address);
        return;
      }
      case instructions.RET.opcode: {
        this.popState();
        return;
      }
      default: {
        throw new Error(`execute: instruction 0x${instruction.toString(16).padStart('0', 2)} is not recognized`)
        return;
      }
    }
  }

  step() {
    const instruction = this.fetch();
    return this.execute(instruction);
  }

  run(doDebug = () => {}) {
    const halt = this.step();
    doDebug(halt);
    if (!halt) {
      setImmediate(() => this.run(doDebug));
    }
  }

  halt() {
    this.halted = true;
  }
}

module.exports = CPU;
