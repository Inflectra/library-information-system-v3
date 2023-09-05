import {Permissions} from './permissions';
import {User} from './../users/user';

export const users: User[] = [
    {
        username: "librarian", 
        password: "librarian", 
        name: "Librarian", 
        active: true, 
        permission: Permissions.edit
    },
    {
        username: "visitor", 
        password: "visitor", 
        name: "Wally West", 
        active: true, 
        permission: Permissions.view
    },
    {
        username: "member", 
        password: "member", 
        name: "Clark Kent", 
        active: true, 
        permission: Permissions.view
    },
    {
        username: "banned", 
        password: "banned", 
        name: "Evil Doer", 
        active: false, 
        permission: Permissions.view
    },
    {
        username: "admin", 
        password: "admin", 
        name: "administrator", 
        active: true, 
        permission: Permissions.admin
    },
    {
        username: "borrower", 
        password: "borrower", 
        name: "Bella Borrower", 
        active: true,
        permission: Permissions.view
    },
    {
        username: "q", 
        password: "q", 
        name: "Quick Silver", 
        active: true,
        permission: Permissions.admin
    },
    {
        username: "e", 
        password: "e", 
        name: "Editor Editor", 
        active: true,
        permission: Permissions.edit
    },
    {
        username: "r", 
        password: "r", 
        name: "Read Only", 
        active: true,
        permission: Permissions.view
    }
];

export default users;
