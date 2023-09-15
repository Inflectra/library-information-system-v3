
export let baseApiUrl = process.env.REACT_APP_MODE==='DEVMODE'?'http://localhost:5000':'/api';

let token = '';


export function setToken(tok) 
{
    token = tok;
}

let tenant = '';

export function setTenant(t) {
    tenant = t;
}

export function getTenant() {
    return tenant;
}

export function getTenantName() {
    if(tenant && tenant.startsWith('/')) return tenant.substring(1);
    return tenant;
}


export async function dataLoad(url,method,body)
{
    const addr = tenant+baseApiUrl+'/'+url;
    console.log(addr);
    return fetch(addr,{
        headers:{
            'Authorization': 'Bearer ' + token,
            'Content-type': 'application/json'
        },
        method,
        body,
        credentials: 'include'
    })
    .then((res)=>{
        if(res.ok)
        {
            if(!method||method.toLowerCase()!=='delete') {
                return res.json();
            }
            else {
                return true;
            }
        }
        else {
            return res.text().then((text)=>{
                if(text.startsWith('{')) {
                    try 
                    {
                        const o = JSON.parse(text);
                        if(o.errorMessage) throw new Error(o.errorMessage);
                    } catch(_e) {}
                }
                throw new Error('Error loading '+url+' : '+text)
            })
        }
    })
}

const replacer = function(key, value) {

    if (value instanceof Date) {
       return  value.toJSON();
    }
    
    return value;
 }

 export function toJSON(obj) {
    const res = JSON.stringify(obj, replacer);
    console.log('payload', obj, 'json', res)
    return res;
 }