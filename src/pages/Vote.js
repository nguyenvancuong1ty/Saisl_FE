import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function Vote() {
    const [value, setValue] = useState('');
    const navigate = useNavigate();
    const handleVote = () => {
        axios({
        method: 'POST',
        url: 'http://localhost:1337/api/v1/vote',
        data : {
            status: value
        },
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
        })
        .then((res) => {alert(res.data.message)})
        .catch(() => {
            if(value) {
                alert('Login require');
                navigate('/login');
            } 
            else {
                alert('Select an answer')
            }
        })
    }
    return (  <>
                <section style={{display: 'flex', alignItems: 'center', color:'white', width: '50%', margin: '0 auto', background: 'black', justifyContent: 'center', height: '300px', marginTop: '100px'}}>
                    <input onChange={(e) => {setValue(e.target.value)}} type="radio" id="great" name="fav_language" value="great" />
                    <label style={{marginRight: '16px'}} htmlFor="great">great</label><br/>
                    <input onChange={(e) => {setValue(e.target.value)}} type="radio" id="good" name="fav_language" value="good" />
                    <label style={{marginRight: '16px'}} htmlFor="good">good</label><br/>
                    <input onChange={(e) => {setValue(e.target.value)}} type="radio" id="normal" name="fav_language" value="normal"/>
                    <label style={{marginRight: '16px'}} htmlFor="normal">normal</label>
                    <input onChange={(e) => {setValue(e.target.value)}} type="radio" id="bad" name="fav_language" value="bad"/>
                    <label style={{marginRight: '16px'}} htmlFor="bad">bad</label>
                </section>
                    <button onClick={() => handleVote()} style={{margin: '8px auto', display:'block', padding:'8px 24px', cursor: 'pointer'}}>Vote</button>
</> );
}

export default Vote;