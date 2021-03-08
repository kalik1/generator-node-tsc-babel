#  <%= appname %>
<%= description %> 

1. Write node.js source code in Typescript syntax.
2. Transpile to ES5.
3. Publish ES5 code to NPM.

## Motivation

I created this repo to use it as a starting point for build npm libaries using Typescript.

## Testing

Code SHALL be heavily tested. We use JEST. just put you files in test folder 
using pattern `<filename>.spec.ts` (unit) or  `<filename>.test.ts` (integration).


### Coding style

Airbnb has an excellent [style guide](https://github.com/airbnb/javascript) for ES6. We will follow the guide and adhere to the recommended coding style.
 
## Quick Start
1. Make sure you have recent, stable version of node (>= 6.1.0).

	```
	node -v
	```
2. Clone or download this repo.

3. Get latest releases of the tools

	```
	npm update --save
	```

## Commands

### Test
```
npm run test
```

### Build
```
npm run build
```

### Run
#### Devel
```
npm run dev
```

#### ES5 code (Transpiled)
```
npm run-script build
npm start
```

or
```
node <%= outputPath %>/
```

### Preview Publish
```
npm pack
tar -tf <%= appname %>-1.0.0.tgz
```

### Publish to npm registry
Registry is specifed in [package.json](package.json) `publishConfig` entry

**Delete the `.tgz` file before publishing**.

PLEASE use [Semantic versioning](https://semver.org/) for your releases!
```
npm version <patch | minor | major >
```
More about npm version [here](https://docs.npmjs.com/cli/v6/commands/npm-version)

###  

## Code Directories

./src - source code, stays in git repo not saved in npm repo.

./<%= outputPath %> - transpiled ES5 code, not saved in git, gets published to npm.

./test - test folder not saved in npm repo.

## License

[MIT](LICENSE)
