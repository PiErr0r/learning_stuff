import { JLOX } from "@/jlox";


const main = () => {
	new JLOX(process.argv.slice(1))
}

main();
