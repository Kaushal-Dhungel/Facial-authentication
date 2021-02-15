import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import getCookie from './utils';

const Event = (props) => {

    const [items,setItems] = React.useState([])
    const [person,setPerson] = React.useState([])
    const [message,setMessage] = React.useState()
    const [loading,isLoading] = React.useState(false)
    const slug = props.match.params.id 

    React.useEffect(()=> {
        const fetchItems = async() => {
            await axios.get(`/main/subeventsview/${slug}/`)
            .then(res => {
                console.log(res.data)
                setItems(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }

        const fetchPerson = async() => {
            await axios.get(`/main/subeventsview/person/${slug}/`)
            .then(res => {
                console.log(res.data)
                setPerson(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }

        fetchItems();
        fetchPerson();
    },[])


    function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        const event = form.get("subevent")
        if (event === undefined|| event === ''){
            setMessage('Please Enter The Subevent Name')
            return
        }

        form.append('slug',slug)

        const csrftoken = getCookie('csrftoken');


        const axiosConfig = {
                headers: {
                    "X-CSRFToken": csrftoken
                }
              };
              
        axios.post(`/main/subeventsview/${slug}/`,form,axiosConfig)
    
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
            isLoading(false)
            setMessage('Some Error occured. Please Try Later')
        })

    }
    return (
        <>
        <div className="container top">

            <div className="heading">
                <h3> Add Subevent </h3>
            </div>

            {    
                message?        
                <div className="message_section">
                    <h4> {message} </h4>
                    <button className = "contact_button" onClick={()=> setMessage(null)}>Clear</button>
                </div>
                : null
            }
            
            <div className="form_wrapper">
                <form onSubmit={handleSubmit} className = "contact_form" action="#">
                    <input name = 'subevent' className = "form_input" type="text"  placeholder="Add New Sub Event" autoComplete = 'off' />
                    <button className = "contact_button">Add</button>
                </form>
            </div>

        </div>

        <div className="heading">
                <h3> All Subevents </h3>
        </div>


        <div className=" container event_section">

        {       items === undefined ? null :
                items.length === 0? <h4 style = {{color:"white", margin:"5vh 0"}}> No Subevents Available </h4>:
                items.map((item,index)=> {
                    return(
                        <div key = {index} className="event_card">
                            <h4> {item.s_name} </h4>
                            <p> {`${new Date(item.created).getFullYear()}-${new Date(item.created).getMonth()}-${new Date(item.created).getDate()}`} </p>
                            <Link to = {`/subevent/${item.slug}`} className = "btn">Visit</Link>
                        </div>
                    )
                })
            }

        </div>

        <div className="heading">
                <h3> All People </h3>
        </div>

        <div className="container event_people">

        <center>
                <div className="event_card">
                    <h4> Add More People </h4>
                    <Link to = {`/train/${slug}`} className = "btn">Train</Link>
                </div>
        </center>

{           
            person.length === 0 ? <h4 style = {{color:"white", textAlign:"center" , margin:"6vh 0"}}> No Trained Person Available </h4>:
            <div className="people">
                <div className="col-lg-12">
    
                    <br/>
                    <div className="box-element">
                        <div className="cart-row">
                            <div style={{flex:'2'}}><strong>Img</strong></div>
                            <div style={{flex:'2'}}><strong>Name</strong></div>
                            <div style={{flex:'2'}}><strong>Date</strong></div>
                            <div style={{flex:'1'}}><strong>Edit</strong></div>
                        </div>

                            {
                                person.map((item,index)=> {
                                    return (
                                        <div key = {index} className="cart-row">
                                            <div style={{flex:'2'}}><img className="row-image" src={item.image} alt = ".."/></div>
                                            <div style={{flex:'2'}}><p> {item.p_name} </p></div>
                                            <div style={{flex:'2'}}>{`${new Date(item.created).getFullYear()}-${new Date(item.created).getMonth()}-${new Date(item.created).getDate()}`} </div>
                                            <div style={{flex:'1'}}><p>NA</p></div>
                                        </div>
                                    )
                                })
                            }

                    </div>
                </div>

            </div>
}
        </div>

        </>
    )
}

export default Event;