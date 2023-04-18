import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, Routes } from 'react-router-dom';
import UsersManager from './pages/UsersManager';
import ProductsManager from './pages/ProductsManager';
import Login from './pages/Login';
import { BrowserRouter } from 'react-router-dom';
import Vote from './pages/Vote';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
			<Routes>
				{/* <Route path='/' element = {<Home></Home>}></Route> */}
				<Route path='/users_manager' element = {<UsersManager></UsersManager>}></Route>
				<Route path='/login' element = {<Login></Login>}></Route>
				<Route path='/vote' element = {<Vote></Vote>}></Route>
				<Route path='/products_manager' element = {<ProductsManager></ProductsManager>}></Route>
			</Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
