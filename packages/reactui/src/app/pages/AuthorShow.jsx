import React, {useState, useEffect} from 'react';
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout"
 
import {dataLoad} from '../http-common';

function AuthorShow(props) {
    const [id] = useState(useParams().id)
    const [author,setAuthor] = useState('')
     
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
                            to="/authors">&lt;&lt; View All Authors
                        </Link>
                    </div>
                    <div className="card-body">
                        <b className="text-muted">Name:</b>
                        <p>{author.name}</p>
                        <b className="text-muted">Age:</b>
                        <p>{author.age}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default AuthorShow;