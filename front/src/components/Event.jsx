import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import getCookie from './utils';
import { Ellipsis } from 'react-spinners-css';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

const Event = (props) => {

    const [items,setItems] = React.useState([])
    const [person,setPerson] = React.useState([])
    const [message,setMessage] = React.useState(null)
    const [loading,isLoading] = React.useState(false)
    const [eventValue, setEventValue] = React.useState('');
    const [searchVal, setSearchVal] = React.useState([]);
    const [searchPerson, setSearchPerson] = React.useState([]);
    const slug = props.match.params.id 

    React.useEffect(()=> {
        const fetchItems = async() => {
            await axios.get(`/main/subeventsview/${slug}/`)
            .then(res => {
                console.log(res.data)
                setItems(res.data)
                setSearchVal(res.data)
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
                setSearchPerson(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }

        fetchItems();
        fetchPerson();
    },[])

    function handleEventChange (e) {
        e.preventDefault();
        setEventValue(e.target.value)
    }

    function handleAddEvent(e) {
        e.preventDefault();
        console.log("clicked")
        const form = new FormData();
        form.append('subevent',eventValue)
        form.append('slug',slug)

        isLoading(true);

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

            setSearchVal((prevvalue) => {
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

    function handleSearch(e) {
        e.preventDefault();
        const value = e.target.value;
        const action = e.target.dataset.action;

        if (action === "subeventlist") 
        {
            const newarr = items.filter((item) => {
                return item.s_name.toLowerCase().match(value.toLowerCase())
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

        else {
            const newarr2 = person.filter((item) => {
                return item.p_name.toLowerCase().match(value.toLowerCase())
                // return item.name.toLowerCase() === value.toLowerCase()
            })
                value === "" ? 
                    setSearchPerson(prevVal => {
                        return [...person]
                    })
                    :
                    setSearchPerson(prevVal => {
                        return [...newarr2]
                    })
        }
    }


    return (
        <div className="container">

            <div className="header">
                    <h3> All Subevents </h3>
            </div>

            <div className="search_and_sort">

                <div className="formArea">
                    <input name = 'subevent' className = "formStyle" type="text"  
                    placeholder="New SubEvent Name" autoComplete = 'off' 
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
                    data-action = "subeventlist"
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
                    </div>
                    : null
                }

            </div> 


            <div>
                {
                    searchVal === undefined ? null :
                        searchVal.length === 0? <h4 style = {{color:"white", textAlign:"center" , margin:"6vh 0"}}> No Subevent Available.. </h4>:
                            <div className="row">
                            {
                                searchVal.map((item,index)=> {
                                return(
                                    <div key = {index} className="col-12 col-sm-12 col-md-6 col-lg-4 mt-5 ">
                                        <div key = {index} className="event_card">
                                            <h4> {item.s_name} </h4>
                                            <p> {`${new Date(item.created).getFullYear()}-${new Date(item.created).getMonth()}-${new Date(item.created).getDate()}`} </p>
                                            <Link to = {`/subevent/${item.slug}`} className = "btn btn-danger">Visit <ArrowRightAltIcon /> </Link>
                                        </div>
                                    </div>
                                )
                                })
                            }
                            </div>
                }
            </div>

            <div className="header" style= {{marginTop :"25vh"}}>
                    <h3> All People </h3>
            </div>

            <div className="event_people">

                <div className="search_and_sort">
                    <div className="add_people">
                        <h3> Add New <ArrowRightAltIcon /> </h3>
                        <Link to = {`/train/${slug}`} className = "btn btn-danger">Train </Link>
                    </div>
                    
                    <form action="">
                        <input type="text" name="search" className="formStyle lb" 
                        placeholder="Search Name Here" autocomplete="off" required 
                        data-action = "peoplelist"
                        onChange = {handleSearch}
                        />
                    </form>
                </div>

                    {           
                    searchPerson.length === 0 ? <h4 style = {{color:"white", textAlign:"center" , margin:"6vh 0"}}> No Trained Person Available </h4>:
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
                                        searchPerson.map((item,index)=> {
                                            return (
                                                <div key = {index} className="cart-row">
                                                    <div style={{flex:'2'}}><img className="row-image" src={item.image} alt = ".."/></div>
                                                    <div style={{flex:'2'}}><p> {item.p_name} </p></div>
                                                    <div style={{flex:'2'}}>{`${new Date(item.created).getFullYear()}-${new Date(item.created).getMonth()}-${new Date(item.created).getDate()}`} </div>
                                                    <div style={{flex:'1'}}><p>Admin Only</p></div>
                                                </div>
                                            )
                                        })
                                    }

                            </div>
                        </div>

                    </div>
                    }
            </div>
        </div>
    )
}

export default Event;