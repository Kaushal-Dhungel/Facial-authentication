import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const Attendence = (props) => {

    const [person,setPerson] = React.useState([]);
    const [searchVal, setSearchVal] = React.useState([]);
    const slug = props.match.params.id 

    React.useEffect(()=> {
        const fetchPerson = async() => {
            await axios.get(`/main/authenticatedview/${slug}/`)
            .then(res => {
                console.log(res.data)
                setPerson(res.data)
                setSearchVal(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }

        fetchPerson();
    },[])

    function handleSearch(e) {
        e.preventDefault();
        const value = e.target.value;
        
        const newarr = person.filter((item) => {
            return item.get_name.toLowerCase().match(value.toLowerCase())
            // return item.name.toLowerCase() === value.toLowerCase()
        })
            value === "" ? 
                setSearchVal(prevVal => {
                    return [...person]
                })
            :
                setSearchVal(prevVal => {
                    return [...newarr]
                })
    }

    return (
        <div className = "container">

        <div className="search_and_sort" style = {{marginTop:"10vh"}}>
            <div className="attendence">
                <Link to = {`/subevent/${slug}`} className = "btn btn-danger"> <ArrowBackIcon /> Go back </Link>
            </div>

            <form action="">
                    <input type="text" name="search" className="formStyle lb" 
                    placeholder="Search Name Here" autocomplete="off" required 
                    data-action = "subeventlist"
                    onChange = {handleSearch}
                    />
                </form>
        </div>

        <div className="people" style = {{minHeight:"80vh"}}>
                <div className="col-lg-12">
    
                    <br/>
                    {
                    searchVal.length === 0 ? 
                        <div className="header">
                            <h3> No items to display.. </h3>
                        </div>
                        :
                        <div className="box-element">
                                <div className="cart-row">
                                    <div style={{flex:'2'}}><strong>Img</strong></div>
                                    <div style={{flex:'2'}}><strong>Name</strong></div>
                                    <div style={{flex:'2'}}><strong>Date</strong></div>
                                    <div style={{flex:'1'}}><strong>Edit</strong></div>
                                </div>

                                {
                                    searchVal.map((item,index) => {
                                        return(
                                            <div key = {index} className="cart-row">
                                                <div style={{flex:'2'}}><img className="row-image" src={item.get_img} alt = ".."/></div>
                                                <div style={{flex:'2'}}><p> {item.get_name}</p></div>
                                                <div style={{flex:'2'}}> {`${new Date(item.created).getFullYear()}-${new Date(item.created).getMonth()}-${new Date(item.created).getDate()}`} </div>
                                                <div style={{flex:'1'}}><p> N/A </p></div>
                                            </div>
                                        )
                                    })
                                }
                        

                        </div>
                    }
                </div>

            </div>
        </div>
    )
}

export default Attendence;