import React, {useEffect, useState} from 'react';
import axios from 'axios';
import "./home-page.css";
import Grid from "@material-ui/core/Grid";
import CircularProgress from '@material-ui/core/CircularProgress';

export default function HomePage() {
    const [games, setGames] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/videogames', {
        }).then((response) => {
            setGames(response.data);
        }).catch(error => {
            console.warn(error);
        });
    },[]);


    return (
        <div className={"page-container"}>
            {games ?
                <Grid container spacing={8}>
                    {games.map((game, index)=> (
                        <Grid key={index} container item spacing={3} xs={12} sm={6} md={3}>
                            <div className={"game-card"}
                                 style={{ backgroundImage: 'url(' + require(`../../assets/posters/${game.image}.jpg`) + ")", backgroundSize: 'cover'}}>
                                <div className={"game-info"}>
                                    {/* TODO: SHOW NAME, CATEGORY and black-background*/}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid> :
                <CircularProgress />
            }

        </div>
    )
}
