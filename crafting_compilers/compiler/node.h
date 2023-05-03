#include <stdlib.h>
#include <stdio.h>
#include <string.h>

typedef struct Node {
	struct Node* L;
	struct Node* R;
	char* value;
} Node;

void insertLeft(Node* head, char* s);
void insertRight(Node* head, char* s);
void delete(Node* head);
Node* find(Node* head, char* s);
void print(Node* head);