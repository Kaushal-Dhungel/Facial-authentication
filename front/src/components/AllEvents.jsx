import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import getCookie from './utils';
import { Ellipsis } from 'react-spinners-css';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

const AllEvents = () => {

    const [items,setItems] = React.useState([])
    const [message,setMessage] = React.useState(null)
    const [loading,isLoading] = React.useState(false)
    const [eventValue, setEventValue] = React.useState('');
    const [searchVal, setSearchVal] = React.useState([]);

    React.useEffect(()=> {
        const fetchItems = async() => {
            await axios.get('/main/eventsview/')
            .then(res => {
                console.log(res.data)
                setItems(res.data)
                setSearchVal(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }
        fetchItems();
    },[])

    function handleEventChange (e) {
        e.preventDefault();
        setEventValue(e.target.value)
    }

    function handleAddEvent(e) {
        e.preventDefault();

        const form = new FormData();
        form.append('event',eventValue)

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

            setSearchVal((prevvalue) => {
                return(
                    [res.data,...prevvalue,]
                )
            })

            isLoading(false)
            setMessage('New Event Added')
        })
        .catch(err => {
            console.log(err);
            isLoading(false)
            setMessage('Some Error occured. Please Try Later')
        })
    }

    function handleSearch(e) {
        e.preventDefault();
        const value = e.target.value;
        
        const newarr = items.filter((item) => {
            return item.name.toLowerCase().match(value.toLowerCase())
            // return item.name.toLowerCase() === value.toLowerCase()
        })
            value === "" ? 
                setSearchVal(prevVal => {
                    return [...items]
                })
            :
                setSearchVal(prevVal => {
                    return [...newarr]
                })
    }

    return (
        <>
        <div className="container">

            <div className="header">
                <h3> All Events </h3>
            </div>

            <div className="search_and_sort">

                <div className="formArea">
                    <input name = 'event' className = "formStyle" type="text"  
                    placeholder="New Event Name" autoComplete = 'off' 
                    onChange = {handleEventChange}
                    value = {eventValue}
                    />
                    <button className = "btn btn-outline-secondary" 
                    onClick = {handleAddEvent}
                    disabled = {eventValue === ""}
                    > <AddIcon /> </button>
                </div>

                <form action="">
                    <input type="text" name="search" className="formStyle lb" 
                    placeholder="Search Name Here" autocomplete="off" required 
                    // value = {values.search}
                    onChange = {handleSearch}
                    />
                </form>
            </div>  

        
            <div className="top">
                {    
                message !== null?        
                <div className="message_section">
                    <h4> {message} </h4>
                    <button className = "btn btn-danger" onClick={()=> setMessage(null)}> <ClearIcon /> </button>
                </div>
                : null
                }
                {
                    loading?
                    <div className="loading_loading" style = {{display:"flex", justifyContent:"center",alignItems:"center"}}>
                        <Ellipsis color = "rgb(230, 43, 83)" size = {100} />
                    </div>:
                    null
                }

            </div>  

        <div>

            {   
            searchVal === undefined ? null
                :
                searchVal.length === 0 ? <h4 style = {{color:"white", textAlign:"center" , margin:"6vh 0"}}> No Event Available. </h4>
                :
                <div className="row">
                    {
                    searchVal.map((item,index)=> {
                        return(
                            <div key = {index} className="col-12 col-sm-12 col-md-6 col-lg-4 mt-5 ">
                                <div key = {index} className="event_card">
                                    <h4> {item.name} </h4>
                                    <p> {`${new Date(item.created).getFullYear()}-${new Date(item.created).getMonth()}-${new Date(item.created).getDate()}`} </p>
                                    <Link to = {`/event/${item.slug}`} className = "btn btn-danger">Visit <ArrowRightAltIcon /> </Link>
                                </div>
                            </div>
                        )
                    }) 
                    }          
                </div>
            }
        </div>

    </div>
    
        </>
    )
}

export default AllEvents;