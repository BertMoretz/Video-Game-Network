import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import "./app-bar.css";
import {withRouter} from "react-router-dom";
import auth from "../../services/auth";


function MyAppBar(props) {

    function logOut() {
        auth.logout();
        props.history.push('/login');
    }

    return (
        <AppBar position="static" color={"default"}>
            <Toolbar>
                <div className={"title"}>
                    VideoGames Network
                </div>
                {auth.isAuthenticated() ?
                    <Button color="inherit" onClick={logOut}>Log Out</Button> :
                    <Button color="inherit" onClick={() => props.history.push('/login')}>Log In</Button>
                }
            </Toolbar>
        </AppBar>
    )
}

export default withRouter(MyAppBar);
