import React,{ useState, useEffect} from 'react'
import {Link, useParams, useNavigate} from "react-router-dom"
import Swal from 'sweetalert2'

import Layout from '../components/Layout'
import Select from '../components/Select'
import CheckBox from '../components/CheckBox'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {dataLoad,toJSON} from '../http-common';

 
function BookEdit(props) {
    const [id] = useState(useParams().id)
    const [name, setName] = useState('');
    const [author, setAuthor] = useState(0)
    const [genre, setGenre] = useState(0)
    const [dateAdded, setDateAdded] = useState(new Date("2020-10-07"))
    const [outOfPrint, setOutOfPrint] = useState(false);
    const [authorList, setAuthorList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [isSaving, setIsSaving] = useState(false)
  
    const navigate = useNavigate();

    const nameSort = (a,b) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        // names must be equal
        return 0;
    }

    useEffect(() => {
        props.keepalive()
        if(id) {
            dataLoad(`books/${id}`)
            .then((book)=>{
                setName(book.name);
                setAuthor(book.author);
                setGenre(book.genre);
                setDateAdded(new Date(book.dateAdded));
                setOutOfPrint(book.outOfPrint);
            })
        }

        dataLoad('genres')
        .then((genres)=>{
            genres.sort(nameSort);
            setGenreList(genres)
            if(id==0) {
                if(genres&&genres.length) {
                    setGenre(genres[0].id)
                }    
            }
        })
        dataLoad('authors')
        .then((authors)=>{
            authors.sort(nameSort);
            setAuthorList(authors)
            if(id==0) {
                if(authors&&authors.length) {
                    setAuthor(authors[0].id)
                }    
            }
        })
    }, [id,props])

    const handleSave = () => {
        props.keepalive()
        setIsSaving(true);
        const bookData = {
            name: name,
            author: author,
            genre: genre,
            dateAdded: dateAdded,
            outOfPrint: outOfPrint
        }
        let method = 'post';
        if( id ) {
            bookData.id = id;
            method = 'put';
        }
        dataLoad('books', method, toJSON(bookData))
          .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Book saved successfully!',
                showConfirmButton: false,
                timer: 3000
            }).then(()=>navigate('/books', { replace: true }))
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
                <h2 className="text-center mt-5 mb-3">{id?'Edit Book':'Create New Book'}</h2>
                <div className="card">
                    <div className="card-header">
                        <Link 
                            className="btn btn-outline-info float-right"
                            to="/books">&lt;&lt; View All Books
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
                                    placeholder="Enter book name"
                                    />
                            </div>
                            <div className="form-group">
                                <label htmlFor="author">Author</label>
                                <Select
                                    name="author" 
                                    options={authorList} 
                                    selected={author}
                                    param="author"
                                    onChange={e => setAuthor(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="genre">Genre</label>
                                <Select
                                    name="genre" 
                                    options={genreList} 
                                    selected={genre}
                                    param="genre"
                                    onChange={e => setGenre(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                            <CheckBox
                                id="outOfPrint"
                                label="Out of Print"
                                onChange={e=>setOutOfPrint(e.target.checked)}
                            />
                            </div>
                            <div className="form-group">

                            <DatePicker
                                    selected={dateAdded}
                                    onChange={e=>setDateAdded(e)}
                                />
                            </div>

                            <button 
                                disabled={isSaving}
                                onClick={handleSave} 
                                type="button"
                                className="btn btn-outline-primary mt-3">
                                Save Book
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
export default BookEdit;