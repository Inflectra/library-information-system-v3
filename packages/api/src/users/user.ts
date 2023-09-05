import {Permissions} from './../data/permissions';

export interface User {
    username: string;
    password: string;
    name: string;
    active: boolean;
    permission: Permissions
  }