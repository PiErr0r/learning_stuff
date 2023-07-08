

interface IStack<T> {
	pop: () => T;
	peek: () => T;
	get: (i: number) => T;
	push: (item: T) => void;
	size: () => number;
	empty: () => boolean;
}

type IMap<T> = {
	[key: string]: T;
}

class Stack<T> implements IStack<T> {
	private data: T[] = [];
	private top = 0;

	pop() {
		if (this.top === 0) {
			throw new Error("Stack is empty");
		}

		return this.data[--this.top];
	}

	peek() {
		if (this.top === 0) {
			throw new Error("Stack is empty");
		}

		return this.data[this.top - 1];
	}

	get(i: number) {
		if (i < 0 || i >= this.top) {
			throw new Error("Index out of range");
		}
		return this.data[i];
	}

	push(item: T) {
		if (this.top === this.data.length) {
			this.data.push(item);
			++this.top;
		} else {
			this.data[this.top++] = item;
		}
	}


	size() { return this.top; }
	empty() { return this.top === 0; }
}

export { Stack, IMap };