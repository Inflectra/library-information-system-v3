import React from 'react';
import {useNavigate} from "react-router-dom"
import Layout from "../components/Layout"
import Swal from 'sweetalert2'
 
import {dataLoad,getTenant} from '../http-common';

function AuthorShow(props) {
    const navigate = useNavigate();
    const tenant = getTenant();

    const resetDb = () => {
        dataLoad('reset')
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'DB Reset Successful!',
                showConfirmButton: false,
                timer: 3000
            }).then(()=>navigate('/', { replace: true }))
          })
    }
  
    return (
        <Layout>
           <div className="container">
            <h2 className="text-center mt-5 mb-3">Admin for {tenant}</h2>
                <div className="card">
                    <div className="card-header">
                        <button 
                            onClick={resetDb} 
                            type="button"
                            className="btn btn-outline-primary mt-3">
                            Reset DB
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default AuthorShow;