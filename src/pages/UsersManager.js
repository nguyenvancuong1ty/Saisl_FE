import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function UsersManager() {
	const [Users, setUsers] = useState([]);
    const [isShow, setShow] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [typeSubmit, setTypeSubmit] = useState('');
	const [email, setEmail] = useState('');
	const [textSearch, setTextSearch] = useState('');
    const [isReRender, setReRender] = useState(false);
    const [id, setId] = useState();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [listUsersDelete, setListUsersDelete] = useState([]);
    // const [page, setPage] = useState(1);
   
    const getAll = (text) => {
        let url;
        url = text? `http://localhost:1337/api/v1/users/${text}`: `http://localhost:1337/api/v1/users`;
        axios({
			method: 'get',
			url: url,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function (response) {
			setUsers(response.data.data);
		})
		.catch(function (error) {
            return error
		})
		.finally(function () {
		})
    }
	useEffect(() => {
		getAll();
    }, [isReRender]) //page
    const handleCheck = (e, id) => {
        e.target.checked ? setListUsersDelete([...listUsersDelete, id]) : setListUsersDelete(listUsersDelete.filter(item => item !== id))       
    }

    const handleSubmit = () => {
        axios({
			method: 'POST',
			url: 'http://localhost:1337/api/v1/users',
			data : {
				userName: username,
				password: password,
                email: email
			}
		})
		.then(function (response) {
            setReRender(!isReRender)
            setShow(false);
		})
		.catch(function (error) {
            return error
		})
    }

    const handleDelete = (id) => {
        if(token) {
        axios({
            method: 'delete',
            url: `http://localhost:1337/api/v1/users/${id}`,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(() => {
                setUsers(Users.filter((user) =>  user.id !== id ));
            })
            .catch((error) => {
                console.log(error);
                alert("Bạn không có quyền truy cập vào tài nguyên này.");
            });
        }
        else {
            alert("Cần đăng nhập");
            setTimeout(() => {
                navigate("/login");
            }, 500);
        }
    };

    const handleAdd = () => {
        setShow(true);
    }

    const handleSearch = () => {
        getAll(textSearch.trim());
    }

    const handleKeySearch = (e) => {
        e.key === "Enter" && getAll(textSearch.trim());
    }
    
    const handleDeleteMulti = (id) => {
        if(!token) {
            alert("Cần đăng nhập");
            setTimeout(() => {
                navigate("/login");
            }, 500);
        } 
        else {
            const deleted = prompt("Enter 'delete' to confirm deletion.", "");
            if(deleted === 'delete') {
                axios({
                    method: 'Delete',
                    url: 'http://localhost:1337/api/v1/users',
                    data : {
                        id : listUsersDelete
                    }
                })
                .then((response) => {
                    setUsers(Users.filter((user) => !listUsersDelete.includes(user.id)));
                })
                .catch((error) => {
                    return error
                });
            }
            else {
                return;
            }
        }
    }
    const handleUpdate = () => {
        if(token) {
            axios({
                method: 'PUT',
                url: `http://localhost:1337/api/v1/users/${id}`,
                data : {
                    userName: username,
                    password: password,
                    email: email
                }
            })
            .then(function (response) {
                setReRender(!isReRender)
                setShow(false);
            })
            .catch(function (error) {
                return error
            })
        }
        else {
            alert("Cần đăng nhập");
            setTimeout(() => {
                navigate("/login");
            }, 500);
        }
    }
    return ( <>
        <section style={{margin: "0 auto", display: 'flex', justifyContent: 'center'}} onKeyUp={(e) => handleKeySearch(e)}>
            <input type='text' placeholder='Type text search' value={textSearch} onChange={(e) => setTextSearch(e.target.value)}></input>
            <button onClick={() => {handleSearch()}}>search</button>
        </section>
        <table className="table table-success" style={{padding: '0', width: "80%", margin: "0 auto"}}>
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">id </th>
                            <th scope="col">Username</th>
                            <th scope="col">Password</th>
                            <th scope="col">Email</th>
                            <th scope="col">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Users &&
                            Users.map((item, index) => {
                                return (
                                    item.authorization !== 1 && (
                                        <tr key={index}>
                                            <td><input type='checkbox' onClick={(e) => handleCheck(e, item.id)}></input></td>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.userName}</td>
                                            <td>{item.password}</td>
                                            <td>{item.email}</td>
                                            <td>
                                            <button
                                                    onClick={() => {
                                                        handleDelete(item.id);
                                                    }}
                                                >Xóa</button>
                                                <button
                                                    onClick={() => {
                                                        setUsername(item.userName);
                                                        setPassword(item.password);
                                                        setEmail(item.email);
                                                        setTypeSubmit('update');
                                                        setShow(true);
                                                        setId(item.id);
                                                    }}
                                                > Sửa </ button>
                                            </td>
                                        </tr>
                                    )
                                );
                            })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={6} style={{textAlign: "center"}}>
                                <button
                                    value="Thêm"
                                    className="add__type-cake"
                                    onClick={() => {
                                        setUsername('');
                                        setPassword('');
                                        setEmail('');
                                        handleAdd();
                                        setTypeSubmit('add');
                                    }}
                                    >Thêm</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                {/* <div className="pagination">
                    <p onClick={() => setPage(prev => prev - 1)}>&laquo;</p>
                    <p className={page === 1 ? "active": ''}  onClick={() => setPage(1)}>1</p>
                    <p className={page === 2 ? "active": ''}  onClick={() => setPage(2)}>2</p>
                    <p className={page === 3 ? "active": ''}  onClick={() => setPage(3)}>3</p>
                    <p className={page === 4 ? "active": ''}  onClick={() => setPage(4)}>4</p>
                    <p className={page === 5 ? "active": ''}  onClick={() => setPage(5)}>5</p>
                    <p className={page === 6 ? "active": ''}  onClick={() => setPage(6)}>6</p>
                    <p onClick={() => setPage(prev => prev + 1)}>&raquo;</p>
                </div> */}
                <div className={isShow ? 'overlay show' : 'overlay'} onClick={() => setShow(false)}>
                <div className="frm_add" onClick={(e) => e.stopPropagation()}>
                    <div className="form-group">
                        <label htmlFor="Username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Username"
                            aria-describedby="Username"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Password">Password</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Password"
                            aria-describedby="Password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="Email"
                            aria-describedby="Email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    {typeSubmit === 'update'? <button
                        className="btn btn-primary"
                        value="Submit"
                        onClick={() => {
                            handleUpdate();
                        }}
                    >Sửa</button> :
                    <button
                        className="btn btn-primary"
                        value="Submit"
                        onClick={() => {
                            handleSubmit();
                        }}
                    >Add</button>
                }
                </div>
            </div>
        {listUsersDelete && listUsersDelete.length > 0 &&  <button onClick={() => handleDeleteMulti()} style={{position: "fixed", top: "24px", right : "24px", color : 'Red', border: '3px solid red'}}>Delete Multi</button>}
        </>
    );
}

export default UsersManager;