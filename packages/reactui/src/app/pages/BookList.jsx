import React,{ useState, useEffect, useCallback} from 'react'
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
    const [bookList, setBookList] = useState([])
    const [filter, setFilter] = useState('')
    const [sortField, setSortField] = useState("")
    const [order, setOrder] = useState("asc")

    const fetchBookList = useCallback(() => {
        props.keepalive();
        dataLoad('books')
        .then(
            (books) => {
                dataLoad('genres')
                .then((genres)=>{
                    books.forEach((book)=>{
                        book.genreObj = genres.find((g)=>g.id===book.genre)
                    })
                    dataLoad('authors')
                    .then((authors)=>{
                        books.forEach((book)=>{
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
    },[props]);

    useEffect(() => {
        fetchBookList()
    }, [fetchBookList])
  

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
  
    const handleSortingChange = (accessor, element) => {
        const sortOrder =
            accessor === sortField && order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder);
    };
    const handleSorting = (sortField, sortOrder) => {
        if (sortField) {
            if(['author','genre'].includes(sortField)) sortField = sortField+'Obj'
            const sorted = [...bookList].sort((a, b) => {
                let av = a[sortField];
                if(av) {
                    if(['authorObj','genreObj'].includes(sortField)) av = ''+av.name;
                }
                av = ''+av;

                let bv = b[sortField];
                if(bv) {
                    if(['authorObj','genreObj'].includes(sortField)) bv = ''+bv.name;
                }
                bv = ''+bv;
                return (
                    av.localeCompare(bv, "en", {
                        numeric: true,
                    }) * (sortOrder === "asc" ? 1 : -1)
                );
            });
            setBookList(sorted);
        }
    };

    const thClick = (event) => handleSortingChange(event.target.getAttribute('data-key'), event.target);

    const Thc = (title,key) => {
        key = key || title.toLowerCase();
        const cl = 
            sortField === key && order === "asc"
            ? "up"
            : sortField === key && order === "desc"
            ? "down"
            : "default"
            ;
        return (
            <th className={cl} data-key={key} onClick={thClick}>{title}</th>
        );
    }

    return (
        <Layout>
           <div className="container">
            <h2 className="text-center mt-5 mb-3">Book Manager</h2>
                <div className="card">
                        <div className="row justify-content-start">
                            {isEdit&&
                                <Link 
                                    className="btn btn-outline-primary col-sm-2"
                                    to="/books/create">Create New Book
                                </Link>
                            }
                            <div className='col-sm-5'/>
                            <div className="col-sm-4">
                                <input 
                                    onChange={(event)=>{setFilter(event.target.value)}}
                                    value={filter}
                                    type="text"
                                    className="form-control"
                                    id="filter"
                                    name="authorFilter"
                                    placeholder="Find book"
                                    />
                            </div>
                        </div>
                    <div className="table-responsive">
                        <table className="table table-condensed">
                            <thead>
                                <tr>
                                    {Thc('Id')}
                                    {Thc('Name')}
                                    {Thc('Author')}
                                    {Thc('Genre')}
                                    {Thc('Date Added','dateAdded')}
                                    {Thc('Out of Print','outOfPrint')}
                                    {isEdit&&<th width="240px">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {bookList.filter((book)=>book.name.toLowerCase().includes(filter)).map((book, key)=>{
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