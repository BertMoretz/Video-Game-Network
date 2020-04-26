const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST_IP,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
    console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});

app.get('/videogames', (req, res) => {
    pool.query(`select * from ${"videogame"}`, (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Something went wrong!"});
        } else {
            if (results.length > 0) {
                return res.send(results);
            } else return res.status(404).send({ error: 'No Games Found'});
        }
    });
});

app.get('/login', (req, res) => {
    const { login } = req.query;
    const { password } = req.query;

    pool.query(`select ${'username, age'} from ${'user'} WHERE ${'username'}='${login}' AND ${'password'}='${password}'`, (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Something went wrong!"});
        } else {
            if (results.length > 0) {
                return res.send(results[0]);
            } else return res.status(401).send({ error: 'No such user'});
        }
    });
});

app.get('/details', (req, res) => {
    const { gameId } = req.query;
    let result;
    let developers = [];

    pool.query(`select * from ${'videogame'} WHERE ${'id'}='${gameId}'`, (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Something went wrong!"});
        } else {
            if (results.length > 0) {
                result = results[0];
                pool.query(`select ${'id, name'} from ${'gameCompany'} WHERE ${'id'} in (
                            select ${'companyId'} from ${'developers'} WHERE ${'gameId'}='${gameId}')`, (err, results) => {
                    if (err) {
                        return res.status(500).send({ error: "Something went wrong!"});
                    } else {
                        developers = results;
                        return res.send({...result, developers: developers});
                    }
                });

            } else return res.status(404).send({ error: 'Game was not found!'});
        }
    });
});

app.get('/reviews', (req, res) => {
    const { gameId } = req.query;

    pool.query(`select ${'a.*, b.username, b.age'} from ${'review a, user b'} WHERE ${'a.gameId'}='${gameId}' AND ${'a.userId'}=${'b.username'}`, (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Something went wrong!"});
        } else {
            return res.send(results);
        }
    });
});

app.post('/publish-review', (req, res) => {
    const { gameId } = req.body;
    const { userId } = req.body;
    const { rating } = req.body;
    const { text } = req.body;
    const post = {
        gameId: gameId,
        userId: userId,
        rating: rating,
        text: text
    };

    pool.query(`insert into ${'review'} set ?`, post, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: "Something went wrong!"});
        } else {
            return res.send(results);
        }
    });
});

app.post('/update-review', (req, res) => {
    const { gameId } = req.body;
    const { userId } = req.body;
    const { rating } = req.body;
    const { text } = req.body;
    const post = {
        gameId: gameId,
        userId: userId,
        rating: rating,
        text: text
    };

    pool.query(`update ${'review'} set ${'rating'}='${rating}', ${'text'}='${text}' 
                    where ${'gameId'}='${gameId}' and ${'userId'}='${userId}'`, post, (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Something went wrong!"});
        } else {
            return res.send(results);
        }
    });
});
