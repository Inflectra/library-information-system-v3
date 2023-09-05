// src/users/usersService.ts
import {User} from "./user";
import {Db} from "../common"
import {regSession,closeSession} from "../authentication";

// A post request should not contain an id.

export class UsersService {

  private hidePass(user:User)
  {
    if(user){
      const res = <User>{
        ...user
      }
      res.password="****";
      return res;  
    } else return user;
  }

  public get(db:Db, username: string): User {
    const found = db.data.users.find(usr=>usr.username==username) as User;
    return this.hidePass(found);
  }

  public login(db:Db, username: string, password: string): User&{token:string}|null {
    const found = db.data.users.find(usr=>usr.username==username) as User;
    if(found && found.password==password) {
      const token = regSession(found,db);
      const res = {
        token,
        ...found
      }
      res.password = '****';
      return res;
    }
    return null;
  }

  public logout(token:string): boolean {
    return closeSession(token);
  }

  public all(db:Db):User[] {
    return db.data.users.map(user=>this.hidePass(user));
  }

  public create(db:Db, user: User): User|boolean {
    const found = this.get(db,user.username);
    if(found) {
      return false;
    } else {
      db.data.users.push(user);
      db.write();
      return user;  
    }
  }

  public update(db:Db, data: Partial<User>&Pick<User,"username">): User {
    const user = this.get(db,data.username);
    if(data) {
      for(let k in data) {
        (<Record<string,any>>user)[k] = (<Record<string,any>>data)[k];
      }
      db.data.users.push(user);
      db.write();
    }
    return user;  
  }
}