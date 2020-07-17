import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import "./app-bar.css";
import {withRouter} from "react-router-dom";
import auth from "../../services/auth";
import axios from "axios";


function MyAppBar(props) {

    function logOut() {
        auth.logout();
        props.history.push('/login');
    }

    function migrate() {
        axios.get('http://localhost:8000/migrate', {
        }).then((response) => {
            console.log(response.data);
        }).catch(error => {
            console.warn(error);
        });
    }

    return (
        <AppBar position="static" color={"default"}>
            <Toolbar>
                <div className={"title"}>
                    VideoGames Network
                </div>
                <Button color="inherit" onClick={migrate}>MIGRATE TO MONGO</Button>
                <Button color="inherit" onClick={() => props.history.push('/')}>Home</Button>
                {auth.isAuthenticated() && <Button color="inherit" onClick={() => props.history.push('/report')}>Popularity Report</Button>}
                {auth.isAuthenticated() ?
                    <Button color="inherit" onClick={logOut}>Log Out</Button> :
                    <Button color="inherit" onClick={() => props.history.push('/login')}>Log In</Button>
                }
                {!auth.isAuthenticated() && <Button color="inherit" onClick={() => props.history.push('/register')}>Create Account</Button>}
            </Toolbar>
        </AppBar>
    )
}

export default withRouter(MyAppBar);
