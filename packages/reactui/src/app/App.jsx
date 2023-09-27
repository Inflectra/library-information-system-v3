// libraries
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

// components
import Header from './Header.jsx';

import Home from './Home.jsx';
import BookList from './pages/BookList';
import BookEdit from './pages/BookEdit';
import BookShow from './pages/BookShow';
import AuthorList from './pages/AuthorList';
import AuthorEdit from './pages/AuthorEdit';
import AuthorShow from './pages/AuthorShow';
import AdminShow from './pages/AdminShow'

// data
import permissions from './permissions';
import {setToken,dataLoad,getTenant,setTenant,baseApiUrl} from './http-common'



/*
 * =============
 * APP COMPONENT
 * =============
 * 
 * state manager for application and simple wrapper for UI components
 * 
 */
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // user login information, permissions enum val, and authentication message
      // permissions initially set to none (0) to ensure not logged in
      permission: permissions.none,
      authMessage: "",
      user: {}
    };

    // bind all of the state management functions
    // auth
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.keepalive = this.keepalive.bind(this);
  }

  /*
   * ==============
   * AUTHENTICATION
   * ==============
   */

  // manages getting login info from form, verifying it, setting relevant state
  // @param: - formData - object of username and password from login form
  authHandler(formData) {
    // first make sure form is fully filled in
    if (!formData.username && !formData.password) {
      this.setState({ authMessage: "Please provide login details" });
    } else if (formData.username && !formData.password) {
      this.setState({ authMessage: "Password required" });
    } else if (!formData.username && formData.password) {
      this.setState({ authMessage: "Username required" });
    
    // then look for a username match
    } else if (formData.username && formData.password) {
      const url = `${baseApiUrl}${getTenant()}/api/users/login`;
      fetch(url,{
        headers: {
          'Authorization': 'Basic ' + btoa(formData.username + ":" + formData.password)
        },
        credentials:'include'
      })
      .then((res) => {
        if(res.ok) {
          return res.json()
        } else {
          return res.text().then(e => {console.log(e);throw new Error('Login Failed - invalid credentials')})
        } 
      })
      .then((json)=> {
        console.log('Got user: ', json)
        setToken(json.token);
        this.setState({
          authMessage: '',
          user: json,
          permission: json.permission
        })
      })
      .catch((e)=>{
        if(e.loginFailed) {
          this.setState({
            authMessage: e.loginFailed,
            user: null,
            permission: permissions.none
          })
        } else {
          this.setState({
            authMessage: ''+e.message,
            user: null,
            permission: permissions.none
          })
        }
      });
    }

  }

  // manages logout of a logged in user
  // all that is needed is to reset the permissions enum and user object
  logout() {
    dataLoad(`users/logout`)
    .catch(()=>{})
    .finally(()=>{
      setToken('');
      this.setState({ 
        authMessage: '',
        permission: permissions.none,
        user: {}
       });
    });

  }

  keepalive() {
      dataLoad(`users/keepalive`)
      .then((res) => {
        if(res) {
          return res;
        } else {
          throw new Error('Session finished or expired');
        } 
      })
      .catch((_e)=>{
        this.logout();
      });
  }

  dataLoad(url,cb)
  {
    fetch(url,{
      headers:{
        'Authorization': 'Bearer '+this.state.user.token
      },
      credentials: 'include'
    })
    .then((res)=>{
      if(res.ok)
        res.json().then((v)=>cb(v));
      else
        res.text().then((text)=>{throw new Error('Error loading books '+text)})
    })
    .catch((e)=>{
      console.log('Error fetching: '+url,e)
    })
  }

  
  /*
   * =========
   * RENDERING
   * =========
   * 
   * Header: handles nav, routing links, and displays login information
   * Main: routing switch for the pages - hence requires lots of props passed through
   * 
   */

  render() {
    let locPath = window.location.pathname;
    const regex = /(\/[\w\d]+)(\/.+)?/gm;
    const m = regex.exec(locPath);
    // detect base URL
    if (m !== null) {
      const client = m[1];
      if( !['/books','/authors','/admin','/reactui'].includes(client) ) {
        console.log('using tenant: '+client);
        locPath = client+'/reactui/';
        setTenant(locPath)
      } else {
        locPath = '/reactui/';
      }
    } else {
      locPath = '';
    }

    const revert = (
      <Navigate to='/'/>
    );

    const props = {
      permission:this.state.permission,
      keepalive: this.keepalive,

      // for home page
      authHandler: this.authHandler,
      authMessage: this.state.authMessage
    }

    return (
  <BrowserRouter basename={locPath}>
    <Header 
      logout={this.logout}
      keepalive={this.keepalive}
      permission={this.state.permission} 
      user={this.state.user}
      />
    <Routes>
      <Route path='/books' >
        <Route index element={props.permission ? <BookList {...props}/> : revert}/>
        <Route path='create'
          element={ props.permission ? <BookEdit {...props}/> : revert }/>
        <Route path='edit/:id'
          element={ props.permission ? <BookEdit {...props}/> : revert}/>
        <Route path='show/:id'
          element={ props.permission ? <BookShow {...props}/> : revert}/>
      </Route>
      <Route path='/authors' >
        <Route index element={props.permission ? <AuthorList {...props}/> : revert}/>
        <Route path='create'
          element={ props.permission ? <AuthorEdit {...props}/> : revert }/>
        <Route path='edit/:id'
          element={ props.permission ? <AuthorEdit {...props}/> : revert}/>
        <Route path='show/:id'
          element={ props.permission ? <AuthorShow {...props}/> : revert}/>
      </Route>
      <Route path='/admin' 
          element={ props.permission ? <AdminShow {...props}/> : revert}/>
      <Route path='/' 
          element={ <Home {...props}/> } loader={({ params }) => {return setTenant('');}}/>
      <Route path="*" 
          element={ <Navigate to='/' replace={true} />}
				/>
    </Routes>
  </BrowserRouter>
    );
  }
}

