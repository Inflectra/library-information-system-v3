import React, {useState, useEffect} from 'react';
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout"
 
import {dataLoad} from '../http-common';

function BookShow(props) {
    const [id] = useState(useParams().id)
    const [book,setBook] = useState({});
    const [author,setAuthor] = useState('')
    const [genre,setGenre] = useState('')
     
    useEffect(() => {
        props.keepalive();
        dataLoad(`books/${id}`)
        .then(
            (book) => {
                setBook(book)
                dataLoad(`genres/${book.genre}`)
                .then((genre)=>{
                    setGenre(genre.name)
                    dataLoad(`authors/${book.author}`)
                    .then((author)=>{
                        setAuthor(author.name);
                    })
                })
            }
        )
    }, [id,props])
  
    return (
        <Layout>
           <div className="container">
            <h2 className="text-center mt-5 mb-3">Show Book</h2>
                <div className="card">
                    <div className="card-header">
                        <Link 
                            className="btn btn-outline-info float-right"
                            to="/books">&lt;&lt; View All Books
                        </Link>
                    </div>
                    <div className="card-body">
                        <b className="text-muted">Name:</b>
                        <p>{book.name}</p>
                        <b className="text-muted">Author:</b>
                        <p>{author}</p>
                        <b className="text-muted">Genre:</b>
                        <p>{genre}</p>
                        <b className="text-muted">Out of Print:</b>
                        <p>{book.outOfPrint?'Yes':'No'}</p>
                        <b className="text-muted">Date Added:</b>
                        <p>{new Date(book.dateAdded).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default BookShow;