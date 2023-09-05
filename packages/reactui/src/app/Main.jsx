// libraries
import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

// components
import Home from './Home.jsx';
import BookList from './pages/BookList';
import BookEdit from './pages/BookEdit';
import BookShow from './pages/BookShow';
import AuthorsList from './pages/AuthorList';
import AuthorEdit from './pages/AuthorEdit';
import AuthorShow from './pages/AuthorShow';
import AdminShow from './pages/AdminShow'

import {getTenant} from './http-common';

// Main page has routes to show different 'pages'
// To ensure authentication stops pages being accessed when logged out, render function in some routes have a ternary operator checking for logged in status
// there are custom components to handle this, but you need to render the DataPage component directly in the route to ensure you can properly edit fields
const Main = (props) => {

  const revert = (
    <Navigate to={
      {
      pathname: '/',
      state: { from: props.location }
      }
  }/>
  );

  const tenant = getTenant();
  

  return (
    <main className="container">
      <Routes>
        <Route path='/' exact='true'
          element={ <Home {...props}/> }/>
        <Route path='/books/create'
          element={ props.permission ? <BookEdit {...props}/> : revert }/>
        <Route path='/books/edit/:id'
          element={ props.permission ? <BookEdit {...props}/> : revert}/>
        <Route path='/books/show/:id'
          element={ props.permission ? <BookShow {...props}/> : revert}/>
        <Route path='/authors/create'
          element={ props.permission ? <AuthorEdit {...props}/> : revert}/>
        <Route path='/authors/edit/:id'
          element={ props.permission ? <AuthorEdit {...props}/> : revert}/>
        <Route path='/authors/show/:id' 
          element={ props.permission ? <AuthorShow {...props}/> : revert}/>
        <Route path='/books' exact='true'
          element={ props.permission ? <BookList {...props}/> : revert}/>
        <Route path='/authors' 
          element={ props.permission ? <AuthorsList {...props}/> : revert}/>
        <Route path='/admin' 
          element={ props.permission ? <AdminShow {...props}/> : revert}/>
				<Route path="*" 
          element={ <Navigate to={tenant} replace={true} />}
				/>
      </Routes>
    </main>
  )
}

export default Main