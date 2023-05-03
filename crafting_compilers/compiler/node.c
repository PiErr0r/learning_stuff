#include "node.h"

void insertLeft(Node* head, char* s) {
	Node* tmp = head->L;
	Node* new = (Node*)malloc(sizeof(Node*));
	new->value = s;
	new->L = tmp;
	new->R = head;
	head->L = new;
	if (tmp != NULL)
		tmp->R = new;
	return;
}

void insertRight(Node* head, char* s) {
	Node* tmp = head->R;
	Node* new = (Node*)malloc(sizeof(Node*));
	new->value = s;
	new->R = tmp;
	new->L = head;
	head->R = new;
	if (tmp != NULL)
		tmp->L = new;
	return;
}

void delete(Node* head) {
	if (head->L != NULL) {
		head->L->R = head->R;
	}
	if (head->R != NULL) {
		head->R->L = head->L;
	}
	free(head);
	return;
}

Node* find(Node* head, char* s) {
	if (strcmp(head->value, s) == 0) 
		return head;
	Node* tmp = head;
	while (tmp->L != NULL) {
		tmp = tmp->L;
		if (strcmp(tmp->value, s) == 0)
			return tmp;
	}
	tmp = head;
	while (tmp->R != NULL) {
		tmp = tmp->R;
		if (strcmp(tmp->value, s) == 0)
			return tmp; 
	}
	return NULL;
}

void print(Node* head) {
	Node* tmp = head;
	while (tmp->L != NULL) tmp = tmp->L;
	printf("NEW PRINT ##############\n");
	while (tmp != NULL) {
		printf("%s\n", tmp->value);
		tmp = tmp->R;
	}
	printf("END PRINT ##############\n\n");
	return;
}
