#include "common.h"
#include "chunk.h"
#include "debug.h"

int main(int argc, const char* argv[]) {
	Chunk chunk;
	initChunk(&chunk);

	int constant1 = addConstant(&chunk, 1.2);
	int constant2 = addConstant(&chunk, 1.8);
	writeChunk(&chunk, OP_CONSTANT);
	writeChunk(&chunk, constant1);
	writeChunk(&chunk, OP_CONSTANT);
	writeChunk(&chunk, constant2);

	writeChunk(&chunk, OP_RETURN);

	disassembleChunk(&chunk, "test chunk");
	freeChunk(&chunk);
	return 0;
}