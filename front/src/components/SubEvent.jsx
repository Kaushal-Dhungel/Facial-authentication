import React from 'react';
import {Link} from 'react-router-dom';
import Webcam from "react-webcam";
import axios from 'axios';
import getCookie from './utils';
import { Ellipsis } from 'react-spinners-css';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';

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
            
                <div className="add_people" style = {{display:"flex",justifyContent:"center"}}>
                    <h3>Verified List <ArrowRightAltIcon /> </h3>
                    <Link to = {`/attendence/${slug}`} className = "btn btn-danger">Go <ArrowRightAltIcon /> </Link>
                </div>

            <div className="camera_top">
                <button onClick = {camerafn}
                    className = "btn btn-primary"
                    > {showcam?`Stop`:`Start`} Verification</button>

                <div>
                    <h3 style = {{color:"grey"}} > Image will be displayed Below <ArrowDownwardIcon /> </h3>
                </div>
            </div>

            {
                err !== '' ? 
                    <div className="message_section">
                        <h4> {err} </h4>
                        <button className = "btn btn-danger" onClick={()=> setErr('')}> <ClearIcon /> </button>
                    </div>
                    : null
            }

            <center className = "camera_and_pic">
                <div className="verification" id= "verify" style = {{
                    margin:"5vh 0 2vh 0"
                    }}>

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
                            <button className = "btn btn-secondary"
                            onClick={capture} style={{margin:"1vh 0"}}>Capture photo</button>
                        </div>
                        : 
                        <PhotoCameraIcon style = {{fontSize : 350}} />
                    }
                    
                </div>

                {
                    imgsrc === ""?  <PhotoSizeSelectActualIcon style = {{fontSize:350, margin:"3vh 5vw"}} />
                    :
                    <div className="img_field">
                        <img src={imgsrc} alt=".." srcset="" height= "365px" width= "400px"/>

                        <div className="btnss" style= {{marginTop:"5vh"}}>
                            
                            {
                                loading ? 
                                <div className="loading_loading" style = {{display:"flex", justifyContent:"center",alignItems:"center"}}>
                                    <Ellipsis color = "rgb(230, 43, 83)" size = {60} />
                                </div>
                                :
                                <div className = "camButtons">
                                    <button className = "btn btn-primary" onClick = {verifyFn}>Verify</button>
                                    <button className = "btn btn-danger" onClick = {()=> 
                                    {setImgsrc('') 
                                    setErr('')}}
                                    >Clear</button>
                                </div>
                            }

                        </div>
                    </div>
                }
    
            </center>
        </div>

        </>
    )
}

export default SubEvent;