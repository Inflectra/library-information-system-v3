import React, {useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout"
import permissions from '../permissions';

import {dataLoad} from '../http-common';

function BookShow(props) {
    const [id] = useState(useParams().id)
    const [book,setBook] = useState({});
    const [author,setAuthor] = useState('')
    const [genre,setGenre] = useState('')

    const navigate = useNavigate()
     
    const isEdit = props.permission>=permissions.edit;

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
                            to="/books">&lt;&lt; Back to Books
                        </Link>
                    </div>
                    <div className="card-body">
                        <label className="text-muted">Name</label>
                        <p id='bookName'>{book.name}</p>
                        <label className="text-muted">Author</label>
                        <p id='bookAuthor'>{author}</p>
                        <label className="text-muted">Genre</label>
                        <p id='bookGenre'>{genre}</p>
                        <label className="text-muted">Out of Print</label>
                        <p id='bookOutOfPrint'>{book.outOfPrint?'Yes':'No'}</p>
                        <label className="text-muted">Date Added</label>
                        <p id='bookDateAdded'>{new Date(book.dateAdded).toLocaleDateString()}</p>
                        {isEdit&&
                        <button 
                                onClick={() => navigate('/books/edit/'+book.id, { replace: true })} 
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
  
export default BookShow;