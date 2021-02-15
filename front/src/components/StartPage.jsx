import React from 'react';
import {Link} from "react-router-dom";
import homeImg from '../imgs/face4.png';
import Timeline from './Timeline';

const Home = ()=> {
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
                            <Link className = "btn" to = "/allevents" >Events</Link>
                            <Link className = "btn" to = "/logout" >Log Out</Link>
                        </div>
                        :
                        <Link className = "btn" to = "/register" >Register</Link>
                    }
                </div>
            </div>

            <div className="logo_part">
                <img src={homeImg} alt="" height= "400px" width = "400px"/>
            </div>
        </div>

        <div className="starting_guide">
        <div className="heading">
                <h3> Quick Start Guide </h3>
        </div>
                <Timeline />
        </div>

        </>
    )
}

export default Home;