import express, {Express} from 'express';
let app:Express;

export function isInitialized():boolean{
    return !!app;
}

export function initExpress(exp:Express|null):Express
{
    app = exp || app || express();
    return app;
}

export function getPort():number|string {
	return process.env.PORT || 5000;
}