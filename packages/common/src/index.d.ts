import {Express} from 'express';

export function isInitialized():boolean;

export function initExpress(exp:Express|null):Express;

export function getPort():number|string;