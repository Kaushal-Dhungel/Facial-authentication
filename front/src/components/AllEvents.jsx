import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import getCookie from './utils';
import { Default } from 'react-spinners-css';

const AllEvents = () => {

    const [items,setItems] = React.useState([])
    const [message,setMessage] = React.useState()
    const [loading,isLoading] = React.useState(false)

    React.useEffect(()=> {
        const fetchItems = async() => {
            await axios.get('/main/eventsview/')
            .then(res => {
                console.log(res.data)
                setItems(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }
        fetchItems();
    },[])


    function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        const event = form.get("event")
        
        if (event === undefined|| event === ''){
            setMessage('Please Enter The Event Name')
            return
        }

        isLoading(true)
        const csrftoken = getCookie('csrftoken');


        const axiosConfig = {
                headers: {
                    "X-CSRFToken": csrftoken
                }
              };
              
        axios.post('/main/eventsview/',form,axiosConfig)
    
        .then(res => {
            console.log(res.data)
            setItems((prevvalue) => {
                return(
                    [res.data,...prevvalue,]
                )
            })
            isLoading(false)
            setMessage('New Event Added')
        })
        .catch(err => {
            console.log(err);
            // console.log(err.response.data);
            isLoading(false)
            setMessage('Some Error occured. Please Try Later')
        })
    }
    return (
        <>
        <div className="container">
            <div className="top">

            <div className="heading">
                <h3> Add Event </h3>
            </div>
                {    
                message?        
                <div className="message_section">
                    <h4> {message} </h4>
                    <button className = "contact_button" onClick={()=> setMessage(null)}>Clear</button>
                </div>
                : null
                }

                {
                    loading?
                    <div className="loading_loading" style = {{display:"flex", justifyContent:"center",alignItems:"center"}}>
                        <Default color = "rgb(230, 43, 83)" size = {150} />
                    </div>:
                    <div className="form_wrapper">
                        <form onSubmit={handleSubmit} className = "contact_form" action="#">
                            <input name = 'event' className = "form_input" type="text"  placeholder="Event name" autoComplete = 'off' />
                            <button className = "contact_button">Add</button>
                        </form>
                    </div>
                }

            </div>

            <div className="heading">
                <h3> All Events </h3>
            </div>

        <div className="event_section">

            {   items === undefined ? null :
                items.length === 0? <h4 style = {{color:"white", margin:"5vh 0"}}> No Events Available </h4>:
                items.map((item,index)=> {
                    return(
                        <div key = {index} className="event_card">
                            <h4> {item.name} </h4>
                            <p> {`${new Date(item.created).getFullYear()}-${new Date(item.created).getMonth()}-${new Date(item.created).getDate()}`} </p>
                            <Link to = {`/event/${item.slug}`} className = "btn">Visit</Link>
                        </div>
                    )
                })
            }


        </div>

    </div>
    
        </>
    )
}

export default AllEvents;