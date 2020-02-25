#!/usr/bin/env node

const fetch = require('node-fetch');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = async (fastify, opts) => (fastify
	.register(require('point-of-view'), {
		engine: { ejs: require('ejs') },
		root: __dirname
	})
	.addContentTypeParser('*', (req, done) => done(null, req))
	.get('/', (req, rep) => rep.view('index.html', { local: true }))
	.all('/proxy/*', async (req, rep) => {
		let url = req.raw.url.slice(7);
		if (!url)
			return 'Error';
		delete req.headers.host;
		let d = await fetch(url, {
			method: req.raw.method,
			headers: req.headers,
			body: ((req.headers['content-type'] && req.headers['content-type'].startsWith('application/json')) ? JSON.stringify(req.body) : req.body)
		});
		let h = {};
		for (var pair of d.headers.entries()) {
			h[pair[0]] = pair[1];
		}
		[ 'keep-alive', 'transfer-encoding', 'content-encoding' ].forEach(h_ => (delete h[h_]));
		h['x-final-url'] = url;
		rep.status(d.status).headers(h);
		return ((d.headers.get('content-type').indexOf('application/json') > -1) ? await d.json() : await d.text());
	})
);
if (!module.parent)
	module.exports(require('fastify')()).then(fastify => {
		fastify.listen((process.env.PORT || 0), () => console.log('Server started http://localhost:'+fastify.server.address().port));
	});
