import React, {useEffect} from 'react'
import {NavLink,useLocation} from 'react-router-dom'
import permissions from './permissions';
import {getTenant,getTenantName} from './http-common';

const Header = (props) =>{
  const isAdmin = props.permission===permissions.admin;

  const tenant = getTenant()

  const tenantName = tenant?` (${getTenantName()})`:``;

  const location = useLocation();
  useEffect(() => {
    // execute on location change
    console.log('Location changed!', location.pathname);
  }, [location]);


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