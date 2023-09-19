import React, {useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout"
import permissions from '../permissions';

import {dataLoad} from '../http-common';

function AuthorShow(props) {
    const [id] = useState(useParams().id)
    const [author,setAuthor] = useState('')
    
    const navigate = useNavigate();

    const isEdit = props.permission>=permissions.edit;

    useEffect(() => {
        props.keepalive();
        dataLoad(`authors/${id}`)
        .then(
            (author) => {
                setAuthor(author)
            }
        )
    }, [id,props])
  
    return (
        <Layout>
           <div className="container">
            <h2 className="text-center mt-5 mb-3">Show Author</h2>
                <div className="card">
                    <div className="card-header">
                        <Link 
                            className="btn btn-outline-info float-right"
                            to="/authors">&lt;&lt; Back to Authors
                        </Link>
                    </div>
                    <div className="card-body row">
                            <label className="text-muted">Name</label>
                            <p id='authorName'>{author.name}</p>
                            <label className="text-muted">Age</label>
                            <p id='authorAge'>{author.age}</p>
                            {isEdit&&
                            <button 
                                    onClick={() => navigate('/authors/edit/'+author.id, { replace: true })} 
                                    type="button"
                                    className="btn btn-outline-primary mt-3">
                                    Edit
                                </button>
                            }
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default AuthorShow;