import React, {useEffect, useState, useCallback} from 'react'
import Button from './components/Button.jsx'
import {Link} from 'react-router-dom'
import {getTenant,getTenantName,dataLoad} from './http-common.js';



// have local functions to manage on change events of the form - these don't need to be in the state
// just need the fields to be up to date when form submitted so fields can be passed on to the App and verified
// component is in two parts: static intro text and the login form
let formData = {
  username: "",
  password: ""
};

function nameChange(e) {
  formData.username = e.target.value;
}

function passwordChange(e) {
  formData.password = e.target.value;
}

const Home = (props) => {
  const [bookCount, setBookCount] = useState(0)
  const [authorCount, setAuthorCount] = useState(0)
  const [genreCount, setGenreCount] = useState(0)

  const fetchData = useCallback(() => {
    if(props.permission)
    {
      props.keepalive();
      dataLoad('books/count')
      .then(
          (bc) => {
              setBookCount(bc);
              dataLoad('genres/count')
              .then((gc)=>{
                  setGenreCount(gc)
              })
              dataLoad('authors/count')
              .then((ac)=>{
                  setAuthorCount(ac)
              })
          }
      ).catch(
        (_error)=>props.keepalive()
      )  
    }
  },[props]);

  useEffect(() => {
      fetchData()
  }, [fetchData])

  return (
  <div className="row well">
    {!props.permission&&
    <div>
      <div className="col-md-6">
        <h2>Welcome to the {getTenant()?getTenantName()+"'s":''} Library Information System</h2>
        <p>This sample application lets you view, create and edit books in a library catalog as well as view, create and edit authors.</p>
        <p>To view the library catalog or the authors list you will need to login as a borrower and to make changes to the list of books or authors you will need to login as a librarian.</p>
        <p>Note: This is not a real application, but is just a sample application used in the popular <a href="http://www.inflectra.com/SpiraTest">SpiraTest</a> test management system and <a href="http://www.inflectra.com/Rapise">Rapise</a> test automation system. Both of these products are created by <a href="http://www.inflectra.com/">Inflectra Corporation</a>.</p>

        <h3>Check this Out</h3>
        <p><a href={getTenant()+"/flutter/"}>Flutter version</a> (that is coupled with mobile clients for iOS and Android)</p>
        <p><a href={getTenant()+"/angularui/"}>Angular version</a> (that is coupled with mobile clients for iOS and Android)</p>
        <p><a href="/LisApp.exe">WPF version</a> for Windows</p>
        <p><a href={getTenant()+"/api/"}>REST API</a> for this application</p>

      </div>
    
      <div className="col-md-4 col-md-offset-2">
      
        <h2>Please login</h2>
        <form>
          {props.authMessage ? 
            <div className="alert alert-warning" role="alert">{props.authMessage}</div>
            : null
          }
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Username" 
              onChange={nameChange}
              onKeyPress={ (e) => e.key === 'Enter' ? props.authHandler(formData) : null }
              />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Password" 
              onChange={passwordChange}
              onKeyPress={ (e) => e.key === 'Enter' ? props.authHandler(formData) : null }
              />
          </div>
          <div>
            <Button 
              classes="btn btn-primary" 
              text="Login"
              onClick={props.authHandler}
              value={formData}
              />
          </div>
        </form>
      </div>
    </div>
  }
  {!!props.permission&&
    <div>
      <div className="col-md-6">
        <h3>{getTenant()?getTenantName()+"'s ":''}System Contains</h3>
        <p><Link to="authors">{authorCount}</Link> authors</p>
        <p><Link to="books">{bookCount}</Link> books</p>
        <p>{genreCount} Genres</p>
        <p>Your permissions: <b>{props.permission===1?'Reader':props.permission===2?'Editor':'Admin'}</b></p>
      </div>
    </div>
  }
  </div>

) // render
};

export default Home