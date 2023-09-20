import React, { useState, useEffect, useCallback} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import Layout from "../components/Layout"
import Button from '../components/Button'

import permissions from '../permissions';
import { dataLoad } from '../http-common';

/*
export const authorsMeta = {
  id: { name: "ID", editable: false, visible: true },
  name: { name: "Name", editable: true, visible: true, required: true },
  age: { name: "Age", editable: true, visible: true },
};
*/

function AuthorList(props) {
    const [authorList, setAuthorList] = useState([])
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState("asc");

    const navigate = useNavigate();

    const fetchAuthorList = useCallback(() => {
        props.keepalive();
        dataLoad('authors')
            .then(
                (authors) => {
                    setAuthorList(authors)
                }
            );
    }, [props]);

    useEffect(() => {
        fetchAuthorList()
    }, [fetchAuthorList])


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
                dataLoad(`authors/${id}`, 'delete')
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Author deleted successfully!',
                            showConfirmButton: false,
                            timer: 3000
                        })
                            .then(() => fetchAuthorList())
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: '' + error,
                            showConfirmButton: true
                        })
                            .then(() => props.keepalive());
                    });
            }
        })
    }

    const handleSortingChange = (accessor) => {
        const sortOrder =
            accessor === sortField && order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder);
    };
    const handleSorting = (sortField, sortOrder) => {
        if (sortField) {
            const sorted = [...authorList].sort((a, b) => {
                return (
                    (a[sortField]??'').toString().localeCompare((b[sortField]??'').toString(), "en", {
                        numeric: true,
                    }) * (sortOrder === "asc" ? 1 : -1)
                );
            });
            setAuthorList(sorted);
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

    const isEdit = props.permission >= permissions.edit;

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Author Manager</h2>
                <div className="card">
                    <div className="row justify-content-start">
                        {isEdit &&
                            <Link
                                className="btn btn-outline-primary col-sm-2"
                                to="/authors/create">
                                Create New Author
                            </Link>
                        }
                        <div className='col-sm-5' />
                        <div className="col-sm-4">
                            <input
                                onChange={(event) => { setFilter(event.target.value) }}
                                value={filter}
                                type="text"
                                className="form-control"
                                id="filter"
                                name="authorFilter"
                                placeholder="Find author"
                            />
                        </div>
                    </div>
                    <div className="table-responsive">

                        <table className="table table-condensed">
                            <thead>
                                <tr>
                                    {Thc('Id')}
                                    {Thc('Name')}
                                    {Thc('Age')}
                                    {isEdit && <th width="240px">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {authorList.filter((author) => 
                                    author.name.toLowerCase().includes(filter.toLowerCase())
                                    ).map((author, key) => {
                                    return (
                                        <tr key={key} onDoubleClick={()=>navigate('/authors/show/'+author.id)} >
                                            <td>{author.id}</td>
                                            <td>{author.name}</td>
                                            <td>{author.age}</td>
                                            {isEdit && <td>
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
                                                        onClick={() => handleDelete(author.id)}
                                                        classes="btn btn-outline-danger btn-xs"
                                                        text='Delete' />
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