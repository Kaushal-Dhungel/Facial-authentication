import React from 'react';
import {Link} from 'react-router-dom';
import Webcam from "react-webcam";
import axios from 'axios';
import getCookie from './utils';
import { Default } from 'react-spinners-css';

const SubEvent = (props) => {

    const [showcam,setShowcam] = React.useState(false);
    const[imgsrc,setImgsrc] = React.useState('')
    const[backendimg,setBackendimg] = React.useState(null) // this is to send to the backend
    const[err,setErr] = React.useState('')
    const [loading,SetLoading] = React.useState(false)
    const webcamRef = React.useRef(null);
    const slug = props.match.params.id 

    const capture = React.useCallback(
        () => {
        const imageSrc = webcamRef.current.getScreenshot();
        
        fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], "trainimg.jpeg",{ type: "image/jpeg" })
            setBackendimg(file)

            const myimg = URL.createObjectURL(file)
            setImgsrc(myimg);
        })

        },
        [webcamRef]
    );

    function camerafn() {
        setShowcam(!showcam);
    }


    function verifyFn() {
        if(backendimg === null){
            setErr("error occcured. Value missing")
            return
        }

        SetLoading(true)
        const form = new FormData();
        form.append('img',backendimg)
        form.append('slug',slug)

        const csrftoken = getCookie('csrftoken');


        const axiosConfig = {
                headers: {
                    "X-CSRFToken": csrftoken
                }
              };
              
        axios.post(`/main/verifyview/`,form,axiosConfig)
    
        .then(res => {
            console.log(res.data)
            setErr(`verified. Welcome ${res.data.name}`)
            SetLoading(false)
        })
        .catch(err => {
            // console.log(err);
            setErr(err.response.data)
            SetLoading(false)

        })
    }

    return (
        <>
        <div className="container" style = {{
            marginTop:"10vh", minHeight:"60vh"
            }}>

            <center>
                <div className="event_card">
                    <h4> See The Authenticated People </h4>
                    <Link className = "btn" to = {`/attendence/${slug}`}>Authenticated List</Link>
                </div>
            </center>

            {
                    err !== '' ? 
                        <div className="message_section">
                            <h4> {err} </h4>
                            <button className = "contact_button" onClick={()=> setErr('')}>Clear</button>
                        </div>
                        : null
                }


            <center className = "camera_and_pic">
                <div className="verification" id= "verify" style = {{
                    margin:"10vh 0"
                    }}>
                        
                    <button onClick = {camerafn}> {showcam?`Stop`:`Start`} Verification</button>

                    {
                        showcam?
                        <div className="camera">
                            <Webcam
                                audio={false}
                                height={500}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={500}
                                // videoConstraints={videoConstraints}
                            />
                            <button onClick={capture} style={{margin:"1vh 0"}}>Capture photo</button>
                        </div>
                        : null
                    }
                    
                </div>
                
                <div className="img_field">
                    {
                    imgsrc === ""? 
                        <h2 style = {{color:"white"}}> Image will be displayed here </h2>:
                        <>
                            <img src={imgsrc} alt=".." srcset="" height= "365px" width= "400px"/>

                            <div className="btnss" style= {{marginTop:"5vh"}}>
                                
                                {
                                    loading ? 
                                    <div className="loading_loading" style = {{display:"flex", justifyContent:"center",alignItems:"center"}}>
                                        <Default color = "rgb(230, 43, 83)" size = {80} />
                                    </div>
                                    :
                                    <div className = "camButtons">
                                        <button  onClick = {verifyFn}>Verify</button>
                                        <button  onClick = {()=> 
                                        {setImgsrc('') 
                                        setErr('')}}
                                        >Clear</button>
                                    </div>
                                }

                            </div>
                           
                        </>
                    }
                </div>
    
            </center>
        </div>

        </>
    )
}

export default SubEvent;