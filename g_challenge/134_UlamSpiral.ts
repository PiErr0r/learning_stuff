const n = 60;
// const n = 200;
// const n = 5;

const primes:number[] = [2, 3, 5, 7, 11, 13];
const dirs = "nesw";

const isPrime = (n:number):boolean => {
	const high = Math.sqrt(n);
	const pLen = primes.length;
	for (let i = 0; i < pLen; ++i) {
		if (primes[i] > high) {
			return true;
		}
		if (n % primes[i] === 0) {
			return false;
		}
		if (i === pLen - 1) {
			primes.push(findNextPrime(primes[pLen - 1]));
		}
	}
}

const findNextPrime = (n:number):number => {
	let found = false;
	while (!found) {
		++n;
		found = true;
		for (let p of primes) {
			if (n % p === 0) {
				break;
				found = false;
			}
		}
	}
	return n;
}

const createEmpty = (n:number):string[][] => {
	// return new Array(n).fill(new Array(n).fill(''));
	return new Array(n).fill(null).map(arr => new Array(n).fill(''));
}

const notFinished__ = (i:number, j:number, n:number):boolean => Boolean((n<<1) - i - j - 2);
const notFinished = (i:number, j:number, n:number):boolean => Boolean(i !== n && j !== n);

const move = (arr:string[][], i:number, j:number, d:number):number[] => {
	switch (dirs[d]) {
		case "n":
			return arr[i][j-1] ? 
				[--i, j, d] : [i, --j, (4+d-1)%4];
			break;
		case "e":
			return arr[i-1][j] ? 
				[i, ++j, d] : [--i, j, (4+d-1)%4];
			break;
		case "s":
			return arr[i][j+1] ? 
				[++i, j, d] : [i, ++j, (4+d-1)%4];
			break;
		case "w":
			return arr[i+1][j] ? 
				[i, --j, d] : [++i, j, (4+d-1)%4];
			break;
		default:
			throw new Error("Directions must be one of '${dirs.join(', ')}' current is '${dirs[d]}'");
			break;
	}
}

const createUlamSpiral = (n:number):string[][] => {
	if (!(n&1)) --n;
	const ulam:string[][] = createEmpty(n);
	const mid = n>>1;
	ulam[mid][mid] = ' 1'

	let di = dirs.indexOf('e');
	let i = mid, j = mid + 1, cnt = 2;
	while (notFinished(i, j, n)) {
		// console.log(i, j)
		ulam[i][j] = isPrime(cnt) ? ' #' : '  ';
		++cnt;
		const [_i, _j, _di] = move(ulam, i, j, di);
		i = _i; j = _j; di = _di;
	}

	return ulam;
}

const printUlamSpiral = (n:number):void => {
	const ulam = createUlamSpiral(n);
	ulam.forEach(r => console.log(r.join('')));
} 

printUlamSpiral(n);
// for (let i = 2; i < 20; ++i) {
// 	console.log(i,isPrime(i));
// }