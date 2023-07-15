
class ArgumentParser {
	command: string = "";
	rest: string[] = [];
	constructor(args: string[]) {
		if (args.length === 1) {
			this.usage(args[0]);
		} else {
			this.command = args[1];
			this.rest = args.slice(2);
		}
	}

	usage(name: string) {
		process.stdout.write(`Usage: ${name} [command]\n`);
		process.exit(1);
	}
}

export { ArgumentParser };