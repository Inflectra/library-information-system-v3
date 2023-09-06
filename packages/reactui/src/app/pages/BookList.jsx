import React,{ useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import Layout from "../components/Layout"
import Button from '../components/Button'

import permissions from '../permissions';
import {dataLoad} from '../http-common';

function formatDate(d)
{
    const dd =  new Date(d);
    return dd.toLocaleDateString();
}

function BookList(props) {
    const  [bookList, setBookList] = useState([])

    useEffect(() => {
        fetchBookList()
    }, [])
  
    const fetchBookList = () => {
        props.keepalive();
        dataLoad('books')
        .then(
            (books) => {
                dataLoad('genres')
                .then((genres)=>{
                    books.map((book)=>{
                        book.genreObj = genres.find((g)=>g.id===book.genre)
                    })
                    dataLoad('authors')
                    .then((authors)=>{
                        books.map((book)=>{
                            book.authorObj = authors.find((a)=>a.id===book.author)
                        })
                        setBookList(books)
                    })
                })
            }
        ).catch((error)=>{
            Swal.fire({
                icon: 'error',
                title: ''+error,
                showConfirmButton: true
            })
            .then(()=>props.keepalive());
        })
    }
  
    const isEdit = props.permission>=permissions.edit;

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
                dataLoad(`books/${id}`,'delete')
                .then(function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Book deleted successfully!',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    .then(()=>fetchBookList())
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: ''+error,
                        showConfirmButton: true
                    })
                    .then();
                });
            }
          })
    }
  
    return (
        <Layout>
           <div className="container">
            <h2 className="text-center mt-5 mb-3">Book Manager</h2>
                <div className="card">
                    {isEdit&&<div className="card-header">
                        <Link 
                            className="btn btn-outline-primary"
                            to="/books/create">Create New Book
                        </Link>
                    </div>}
                    <div className="table-responsive">
              
                        <table className="table table-condensed">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Author</th>
                                    <th>Genre</th>
                                    <th>Date Added</th>
                                    <th>Out of Print</th>
                                    {isEdit&&<th width="240px">Action</th>}
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {bookList.map((book, key)=>{
                                    return (
                                        <tr key={key}>
                                            <td>{book.id}</td>
                                            <td>{book.name}</td>
                                            <td>{book.authorObj?.name}</td>
                                            <td>{book.genreObj?.name}</td>
                                            <td>{formatDate(book.dateAdded)}</td>
                                            <td>{book.outOfPrint?'Yes':'No'}</td>
                                            {isEdit&&<td>
                                                <div className="btn-group">
                                                    <Link
                                                        to={`/books/show/${book.id}`}
                                                        className="btn btn-outline-info btn-xs">
                                                        Show
                                                    </Link>
                                                    <Link
                                                        className="btn btn-outline-success btn-xs"
                                                        to={`/books/edit/${book.id}`}>
                                                        Edit
                                                    </Link>
                                                    <Button 
                                                        onClick={()=>handleDelete(book.id)}
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
  
export default BookList;