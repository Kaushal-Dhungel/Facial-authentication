import React from 'react';
import {Link} from 'react-router-dom';
import img from "../imgs/face1.png";
import axios from 'axios';

const Attendence = (props) => {

    const [person,setPerson] = React.useState([]);
    const slug = props.match.params.id 

    React.useEffect(()=> {
        const fetchPerson = async() => {
            await axios.get(`/main/authenticatedview/${slug}/`)
            .then(res => {
                console.log(res.data)
                setPerson(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }

        fetchPerson();
    },[])

    return (
        <>
        <div className="container attendence">
            <Link to = {`/subevent/${slug}`} className = "btn">Go back</Link>
        </div>

        <div className="container people" style = {{minHeight:"80vh"}}>
                <div className="col-lg-12">
    
                    <br/>
                    {
                        person.length === 0 ? <h3> No items to display.. </h3>:
                    <div className="box-element">
                            <div className="cart-row">
                                <div style={{flex:'2'}}><strong>Img</strong></div>
                                <div style={{flex:'2'}}><strong>Name</strong></div>
                                <div style={{flex:'2'}}><strong>Date</strong></div>
                                <div style={{flex:'1'}}><strong>Edit</strong></div>
                            </div>

                            {
                                person.map((item,index) => {
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
        </>
    )
}

export default Attendence;