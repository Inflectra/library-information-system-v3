import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = (props) => (
  <header>
    <nav className="navbar navbar-default">
      <div className="container-fluid">

        <div className="navbar-header">
          <NavLink 
            to='/' 
            exact='true'
            className="navbar-brand"
            activestyle={{
              color: 'red'
            }}
            >
            Library Information System
          </NavLink>
        </div>

        <div className="collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li>
              <NavLink 
                to='/books' 
                activestyle={{
                  color: 'red'
                }}
                >
                Books
              </NavLink>
            </li>
            <li>
              <NavLink 
                to='/authors' 
                activestyle={{
                  color: 'red'
                }}
                >
                Authors
              </NavLink>
            </li>
          </ul>

          {props.permission ?
            <p className="navbar-text navbar-right">
              Logged in as {props.user.name}, <a href="/#" onClick={props.logout}>Logout</a>
            </p>
            : null
          }

        </div>

      </div>
    </nav>

  </header>
)

export default Header