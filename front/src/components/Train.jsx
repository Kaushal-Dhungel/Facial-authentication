import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import Webcam from "react-webcam";
import axios from 'axios';
import getCookie from './utils';
import { Default } from 'react-spinners-css';

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

        if(personName === '' || backendimg === null){
            setErr(" Name/Image missing")
            return
        }

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

            <div className="heading">
                <h3> Train Here </h3>
            </div>

            <div className="name_wrapper">
                <div className="name_of_person">
                    <input name = 'person_name' className = "form_input" type="text"  onChange= {handleChange} value = {personName}
                    placeholder="Name of the Person" autoComplete = 'off' />
                </div>
            </div>

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
                    margin:"5vh 0"
                    }}>

                        <button onClick = {camerafn}> {showcam?`Stop`:`Start`} Camera</button>

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

                        {/* <div className="select_img">
                            <h3 style = {{color:"white"}}> Or </h3>
                            <input name = 'image' className = "form_input" type="file" accept="image/*" onChange= {imgChange} />
                        </div> */}
                    
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
                                        <Default color = "rgb(230, 43, 83)" size = {100} />
                                    </div>
                                    :
                                    <div className = "camButtons" >
                                        <button onClick = {trainFunc}>Train</button>
                                        <button onClick = {()=> 
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

            <div className="select_img">
                <input name = 'image' className = "form_input" type="file" accept="image/*" onChange= {imgChange} />
            </div>

        </div>

        </>
    )
}

export default Train;