import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './register.css';
import {withRouter} from 'react-router-dom';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button";
import auth from "../../services/auth";

function Register(props) {
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    function register() {
        if (username !== "" && password !== "" &&
            age > 0 && age <= 150 && email !== "") {
            const data = {
                username: username,
                password: password,
                age: age,
                email: email,
            };
            axios.post("http://localhost:8000/register", data
            ).then( resp => {
                setError(null);
                props.history.push("/login");
            }).catch( err => {
                setError(err.response.data.error);
            })
        }
    }

    return (
        <div className={"register-container"}>
            <form onSubmit={(e) => {e.preventDefault()}}>
                <div className={"text-field"}>
                    <TextField
                        id="outlined-required"
                        label="Username"
                        fullWidth
                        variant="outlined"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className={"text-field"}>
                    <TextField
                        id="outlined-required"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className={"text-field"}>
                    <TextField
                        id="outlined-required"
                        label="Age"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={age}
                        onChange={(event) => setAge(event.target.value)}
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
                        onClick={register}
                    >
                        Register
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

export default withRouter(Register);
