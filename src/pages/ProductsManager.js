import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ImgModal from '~/component/ImgModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
function ProductsManager() {
    const [products, setProducts] = useState([]);
    const [isShow, setShow] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [name, setName] = useState('');
    const [src, setSRrc] = useState('');
    const [description, setDescription] = useState('');
    const [typeSubmit, setTypeSubmit] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [textSearch, setTextSearch] = useState('');
    const [isReRender, setReRender] = useState(false);
    const [id, setId] = useState();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [listUsersDelete, setListUsersDelete] = useState([]);
    const [idModal, setIdModal] = useState(1);

    // const [page, setPage] = useState(1);
    const getAll = (text) => {
        let url;
        url = text ? `http://localhost:1337/api/v1/products/find/${text}` : `http://localhost:1337/api/v1/products`;
        axios({
            method: 'get',
            url: url,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setProducts(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
                if (error.response.data.statusCode === 409) {
                    alert(error.response.data.message);
                }
                return error;
            })
            .finally(function () {});
    };
    useEffect(() => {
        getAll();
    }, [isReRender]); //page
    const handleCheck = (e, id) => {
        e.target.checked
            ? setListUsersDelete([...listUsersDelete, id])
            : setListUsersDelete(listUsersDelete.filter((item) => item !== id));
    };

    const handleSubmit = () => {
        axios({
            method: 'POST',
            url: 'http://localhost:1337/api/v1/products',
            data: {
                name: name,
                description: description,
                thumbnail: thumbnail,
            },
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setReRender(!isReRender);
                setShow(false);
            })
            .catch(function (error) {
                return error;
            });
    };

    const handleDelete = (id) => {
        if (token) {
            axios({
                method: 'put',
                url: `http://localhost:1337/api/v1/products/delete/${id}`,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
                .then(() => {
                    setProducts(products.filter((product) => product.id !== id));
                })
                .catch((error) => {
                    console.log(error);
                    alert('Bạn không có quyền truy cập vào tài nguyên này.');
                });
        } else {
            alert('Cần đăng nhập');
            setTimeout(() => {
                navigate('/login');
            }, 500);
        }
    };

    const handleAdd = () => {
        setShow(true);
    };

    const handleSearch = () => {
        getAll(textSearch.trim());
    };

    const handleKeySearch = (e) => {
        e.key === 'Enter' && getAll(textSearch.trim());
    };

    const handleDeleteMulti = (id) => {
        if (!token) {
            alert('Cần đăng nhập');
            setTimeout(() => {
                navigate('/login');
            }, 500);
        } else {
            const deleted = prompt("Enter 'delete' to confirm deletion.", '');
            if (deleted === 'delete') {
                axios({
                    method: 'Put',
                    url: 'http://localhost:1337/api/v1/products/delete',
                    data: {
                        id: listUsersDelete,
                    },
                })
                    .then((response) => {
                        setProducts(products.filter((product) => !listUsersDelete.includes(product.id)));
                    })
                    .catch((error) => {
                        return error;
                    });
            } else {
                return;
            }
        }
    };
    const handleUpdate = () => {
        if (token) {
            axios({
                method: 'PUT',
                url: `http://localhost:1337/api/v1/products/${id}`,
                data: {
                    name: name,
                    description: description,
                    thumbnail: thumbnail,
                },
            })
                .then(function (response) {
                    setReRender(!isReRender);
                    setShow(false);
                })
                .catch(function (error) {
                    return error;
                });
        } else {
            alert('Cần đăng nhập');
            setTimeout(() => {
                navigate('/login');
            }, 500);
        }
    };

    const handleClickImage = (id, src) => {
        setSRrc(src);
        setShowImg(true);
        setIdModal(id);
    };

    return (
        <>
            <section
                style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}
                onKeyUp={(e) => handleKeySearch(e)}
            >
                <input
                    type="text"
                    placeholder="Type text search"
                    value={textSearch}
                    onChange={(e) => setTextSearch(e.target.value)}
                ></input>
                <button
                    onClick={() => {
                        handleSearch();
                    }}
                >
                    search
                </button>
            </section>
            <table className="table table-success" style={{ padding: '0', width: '80%', margin: '0 auto' }}>
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">id </th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Thumbnail</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    {products &&
                        products.map((item, index) => {
                            return (
                                item.authorization !== 1 && (
                                    <tr key={index}>
                                        <td>
                                            <input type="checkbox" onClick={(e) => handleCheck(e, item.id)}></input>
                                        </td>
                                        <th scope="row">{item.id}</th>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <img
                                                alt=""
                                                src={
                                                    Array.isArray(item.images) &&
                                                    item.images.length > 0 &&
                                                    item.images.find((item) => {
                                                        return item.thumbnail === true;
                                                    }).alt
                                                }
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => {
                                                    handleClickImage(item.id, item.images[0].alt);
                                                }}
                                            ></img>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    handleDelete(item.id);
                                                }}
                                            >
                                                Xóa
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setName(item.name);
                                                    setDescription(item.description);
                                                    setThumbnail(item.images[0].alt);
                                                    setTypeSubmit('update');
                                                    setShow(true);
                                                    setId(item.id);
                                                }}
                                            >
                                                {' '}
                                                Sửa{' '}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            );
                        })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6} style={{ textAlign: 'center' }}>
                            <button
                                value="Thêm"
                                className="add__type-cake"
                                onClick={() => {
                                    setName('');
                                    setDescription('');
                                    setThumbnail('');
                                    handleAdd();
                                    setTypeSubmit('add');
                                }}
                            >
                                Thêm
                            </button>
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
                        <label htmlFor="name">name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            aria-describedby="name"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">description</label>
                        <ReactQuill
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e);
                            }}
                        />
                        {/* <input
                            type="text"
                            className="form-control"
                            id="description"
                            aria-describedby="description"
                            value={}
                        /> */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="thumbnail">thumbnail</label>
                        <input
                            type="thumbnail"
                            className="form-control"
                            id="thumbnail"
                            aria-describedby="thumbnail"
                            placeholder="Enter thumbnail"
                            value={thumbnail}
                            onChange={(e) => {
                                setThumbnail(e.target.value);
                            }}
                        />
                    </div>
                    {typeSubmit === 'update' ? (
                        <button
                            className="btn btn-primary"
                            value="Submit"
                            onClick={() => {
                                handleUpdate();
                            }}
                        >
                            Sửa
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            value="Submit"
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            Add{' '}
                        </button>
                    )}
                </div>
            </div>
            {listUsersDelete && listUsersDelete.length > 0 && (
                <button
                    onClick={() => handleDeleteMulti()}
                    style={{
                        position: 'fixed',
                        top: '24px',
                        right: '24px',
                        color: 'Red',
                        border: '3px solid red',
                    }}
                >
                    Delete Multi
                </button>
            )}
            {showImg && <ImgModal src={src} setSRrc={setSRrc} productId={idModal} show={setShowImg} />}
        </>
    );
}
export default ProductsManager;
