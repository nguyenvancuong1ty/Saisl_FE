import axios from "axios";
import { useEffect, useState } from "react";

const GetAllData = (url) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios({
            method: 'get',
            url: url,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(function (response) {
            setData(response);
        })
        .catch(function (error) {
            return error
        })
    }, [url])
    return {data}
}
export default GetAllData;