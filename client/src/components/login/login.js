import React, {useState} from 'react';
import './login.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import auth from '../../services/auth';
import {Redirect, withRouter} from "react-router-dom";


function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    if (auth.isAuthenticated()) {
        return (
            <Redirect to={{
                pathname: "/",
            }} />
        )
    }

    function login() {
        if (username !== "" && password !== "") {
            axios.get("http://localhost:8000/login", {
                params: {
                    login: username,
                    password: password
                }
            }).then( resp => {
                setError(null);
                auth.login(JSON.stringify(resp.data));
                props.history.push("/");
            }).catch( err => {
                setError(err.response.data.error);
            })
        }
    }

    return(
        <div className={"login-container"}>
            <form onSubmit={(e) => {e.preventDefault()}}>
                <div className={"text-field"}>
                    <TextField
                        id="outlined-required"
                        label="Login"
                        fullWidth
                        variant="outlined"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className={"text-field"}>
                    <TextField
                        id="outlined-required"
                        label="Password"
                        fullWidth
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <div className={"text-field"}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        color="primary"
                        onClick={login}
                    >
                        Login
                    </Button>
                </div>
            </form>
            {error &&
                <div className={"error-container"}>
                    <span className={"error-text"}>{error}</span>
                </div>
            }

        </div>
    )
}

export default withRouter(Login);
