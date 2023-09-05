import React,{ useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import Layout from "../components/Layout"
import Button from '../components/Button'

import permissions from '../permissions';
import {dataLoad} from '../http-common';

/*
export const authorsMeta = {
  id: { name: "ID", editable: false, visible: true },
  name: { name: "Name", editable: true, visible: true, required: true },
  age: { name: "Age", editable: true, visible: true },
};
*/

function AuthorList(props) {
    const  [authorList, setAuthorList] = useState([])
  
    useEffect(() => {
        fetchAuthorList()
    }, [])
  
    const fetchAuthorList = () => {
        props.keepalive();
        dataLoad('authors')
        .then(
            (authors) => {
                setAuthorList(authors)
            }
        );
    }
  
    const handleDelete = (id) => {
        props.keepalive();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                dataLoad(`authors/${id}`,'delete')
                .then(function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Author deleted successfully!',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    .then(()=>fetchAuthorList())
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: ''+error,
                        showConfirmButton: true
                    })
                    .then(()=>props.keepalive());
                });
            }
          })
    }

    const isEdit = props.permission>=permissions.edit;
    
    return (
        <Layout>
           <div className="container">
            <h2 className="text-center mt-5 mb-3">Author Manager</h2>
                <div className="card">
                    <div className="card-header">
                        <Link 
                            className="btn btn-outline-primary"
                            to="/authors/create">Create New Author
                        </Link>
                    </div>
                    <div className="table-responsive">
              
                        <table className="table table-condensed">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    {isEdit&&<th width="240px">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {authorList.map((author, key)=>{
                                    return (
                                        <tr key={key}>
                                            <td>{author.id}</td>
                                            <td>{author.name}</td>
                                            <td>{author.age}</td>
                                            {isEdit&&<td>
                                                <div className="btn-group">
                                                    <Link
                                                        to={`/authors/show/${author.id}`}
                                                        className="btn btn-outline-info btn-xs">
                                                        Show
                                                    </Link>
                                                    <Link
                                                        className="btn btn-outline-success btn-xs"
                                                        to={`/authors/edit/${author.id}`}>
                                                        Edit
                                                    </Link>
                                                    <Button 
                                                        onClick={()=>handleDelete(author.id)}
                                                        classes="btn btn-outline-danger btn-xs"
                                                        text='Delete'/>
                                                </div>
                                            </td>}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default AuthorList;