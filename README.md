# FORMSENDER

[![Version](https://img.shields.io/npm/v/formsender.svg)](https://www.npmjs.org/package/formsender)

### Online

https://alex2844.github.io/formsender/


### Cli
```
PORT=3000 formsender
```


### Api
```
const
	Fastify = require('fastify'),
	formsender = require('formsender');

formsender(Fastify()).then(fastify => {
	fastify.listen(3000, () => console.log('Server start'));
});
```
or
```
(Fastify()
	.register(formsender)
	.listen(3000, () => console.log('Server start'))
);
```
or
```
(Fastify()
	.register(formsender, { // http://localhost:3000/formsender/
		prefix: '/formsender'
	})
	.get('/', async (req, rep) => { // http://localhost:3000/
		return 'Index page';
	})
	.listen(3000, () => console.log('Server start'))
);
```

## Installation
```
npm install -g formsender
```
