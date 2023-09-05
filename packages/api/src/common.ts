import {Request as ExRequest, Express as ExApp} from 'express';
import type {LowSync,MemorySync} from 'lowdb';
import type {JSONFileSync} from 'lowdb/node';


export interface SyncAdapter<T> {
    read: () => T | null;
    write: (data: T) => void;
}

import type {User} from './users/user';
import type {Book} from './books/book';
import type {Author} from './authors/author';
import type {Genre} from './genres/genre';

export interface Database {
    created: Date;
    users: User[];
    books: Book[]&{remove(obj:any):Database};
    authors: Author[];
    genres: Genre[];
}


export type ExDBType = LowSync<JSONFileSync<Database>>|LowSync<MemorySync<Database>>;

export type ExDBApp = ExApp & {db:ExDBType,clientId:string};
export type ExReq = ExRequest & {session:{db:ExDBType}};

export interface Db {
    write: ()=>void;
    data: Database;
}

