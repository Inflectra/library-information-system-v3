import React from 'react'
import {NavLink, useParams} from 'react-router-dom'
import permissions from './permissions';
import {getTenant,setTenant,getTenantName} from './http-common';

const Header = (props) =>{
  const tt = useParams().tenant;
  const isAdmin = props.permission==permissions.admin;

  const tenant = getTenant()

  const tenantName = tenant?` (${getTenantName()})`:``;

  return (
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

            {tenantName}
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
            {isAdmin && 
            <li>
              <NavLink 
                to='/admin'
                activestyle={{
                  color: 'red'
                }}
                >
                Admin
              </NavLink>
            </li>
            }
          </ul>

          {props.permission ?
            <p className="navbar-text navbar-right">
              Logged in as {props.user.name}, <a href={getTenant()+"/"} onClick={props.logout}>Logout</a>
            </p>
            : null
          }

        </div>

      </div>
    </nav>

  </header>
)
        }

export default Header