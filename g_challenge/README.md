# Challenges found on 4chan/g/

## How to run \*.ts files
In `package.json` there are 3 scripts:
  - `prestart`
  - `start`
  - `poststart`

which will run in that order when `npm start -- filename.ts` is run

**prestart** removes all old .js files

**start** builds the .ts file `filename.ts` passed in as argument with tsc

**poststart** renames the newly built file `filename.js` to `index.js` and runs it with node

## Solved
  - [59] 	// 50-59
  - [61] 	// 60-69
  - [134] // 130-139
