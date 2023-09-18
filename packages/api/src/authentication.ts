
import {User} from './users/user';
import {nanoid} from 'nanoid';

const tokens : Record<string,User&{db:any}> = {};

export function regSession(user:User, db:any):string {
  const id = nanoid();
  tokens[id] = {...user,db};
  return id;
}

export function closeSession(token:string):boolean {
  if(tokens[token]) {
    delete tokens[token];
    return true;
  }
  return false;
}

export function getUser(token:string):User {
  return tokens[token];
}

function authorizeBearer(req: any)
{
  const _header = 'authorization';
  const _param = 'access_token';
  let token = '';
  // Bearer token
  if (req.headers && req.headers[_header.toLowerCase()]) {
    var parts = req.headers[_header.toLowerCase()].split(' ');
    if (parts.length === 2) {
      var scheme = parts[0]
        , credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else if(parts.length === 1) {
      token = parts[0];
    } else {
      return false;
    }
  }

  if (req.body && req.body[_param]) {
    token = req.body[_param];
  }

  if (req.query && req.query[_param]) {
    token = req.query[_param];
  }
  req.token = token;
  if(token) return tokens[token];
  return false;
}

function authorizeBasic(req:any) {
  let userid='';
  let password='';
  const authorization = req.headers['authorization'];
  if (authorization) 
  {
    const parts = authorization.split(' ')
    if (parts.length < 2) { return false; }
    
    const scheme = parts[0]
      , credentials = Buffer.from(parts[1], 'base64').toString().split(':');
  
    if (!/Basic/i.test(scheme)) { return false; }
    if (credentials.length < 2) { return false; }
    
    userid = credentials[0];
    password = credentials[1];  
  } else {
    userid = req.query['username'];
    password = req.query['password'];
  }
  
  if (!userid || !password) {
    return false;
  }

  const found = req.db.data.users.find((usr:User)=>usr.username==userid) as User;
  return found;
}

export async function expressAuthentication(
  request: any,
  securityName: string,
  _scopes?: string[]
): Promise<any> {

	const authResult = new Promise((resolve, reject) => {
    if(securityName=='bearerAuth')
    {
      const res = authorizeBearer(request);
      if(res) {
        resolve(res);
      } else {
        // We use it to suppress default behavior - dump of call stack for each authorization error
        reject({status:401,toString:()=>'Not authorized'});
      }
    }
    if(securityName=='basicAuth')
    {
      const res = authorizeBasic(request);
      if(res) {
        resolve(res);
      } else {
        // We use it to suppress default behavior - dump of call stack for each authorization error
        reject({status:401,toString:()=>'Not authorized'});
      }
    }

  }
	);

	return authResult;
}