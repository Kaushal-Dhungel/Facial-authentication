import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import Webcam from "react-webcam";
import axios from 'axios';
import getCookie from './utils';
import { Ellipsis } from 'react-spinners-css';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';

const Train = (props) => {
    const [showcam,setShowcam] = React.useState(false);
    const[imgsrc,setImgsrc] = React.useState('') // this is to display img
    const[backendimg,setBackendimg] = React.useState(null) // this is to send to the backend
    const[personName, setPersonName] = React.useState('')
    const[err, setErr] = React.useState('')
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

    const imgChange = (e) => {
        // console.log(e.target.files[0]);

        setImgsrc();  // this clears the previously selected imgs
        setBackendimg();
        if (e.target.files){
            setBackendimg(e.target.files[0])

            const fileArray = URL.createObjectURL(e.target.files[0])
            setImgsrc(fileArray);

        }
    }

    function handleChange(e) {
        setPersonName(e.target.value)
    }


    const trainFunc = () => {

        if (!backendimg.name.match(/.(jpg|jpeg)$/i)){
            setErr('please use jpg/jpeg image only');
            return
        }

        SetLoading(true)
        const form = new FormData();
        form.append('name',personName)
        form.append('img',backendimg)
        form.append('slug',slug)

        const csrftoken = getCookie('csrftoken');

        const axiosConfig = {
                headers: {
                    "X-CSRFToken": csrftoken
                }
              };
              
        axios.post(`/main/trainview/`,form,axiosConfig)
    
        .then(res => {
            console.log(res.data)
            setErr('training successful')
            SetLoading(false)
        })
        .catch(err => {
            console.log(err.response.data);
            setErr(err.response.data)
            SetLoading(false)

        })
    }

    return (
        <>
        <div className="container" style = {{
            marginTop:"10vh", minHeight:"80vh"
            }}>

            <div className="header">
                <h3> Train Here </h3>
            </div>

            <div className="camera_top">
                <div className="">
                    <button className = "btn btn-primary" onClick = {camerafn}> {showcam?`Stop`:`Start`} Camera</button>
                </div>

                <div>
                    <input className="select_img" name = 'image'type="file" accept="image/*" onChange= {imgChange} />
                </div>
            </div>

            {
                err !== '' ? 
                    <div className="message_section">
                        <h4> {err} </h4>
                        <button className = "btn btn-danger" onClick={()=> setErr('')}><ClearIcon /> </button>
                    </div>
                    : null
            }

            <center className = "camera_and_pic">
                <div className="verification" id= "verify" style = {{
                    marginTop:"5vh"
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
                                <button className = "btn btn-primary" onClick={capture} style={{margin:"1vh 0"}}>Capture photo</button>
                            </div>
                            : 
                            <PhotoCameraIcon style = {{fontSize : 350}} />
                        }
                    
                </div>
                
                <div className="img_field">
                    {
                    imgsrc === ""? 
                    <PhotoSizeSelectActualIcon style = {{fontSize:350,marginRight:"5vw"}} />
                        :
                        <>
                            <div className="img_field">
                                <img src={imgsrc} alt=".." srcset="" height= "365px" width= "400px"/>

                                <div className="btnss" style= {{marginTop:"5vh"}}>
                                    
                                    {
                                        loading ? 
                                        <div className="loading_loading" style = {{display:"flex", justifyContent:"center",alignItems:"center"}}>
                                            <Ellipsis color = "rgb(230, 43, 83)" size = {100} />
                                        </div>
                                        :
                                        <div className = "camButtons" >
                                            <button className = "btn btn-primary" 
                                            onClick = {trainFunc}
                                            disabled = {personName === ''}
                                            >Train</button>
                                            
                                            <button className = "btn btn-danger"  onClick = {()=> 
                                            {setImgsrc('') 
                                            setErr('')}}
                                            >Clear</button>
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                           
                        </>
                    }
                </div>
            </center>

            <div className="formArea">
                    <input name = 'subevent' className = "formStyle" type="text"  
                    placeholder="Enter Person's Name.." autoComplete = 'off' 
                    onChange = {handleChange}
                    value = {personName}
                    />
                    {/* <button className = "btn btn-outline-secondary" 
                    onClick = {trainFunc}
                    disabled = {personName === ""}
                    > <AddIcon /> </button> */}
            </div>

        </div>

        </>
    )
}

export default Train;