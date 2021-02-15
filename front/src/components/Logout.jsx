import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
// import { useHistory } from "react-router-dom";

const LogOut = () => {

    function logoutFn(){

        axios.get('/main/logout/')
        .then(res => {
            console.log(res.data)
            // history.push('/');
            window.location = "/"

        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        isAuthenticated? 
        <>
            {
                <div className="logout_screen">
                    <div>
                        <h4> Click The Button Below To Log Out </h4>
                        <button className = "contact_button" onClick = {logoutFn}>Log Out</button>
                    </div>
                </div>
            }
        </>
        :
        <Redirect to = '/' />

    )
}

export default LogOut;