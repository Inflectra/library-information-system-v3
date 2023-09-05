import React,{ useState, useEffect} from 'react'
import {Link, useParams, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'

import Layout from '../components/Layout'
import "react-datepicker/dist/react-datepicker.css";

import {dataLoad,toJSON} from '../http-common';

 
function AuthorEdit(props) {
    const [id] = useState(useParams().id)
    const [name, setName] = useState('');
    const [age, setAge] = useState(0)
    const [isSaving, setIsSaving] = useState(false)
  
    const navigate = useNavigate();

    useEffect(() => {
        if(id) {
            props.keepalive();
            dataLoad(`authors/${id}`)
            .then((author)=>{
                setName(author.name);
                setAge(author.age);
            })
        }
    }, [])

    const handleSave = () => {
        props.keepalive();
        setIsSaving(true);
        const authorData = {
            name: name,
            age: age
        }
        let method = 'post';
        if( id ) {
            authorData.id = id;
            method = 'put';
        }
        dataLoad('authors', method, toJSON(authorData))
          .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Author saved successfully!',
                showConfirmButton: false,
                timer: 3000
            }).then(()=>navigate('/authors', { replace: true }))
          })
          .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: error.message,
                showConfirmButton: true
            }).then(()=>props.keepalive());
            setIsSaving(false)
          });
    }

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">{id?'Edit Author':'Create New Author'}</h2>
                <div className="card">
                    <div className="card-header">
                        <Link 
                            className="btn btn-outline-info float-right"
                            to="/authors">&lt;&lt; View All Authors
                        </Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input 
                                    onChange={(event)=>{setName(event.target.value)}}
                                    value={name}
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Enter author name"
                                    />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Age</label>
                                <input 
                                    onChange={(event)=>{setAge(event.target.value)}}
                                    value={age}
                                    type="number"
                                    className="form-control"
                                    id="age"
                                    name="age"
                                    min="0"
                                    max="10000"
                                    step="1"
                                    />
                            </div>

                            <button 
                                disabled={isSaving}
                                onClick={handleSave} 
                                type="button"
                                className="btn btn-outline-primary mt-3">
                                Save Author
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default AuthorEdit;