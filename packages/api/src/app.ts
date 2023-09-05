// src/app.ts
import {json, urlencoded, Response as ExResponse, Request as ExRequest} from 'express';
import cors from 'cors';
import {NextFunction as ExNext} from 'express';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import { RegisterRoutes } from '../build/routes';
import {nanoid} from 'nanoid';
import cookieParser from 'cookie-parser';

import {join} from 'path';
import fs from 'fs';

import type {LowSync,MemorySync} from 'lowdb';
import type {JSONFileSync} from 'lowdb/node';

import {ExDBType,ExReq,Database} from './common';
import {ExDBApp} from './common';

import {initExpress} from '@lis/common';

//import {Low, Memory, JSONFile} from './common';
export const app : ExDBApp = initExpress(null) as ExDBApp;

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.use(cors({
	origin: function(_origin, callback){
	  return callback(null, false);
	},
	optionsSuccessStatus: 200,
	credentials: true
  }));

app.use(json());
app.use(morgan('dev'))

app.use(session({
	genid: function(_req:any) {
		console.log('genid')
		const id = nanoid() // use UUIDs for session IDs
		console.log(`new session: ${id}`)
		return id;
	},
	secret: '347190f7-8815-4340-bb6a-7ef61dfee5af',
	resave: true,
	saveUninitialized: true
})
);

let sessionDbs :{ [name: string]: {db:ExDBType,lastAccess:Date}} = {};

app.use(async (req: ExRequest, _res: ExResponse, next: ExNext) => { 

	function getDefaultDbData():Database {
		const users = require('./data/users').default;
		const {authors} = require('./data/authors');
		const {books} = require('./data/books');
		const genres = require('./data/genres').default;
		return JSON.parse(JSON.stringify({created:new Date(), users,authors,books,genres}));
	}

	console.log('checking request');
	const LowT = await (await eval("import('lowdb')")).LowSync;
	const MemoryT = await (await eval("import('lowdb')")).MemorySync;
	const JSONT = await (await eval("import('lowdb/node')")).JSONFileSync;
	
	const regex = /\/([\w\d]+)(\/.+)/gm;
	const _req = req as ExReq;
	const url = _req.url;
	let m;
	let client = '';
	let reset = false;
	if ((m = regex.exec(url)) !== null) {
		client = m[1];
		const tail = m[2];
		if( !['docs','redoc','swagger.json','users','books','authors','genres'].includes(client) ) {
			console.log('using tenant: '+client);
			_req.url = tail;
			if(tail=='/reset'){
				reset = true;
				_req.url = '/users/test'
			}
		} else {
			client = '';
		}
	}
	console.log('client',client,'url',_req.url)
	let db:ExDBType;
	if(client) {
		const dbdir = join(__dirname,'..','db');
		if (!fs.existsSync(dbdir)){
			fs.mkdirSync(dbdir);
		}
		const dbpath = join(dbdir,client+'.json');
		if(fs.existsSync(dbpath)&&!reset) {
			db = new LowT(new JSONT(dbpath), {}) as LowSync<JSONFileSync<Database>>;
			db.read();
		} else {
			db = new LowT(new JSONT(dbpath), getDefaultDbData()) as LowSync<JSONFileSync<Database>>;
			db.write();
			console.log(client,'db created',db)
		}
	} else {
		console.log('session: '+_req.session.id);
		// Clean up DBs for sessions older than 30 minutes
		const now = new Date;
		Object.keys(sessionDbs).forEach(id=>{
			//console.log(id,'sessionDbs[id]: ',sessionDbs[id])
			const diff = +now-(+sessionDbs[id].lastAccess);
			//console.log(id,'diff',diff)
			if(diff>1800000) // destroy memory db in 30 minutes
			{
				console.log(id,'diff',diff,'removing')
				delete sessionDbs[id];
			}
		});
		if(sessionDbs[_req.session.id]) {
			db = sessionDbs[_req.session.id].db;
			sessionDbs[_req.session.id].lastAccess = new Date;
			console.log('reusing session db');
		} else {
			db = new LowT(new MemoryT(),getDefaultDbData()) as LowSync<MemorySync<Database>>;
      		db.write();
			console.log('creating session db')
			sessionDbs[_req.session.id] = {db, lastAccess:new Date};
		}
	}
	app.db = db as ExDBType;
	app.clientId = client;

	_res.setHeader("Access-Control-Allow-Origin", _req.headers.origin||'*');
	_res.setHeader("Access-Control-Allow-Credentials", "true");
	_res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
	_res.setHeader("Access-Control-Allow-Headers", "Authorization,Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers");

	next();
});

app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
	console.log('docs requested');
	const swaggerUIOptions = {
		swaggerOptions: {
			defaultModelsExpandDepth: -1,
		}
	};
	const data = await import('../build/swagger.json');
	data.servers.pop();
	data.servers.push({url:'/'+app.clientId});
	return res.send(
		swaggerUi.generateHTML(data, swaggerUIOptions)
	);
});

app.use('/swagger.json', async (_req: ExRequest, res: ExResponse) => {
	const data = await import('../build/swagger.json');
	res.send(data);
});

app.use('/redoc', async (_req: ExRequest, res: ExResponse) => {
const page = `
<html>
  <head>
    <title>Redoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

    <!--
    Redoc doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='swagger.json'></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
  </body>
</html>
`;
	  return res.send(page)
})



RegisterRoutes(app);