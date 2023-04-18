import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState(''); 
	const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
	const handleLogin = (e) => {
		setLoading(true);
		e.preventDefault();
		axios({
			method: 'POST',
			url: 'http://localhost:1337/api/v1/login',
			data : {
				username: username,
				password: password
			}
		})
		.then(function (response) {
			// setLoading(false);
            if(response.data.token) {
				localStorage.setItem("token", response.data.token);
				navigate('/products_manager')
            } 
            else {
                alert(response.data.message);
				setLoading(false);
            }
		})
		.catch(function (error) {
				setLoading(false);
				return error;
		})
		// setLoading(false);
	}
	
	return ( <div className="container">
		<div className="d-flex justify-content-center h-100">
			<div className="card">
				<div className="card-header">
					<h3>Sign In</h3>
					<div className="d-flex justify-content-end social_icon">
						<span><i className="fab fa-facebook-square"></i></span>
						<span><i className="fab fa-google-plus-square"></i></span>
						<span><i className="fab fa-twitter-square"></i></span>
					</div>
				</div>
				<div className="card-body">
					<form>
						<div className="input-group form-group">
							<div className="input-group-prepend">
								<span className="input-group-text"><i className="fas fa-user"></i></span>
							</div>
							<input type="text" className="form-control" value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} />
							
						</div>
						<div className="input-group form-group">
							<div className="input-group-prepend">
								<span className="input-group-text"><i className="fas fa-key"></i></span>
							</div>
							<input type="password" className="form-control" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
						</div>
						<div className="row align-items-center remember">
							<input type="checkbox" />Remember Me
						</div>
						<div className="form-group">
							<input type="submit" value="Login" className="btn float-right login_btn" onClick={(e) => {handleLogin(e)}} />
						</div>
					</form>
				</div>
				<div className="card-footer">
					<div className="d-flex justify-content-center links">
						Don't have an account?<a href="/">Sign Up</a>
					</div>
					<div className="d-flex justify-content-center">
						<a href="/">Forgot your password?</a>
					</div>
				</div>
			</div>
		</div>
		{loading && <section className="loadings">
                      <div className="loading-container">
                        <div className="loading"></div>
                        <div id="loading-text">loading</div>
                      </div>
                    </section> 
        }
	</div> 
	);
	}

export default Login;