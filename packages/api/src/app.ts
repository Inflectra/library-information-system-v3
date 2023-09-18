// src/app.ts
import express, {json, urlencoded, Response as ExResponse, Request as ExRequest} from 'express';
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

import {ExDBType,ExReq,Database,ExDBApp,redocPage} from './common';

import defaultDb from './data/defbooks.json';

//import {Low, Memory, JSONFile} from './common';
export const app : ExDBApp = <ExDBApp>express();


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
		const nextdb = {
			created:new Date(),
			users,
			...defaultDb
		}
		return JSON.parse(JSON.stringify(nextdb));
	}

	const regex = /(\/[^\/\?\&]+)(\/[^\/\?\&]+)?(\/.+)?/gm;
	const _req = req as ExReq;
	const url = _req.url;
	let m;
	let client = '';
	let reset = false;
	let isApi = false;
	if ((m = regex.exec(url)) !== null) {
		let tail = url;
		const [,m1,m2,m3]=m;
		if( m1=='/api' ) {
			client = '';
			tail = (m2??'')+(m3??'');
			isApi = true;
		} else if(m2=='/api') {
			isApi = true;
			if(m1.startsWith('/')) {
				client = m1.substring(1);
				tail = (m3??'');
			}
		}
		if(isApi) {
			_req.url = tail;
			if(tail=='/reset'){
				reset = true;
				_req.url = '/users/test'
			}
		}
	}

	if(isApi) {
		_req.clientId = client;
		_req.isApi = isApi;

		const LowT = await (await eval("import('lowdb')")).LowSync;
		const MemoryT = await (await eval("import('lowdb')")).MemorySync;
		const JSONT = await (await eval("import('lowdb/node')")).JSONFileSync;
		
	
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
			}
		} else {
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
			} else {
				db = new LowT(new MemoryT(),getDefaultDbData()) as LowSync<MemorySync<Database>>;
				db.write();
				sessionDbs[_req.session.id] = {db, lastAccess:new Date};
			}
		}

		_req.db = db as ExDBType;

		_res.setHeader("Access-Control-Allow-Origin", _req.headers.origin||'*');
		_res.setHeader("Access-Control-Allow-Credentials", "true");
		_res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
		_res.setHeader("Access-Control-Allow-Headers", "Authorization,Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers");
	}

	console.log(client??'--root--',isApi?'api':'',_req.url);
	if(isApi&&!_req.url) {
		// /api or /api/ => api docs
		_res.send(redocPage)
		return;
	}

	next();
});

const staticdir = join(__dirname, '../../../reactui/build');
const serveStatic = express.static(staticdir,{fallthrough:false,redirect:false,cacheControl:false,etag: false});
app.use('/:clientId/reactui', (req: ExRequest, _res: ExResponse, next: ExNext)=>{
	const _req = req as ExReq;
	if(_req.isApi) return next();
	serveStatic(req,_res,next);
});

app.use('/reactui', (req: ExRequest, _res: ExResponse, next: ExNext)=>{
	const _req = req as ExReq;
	if(_req.isApi) return next();
	serveStatic(req,_res,next);
});

const staticdirflutter = join(__dirname, '../../../flutter/bookstore/build/web');
const serveStaticF = express.static(staticdirflutter,{fallthrough:false,redirect:false,cacheControl:false,etag: false});
app.use('/:clientId/flutter', (req: ExRequest, _res: ExResponse, next: ExNext)=>{
	const _req = req as ExReq;
	if(_req.isApi) return next();
	serveStaticF(req,_res,next);
});

app.use('/flutter', (req: ExRequest, _res: ExResponse, next: ExNext)=>{
	const _req = req as ExReq;
	if(_req.isApi) return next();
	serveStaticF(req,_res,next);
});


app.use('/', (req: ExRequest, _res: ExResponse, next: ExNext)=>{
	const _req = req as ExReq;
	if(_req.isApi) return next()
	let redir = req.originalUrl;
	if(redir.includes('/reactui/')) return _res.sendStatus(404);
	while(redir.startsWith('/')) redir = redir.slice(1);
	while(redir.endsWith('/')) redir = redir.slice(0,-1);
	if(redir.lastIndexOf('/')===-1) {
		// Check if it is requires for root folder's resources
		const checkpath = join(staticdir,redir);
		if(
			fs.existsSync(checkpath)
			&&fs.lstatSync(checkpath).isFile()
		) {
			return serveStatic(req,_res,next);
		}
	}
	if(redir.split('/').length>1) return _res.sendStatus(404);
	if(redir.split('/').pop()?.includes('.')) return _res.sendStatus(404);

	if(redir) redir = '/'+redir;
	redir+='/reactui/';
	_res.redirect(301,redir);
})

app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
	console.log('docs requested');
	const swaggerUIOptions = {
		swaggerOptions: {
			defaultModelsExpandDepth: -1,
		}
	};
	const data = await import('../build/swagger.json');
	data.servers.pop();
	data.servers.push({url:(<ExReq>_req).clientId?'/'+(<ExReq>_req).clientId+'/api':'/api'});
	return res.send(
		swaggerUi.generateHTML(data, swaggerUIOptions)
	);
});

app.use('*/swagger.json', async (_req: ExRequest, res: ExResponse) => {
	const data = await import('../build/swagger.json');
	res.send(data);
});

app.use('/redoc', async (_req: ExRequest, res: ExResponse) => {
	return res.send(redocPage);
})

RegisterRoutes(app);