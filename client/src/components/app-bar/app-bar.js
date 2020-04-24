import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import "./app-bar.css";


export default function MyAppBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <div className={"title"}>
                    VideoGames Network
                </div>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}
