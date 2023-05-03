#include "node.h"

int main() {
	Node *tmp1, *tmp2, *tmp3;
	Node *head = (Node*)malloc(sizeof(Node*));
	// head->value = (char*)malloc(10);
	head->value = "asdasdasd\0";
	insertLeft(head, "test left 1\0");
	insertLeft(head->L, "test left 2\0");
	insertRight(head, "test right 1\0");
	insertRight(head->R, "test right 2\0");
	print(head);
	delete(head->L);
	delete(head->R);
	print(head);
	// return 0;
	tmp1 = find(head, "test left 2\0");
	tmp2 = find(head, "test right 2\0");
	tmp3 = find(head, "what\0");
	if (tmp1 != NULL)
		printf("TMP1: %s\n", tmp1->value);
	else
		printf("TMP1: NOT FOUND\n");
	if (tmp2 != NULL)
		printf("TMP2: %s\n", tmp2->value);
	else
		printf("TMP2: NOT FOUND\n");
	if (tmp3 != NULL)
		printf("TMP3: %s\n", tmp3->value);
	else
		printf("TMP3: NOT FOUND\n");
	printf("HELLO\n");
	// free(head->value);
	return 0;
}