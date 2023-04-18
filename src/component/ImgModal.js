import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

function ImgModal({ setSRrc, productId, show }) {
    const [data, setData] = useState([]);
    const [idModal, setIdModal] = useState(0);
    const [imageLink, setImageLink] = useState('');
    const scrollRef = useRef(null);
    useEffect(() => {
        axios({
            method: 'get',
            url: `http://localhost:1337/api/v1/products/${productId}`,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function (response) {
                setData(response.data.data);
            })
            .catch(function (error) {
                if (error.response.data.statusCode === 409) {
                    alert(error.response.data.message);
                }
                return error;
            })
            .finally(function () {});
    }, [productId]);

    useEffect(() => {
        Array.isArray(data) && data.length > 0 && setSRrc(data[idModal].alt);
    }, [idModal, data, setSRrc]);

    const handleNext = (e) => {
        e.stopPropagation();
        idModal < data.length - 1 ? setIdModal((prev) => prev + 1) : setIdModal(data.length - 1);
        scrollRef.current.scrollLeft += 300;
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        idModal > 0 ? setIdModal((prev) => prev - 1) : setIdModal(0);
        scrollRef.current.scrollLeft -= 300;
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        axios({
            method: 'PUT',
            url: `http://localhost:1337/api/v1/images/${id}`,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(function () {
                setData(data.filter((data) => data.id !== id));
                idModal > 0 && setIdModal((prev) => prev - 1);
            })
            .catch(function (error) {
                if (error.response.data.statusCode === 409) {
                    alert(error.response.data.message);
                }
                return error;
            });
    };

    const handleAdd = (e) => {
        e.stopPropagation();
        axios({
            method: 'Post',
            url: 'http://localhost:1337/api/v1/images',
            data: {
                productId: productId,
                alt: imageLink,
            },
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        }).then((res) => {
            alert(res.message);
            show(false);
        });
    };
    return (
        <>
            <div
                className="modal-img"
                style={{
                    position: 'fixed',
                    top: '0',
                    right: '0',
                    left: '0',
                    bottom: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.5)',
                }}
                onClick={() => {
                    show(false);
                }}
            >
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    style={{
                        position: 'absolute',
                        top: 50,
                    }}
                >
                    <input
                        placeholder="Enter image link"
                        value={imageLink}
                        onChange={(e) => setImageLink(e.target.value)}
                    />
                    <button onClick={handleAdd}>Thêm ảnh</button>
                </div>
                <h1
                    style={{ color: 'white', margin: '0 16px', cursor: 'pointer', padding: '8px' }}
                    onClick={(e) => handlePrev(e)}
                >
                    &lt;
                </h1>
                <div className="modal-wrap" ref={scrollRef}>
                    <div className="images_modal">
                        {Array.isArray(data) &&
                            data.length > 0 &&
                            data.map((img) => {
                                return (
                                    <img
                                        key={img.id}
                                        alt=""
                                        src={img && img.alt}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        style={{
                                            scrollSnapAlign: 'start',
                                            width: '300px',
                                            position: 'relative',
                                            height: '300px',
                                            objectFit: 'cover',
                                            boxShadow:
                                                'rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px',
                                        }}
                                    ></img>
                                );
                            })}
                    </div>
                </div>
                <h1
                    style={{ color: 'white', margin: '0 16px', cursor: 'pointer', padding: '8px' }}
                    onClick={(e) => handleNext(e)}
                >
                    &gt;
                </h1>
                <button
                    onClick={(e) => {
                        handleDelete(e, data[idModal].id);
                    }}
                    style={{
                        position: 'absolute',
                        bottom: 50,
                    }}
                >
                    Xóa ảnh
                </button>
            </div>
        </>
    );
}

export default ImgModal;
