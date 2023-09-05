import React from 'react'
import Button from './components/Button.jsx'

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

const Home = (props) => (
  <div className="row well">
    <div className="col-md-6">
      <h1>Welcome to the Library Information System</h1>
      <p>This sample application lets you view, create and edit books in a libary catalog as well as view, create and edit authors.</p>
      <p>To view the library catalog or the authors list you will need to login as a borrower and to make changes to the list of books or authors you will need to login as a librarian.</p>
      <p>Note: This is not a real application, but is just a sample application used in the popular <a href="http://www.inflectra.com/SpiraTest">SpiraTest</a> test management system and <a href="http://www.inflectra.com/Rapise">Rapise</a> test automation system. Both of these products are created by <a href="http://www.inflectra.com/">Inflectra Corporation</a>.</p>
    </div>
    
    {!props.permission ? 
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

    :

      null

    }
  </div>

)

export default Home