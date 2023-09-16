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

export type ExDBApp = ExApp & {db:ExDBType};
export type ExReq = ExRequest & {session:{db:ExDBType},isApi:boolean,clientId:string};

export interface Db {
    write: ()=>void;
    data: Database;
}


export const redocPage:string =`
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
