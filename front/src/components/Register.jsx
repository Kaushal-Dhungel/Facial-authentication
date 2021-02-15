import React,{ useState,useEffect } from 'react';
import {Link} from "react-router-dom";
import { Facebook } from 'react-spinners-css';
import axios from 'axios';
import getCookie from './utils';
import {Redirect} from 'react-router-dom';

function Signup ({func,csrf}) {


    function handleSubmit (e) {
        e.preventDefault();
        func("",true)

        const form = new FormData(e.target);
        const name = form.get("username");
        const email = form.get("email");
        const password1 = form.get("password1");
        const password2 = form.get("password2");
        console.log(name,email,password1,password2) 

        const csrftoken = csrf('csrftoken');


        const axiosConfig = {
                headers: {
                    "X-CSRFToken": csrftoken
                }
              };
              
        axios.post('/main/register/',form,axiosConfig)

        .then(res => {
            console.log(res.data)
            func(null,false)
        })
        .catch(err => {
            // console.log(err)
            console.log(err.response.data);
            func(err.response.data,false)
        })
        
      }

    return (
        <>
            <div className="container">
            <form onSubmit={handleSubmit} className = "contact_form" action="#">
                <input name = 'username' className = "form_input" type="text"  placeholder="Username" autoComplete = 'off' />
                <input name = 'email' className = "form_input" type="email"  placeholder="Email" autoComplete = 'off'/>
                <input name = 'password1' className = "form_input" type="password"  placeholder="Password" autoComplete = 'off'/>
                <input name = 'password2' className = "form_input" type="password"  placeholder="Confirm Password" autoComplete = 'off'/>
                <button className = "contact_button">Signup</button>
            </form>
            </div>

        </>
    )
} 


function Login ({func,csrf}) {

    function handleSubmit (e) {
        e.preventDefault();
        func("",true)

        const form = new FormData(e.target);
        const name = form.get("username");
        const password = form.get("password");
        const csrftoken = csrf('csrftoken');
        
        console.log(name,password)

        const axiosConfig = {
                headers: {
                    "X-CSRFToken": csrftoken
                }
              };
              
        axios.post('/main/login/',form,axiosConfig )

        .then(res => {
            console.log(res.data)
            func(null,false)

        })
        .catch(err => {
            // console.log(err)
            console.log(err.response.data);
            func(err.response.data,false)
        })
    }

    return (
        <>
            <div className="container">
            <form onSubmit={handleSubmit} className = "contact_form" action="#">
                <input name = 'username' className = "form_input" type="text"  placeholder="Username" autoComplete = 'off' />
                <input name = 'password' className = "form_input" type="password"  placeholder="Password" autoComplete = 'off'/>
                <button className = "contact_button">Sign In</button>
            </form>
            </div>

        </>
    )
} 


const Register = () => {

    const[whichRender, setWhichRender] = useState('signup')

    const [condns, setCondns] = useState({
        errormsg: "",
        isLoading: false,
    })

    const stateUpdater=(errormsg,isloading) => {
        return setCondns((prevval) => {
            return{
                ...prevval,
                errormsg : errormsg,
                isLoading : isloading
            }
        })
    }

    function clearError(){
        setCondns(()=> {
            return {
                errormsg: "",
                isLoading: false
            }
        })
    }


    return (
        isAuthenticated? 
            <Redirect to = '/' />
            :
        <div className = "register">
        <div className="container">
            <div className="categories_profile">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-dark active">
                        <input type="radio" name="options" checked 
                        onClick = {() => {
                            setWhichRender('signup');
                            clearError();
                            }} readOnly /> Signup
                    </label>
                    <label className="btn btn-outline-dark">
                        <input type="radio" name="options" onClick = {() => {
                            setWhichRender('login');
                            clearError();
                            }} readOnly /> Login
                    </label>
                </div>
            </div>
        {
            condns.isLoading? 
                <div className="loading_loading" style = {{display:"flex", justifyContent:"center",alignItems:"center"}}>
                    <Facebook color = "rgb(230, 43, 83)" size = {200} />
                </div>
        :
        <>
        <div className="register_messages" style = {{textAlign:"center",color:"white", margin:"4vh"}}>
            {
                condns.errormsg !== null?
                <p>
                    {condns.errormsg}
                </p>
                :
                <>
                <p> Registration Successful. </p>
                {/* <Link to = '/' className = "btn btn-primary">Go to Home </Link> */}
                <button className="btn btn-primary" onClick = {()=> {window.location = "/"}}> Go to Home </button>
                </>
            }
        </div>

        <div className="register_area container">
            {
                whichRender === "signup" ? <Signup func = {stateUpdater} csrf = {getCookie} /> : 
                <Login func = {stateUpdater} csrf = {getCookie}/>
            }

        </div>
        </>
        }
        </div>
        </div>
    )
}

export default Register;