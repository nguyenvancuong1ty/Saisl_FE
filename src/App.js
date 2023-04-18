import './App.css'
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
	e.preventDefault();
	alert('Logout...');
	localStorage.removeItem('token');
	navigate('/login');
}
  const handleCheckOut = () => {
    setLoading(true);
    axios({
      method: 'POST',
      url: 'http://localhost:1337/api/v1/send-email',
      headers : {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    })
    .then(() => {setLoading(false); alert('check Email....')})
    .catch((e) => {alert('Login require'); navigate('/login')})
    .finally(() => setLoading(false))
  }
    return ( 
        <>
        <Link to={"/login"} style={{marginRight: '16px'}}>Login</Link>
        <Link to={"/users_manager"} style={{marginRight: '16px'}}>Users_Manager</Link>
        <Link to={"/products_manager"} style={{marginRight: '16px'}}>Product_manager</Link>
        <Link to={"/vote"} style={{marginRight: '16px'}}>Vote</Link>
        <button style={{cursor: 'pointer', outline: 'none', border: 'none', marginRight: '16px'}} onClick={() => handleCheckOut()} >Thanh toán đơn hàng</button>
		<button type="submit" onClick={(e) => {handleLogout(e)}} style={{cursor: 'pointer', outline: 'none', border: 'none', marginRight: '16px'}} >Logout </button>
    
        {loading && <section className="loadings">
                      <div className="loading-container">
                        <div className="loading"></div>
                        <div id="loading-text">loading</div>
                      </div>
                    </section> 
        }
        </>
      );
}

export default App;