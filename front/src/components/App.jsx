import React from 'react';
import { BrowserRouter,Route, Switch} from "react-router-dom";
import Home from './StartPage';
import Register from './Register';
import AllEvents from './AllEvents';
import Event from './Event';
import Attendence from './Attendence';
import SubEvent from './SubEvent';
import Train from './Train';
import LogOut from './Logout';


const Footer = () => {
    return (
        <div className = "footer" style = {{margin: "10vh 0"}}>
            <hr style ={{backgroundColor:'rgb(190, 184, 184)'}} />
            <h3 style = {{textAlign:"center",color: 'rgb(190, 184, 184)'}}>© 2021. All rights reserved</h3>
        </div>
    )
}

const App = () => {
    return (
        <>
        <BrowserRouter >
        <Switch>
            <Route exact path = '/' component = {Home}/>
            <Route exact path = '/register' component = {Register}/>
            <Route exact path = '/allevents' component = {AllEvents}/>
            <Route exact path = '/logout' component = {LogOut}/>
            <Route exact path = '/event/:id' component = {Event}/>
            <Route exact path = '/subevent/:id' component = {SubEvent}/>
            <Route exact path = '/train/:id' component = {Train}/>
            <Route exact path = '/attendence/:id' component = {Attendence}/>
        </Switch>
        </BrowserRouter>
        <Footer />
        </>
    )
}
export default App;