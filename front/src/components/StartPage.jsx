import React from 'react';
import {Link} from "react-router-dom";
import homeImg from '../imgs/face4.png';
import Timeline from './Timeline';
import axios from 'axios';
import swal from 'sweetalert';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';

const Home = ()=> {

    function logoutFn(){

        swal({
            title: "Are you sure?",
            text: "Are you sure that you want to log out?",
            icon: "warning",
            dangerMode: true,
          })
      
          .then(willLogout => {
            if (willLogout) {

                axios.get('/main/logout/')
                .then(res => {
                    swal("Logged Out!", "You have been logged out", "success")
                    .then(okay => {
                        window.location = "/"
                      })
                })
                .catch(err => {
                    swal("Sorry!", "Your can not be logged out right now. PLease try later.", "warning")
                })
            
            }
          })
    }

    return(
        <>
        <div className="landing">
            <div className="right">
                <div className="text_part">
                    <h3> Secure Everything With Face Detection. </h3>
                    <p> Use Laptop/Computer For Better Experience </p>
                    <p> Please Read The Guide Below Before Getting Started</p>
                </div>
                <div className="register_btn">
                    {
                        isAuthenticated ? 
                        <div className = "start_btns">
                            <Link className = "btn btn-primary" to = "/allevents" >Events <TrendingFlatIcon/> </Link>
                            <button className = "btn btn-danger" onClick = {logoutFn} >Log Out</button>
                        </div>
                        :
                        <Link className = "btn btn-danger" to = "/register" >Register</Link>
                    }
                </div>
            </div>

            <div className="logo_part">
                <img src={homeImg} alt="" height= "400px" width = "400px"/>
            </div>
        </div>

        <div className="starting_guide">
        <div className="header">
                <h3> Quick Start Guide </h3>
        </div>
                <Timeline />
        </div>

        </>
    )
}

export default Home;