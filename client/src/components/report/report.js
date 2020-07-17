import React, {useEffect, useState} from 'react';
import './report.css'
import {withRouter} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

function Report(props) {
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        getReport();
    },[limit]);

    function getReport() {
        axios.get('http://localhost:8000/report-generation', {
            params: {
                limit: limit
            }
        }).then((response) => {
            console.log(response.data);
            setData(response.data);
        }).catch(error => {
            console.warn(error);
        });
    }

    function awardWinnings() {
        let awardCounter = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].awards) {
                awardCounter++;
            }
        }
        return awardCounter/data.length*100;
    }

    function totalViews() {
        let views = 0;
        for (let i = 0; i < data.length; i++) {
                views+= data[i].popularity;
        }
        return views;
    }

    return (
        <div className={"report-container"}>
            <div>
                <Button color="primary" onClick={()=>setLimit(3)}>TOP 3 Games</Button>
                <Button color="primary" onClick={()=>setLimit(10)}>TOP 10 Games</Button>
                <Button color="primary" onClick={()=>setLimit(100)}>TOP 100 Games</Button>
            </div>
            <h2 style={{textAlign: "center"}}> TOP {limit} games</h2>
            {data.length > 0 ?
                <div className={"flexer"}>
                    <Grid container spacing={0}>
                        {data.map((game, index)=> (
                            <Grid key={index} container item spacing={0} xs={12}>
                                <div className={"game-block"}>
                                    <div className={"pop-block"}>
                                        <div className={
                                            `popularity-mark
                                            ${index === 0 ? "most-pop" :
                                            index === 1 ? "second-pop" :
                                            index === 2 ? "third-pop" :
                                            "other-pop"}`}>
                                            {game.popularity}
                                        </div>
                                        times users watched the game
                                    </div>
                                    <div className={"name-block"}>
                                        {game.name}<span className={"platforms"}>, {game.platform}</span>
                                    </div>
                                    <div className={"genre"}>
                                        <span className={"mini-header"}>Genre: </span> {game.genre}
                                    </div>
                                    <div className={"developers"}>
                                        <span className={"mini-header"}>Developed by:</span>
                                        {(game && typeof game.developers === 'string') ?
                                            game.developers :
                                            game.developers.map((company, index) => (
                                                <span key={index}>{company.name}{index !== game.developers.length-1 && ", "} </span>
                                            ))
                                        }

                                    </div>
                                    <div className={"developers"}>
                                        <span className={"mini-header"}>Awards:</span> {
                                            game.awards ? (typeof game.awards === 'string' ? game.awards :
                                                game.awards.map((award, index) => (
                                                    <span key={index}>{award.name}, {award.category}, {award.year} {index !== game.awards.length-1 && ", "} </span>
                                                ))
                                            ) : "–"
                                        }
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                    <div className={"stats"}>
                        <span className={"header"}>Statistics</span>
                        <div className={"stat-item"}>
                            Awards-Winning Games:
                            <div className={"stat-result"}>
                                {Math.round(awardWinnings())} %
                            </div>
                        </div>
                        <div className={"stat-item"}>
                            Total Views of Games:
                            <div className={"stat-result"}>
                                {totalViews()} views
                            </div>
                        </div>
                        <div className={"stat-item"}>
                            Top Developers:
                            <div className={"stat-result"}>
                                {(data[0] && typeof data[0].developers === 'string') ?
                                    data[0].developers :
                                    data[0].developers.map((company, index) => (
                                        <span key={index}>{company.name}{index !== data[0].developers.length-1 && ", "} </span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>:
                <CircularProgress />
            }
        </div>
    )
}

export default withRouter(Report);
