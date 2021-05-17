import React, { useState } from 'react';
import { Default } from 'react-spinners-css';
import axios from 'axios';
import getCookie from './utils';
import {Redirect} from 'react-router-dom';

const Login = () => {

    const [condns, setCondns] = useState({
        errormsg: "",
        isLoading: false,
    })

    function handleSubmit (e) {
        e.preventDefault();

        setCondns(prevVal => {
            return {
                errormsg : "",
                isLoading : true
            }

        })
        const form = new FormData(e.target);
        const name = form.get("username");
        const password = form.get("password");
        const csrftoken = getCookie('csrftoken');
        
        console.log(name,password)

        const axiosConfig = {
                headers: {
                    "X-CSRFToken": csrftoken
                }
              };
              
        axios.post('/main/login/',form,axiosConfig )

        .then(res => {
            console.log(res.data)
            setCondns(prevVal => {
                return {
                    errormsg : null,
                    isLoading : false
                }
            })
        })

        .catch(err => {
            console.log(err.response.data);
            setCondns(prevVal => {
                return {
                    errormsg : err.response.data,
                    isLoading : false
                }
            })
        })
}

    return(
            isAuthenticated ? 
            <Redirect to = '/' />
            :
            <>
                <h2 className = "header"> Login Here </h2>

                {
                condns.errormsg === "" ? null :
                    <div className="container register_messages">
                        {
                            condns.errormsg !== null?
                            <p>
                                {condns.errormsg}
                            </p>
                            :
                            <>
                                <p> Registration Successful. </p>
                                <button className="btn btn-primary" onClick = {()=> {window.location = "/"}}> Go to Home </button>
                            </>
                        }
                    </div>
                }

                <div className = "login container">
                <form action="" onSubmit={handleSubmit}>
                    <input type="text" name="username" className="formStyle" placeholder="Username" autocomplete="off"  required /> <br/>
                    <input type="password" name="password" className="formStyle" placeholder="Password" required
                    />
                    {
                            condns.isLoading ?  <Default color = "rgb(230, 43, 83)" size = {80} />
                            :
                            <button className = "btn btn-danger"> Login </button>

                    }
                </form>
            </div>
            </>
    )
}

export default Login;