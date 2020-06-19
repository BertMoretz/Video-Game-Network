const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const app = express();

let db;
let flag = false;

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST_IP,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
};

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
const client = new MongoClient(url);

client.connect(function(err) {
    if (!err) {
        console.log("Connected successfully to server");
        db = client.db(MONGO_DB);
    }
});


app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
    console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});

app.get('/videogames', (req, res) => {
    if (!flag) {
        // TAKE FROM MYSQL
        pool.query(`select * from ${"videogame"}`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong!"});
            } else {
                if (results.length > 0) {
                    return res.send(results);
                } else return res.status(404).send({ error: 'No Games Found'});
            }
        });
    } else {
        //TAKE FROM MONGODB
        db.collection("videogame").find().toArray((e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});

            return res.send(resp);
        })
    }


});

app.get('/login', (req, res) => {
    const { login } = req.query;
    const { password } = req.query;

    if (!flag) {
        pool.query(`select ${'username, age'} from ${'user'} WHERE ${'username'}='${login}' AND ${'password'}='${password}'`, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Something went wrong!"});
            } else {
                if (results.length > 0) {
                    return res.send(results[0]);
                } else return res.status(401).send({ error: 'No such user'});
            }
        });
    } else {
        //TAKE FROM MONGODB
        db.collection("user").findOne(
            { username: login, password: password},
            { username: 1, age: 1 },
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong!"});

                return res.send(resp);
            }
        );
    }

});

app.get('/details', (req, res) => {
    const { gameId } = req.query;
    let result;
    let developers = [];

    if (!flag) {
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
    } else {
        //TAKE FROM MONGODB
        db.collection("videogame").findOne(
            {id: parseInt(gameId,10)},
            {},
            (e, resp) => {
                if (e) return res.status(500).send({ error: "Something went wrong!"});
                return res.send(resp);
            }
        );
    }

});

app.get('/reviews', (req, res) => {
    const { gameId } = req.query;

    if (!flag) {
        pool.query(`select ${'a.*, b.username, b.age'} from ${'review a, user b'} WHERE ${'a.gameId'}='${gameId}' AND ${'a.userId'}=${'b.username'}`, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Something went wrong!"});
            } else {
                return res.send(results);
            }
        });
    } else {
        //TAKE FROM MONGODB
        db.collection("review").find(
            {gameId: parseInt(gameId,10)}
        ).toArray((e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});
            if (resp) {
                return res.send(resp);
            } else {
                return res.send([]);
            }

        });
    }
});

app.post('/publish-review', (req, res) => {
    const { gameId } = req.body;
    const { userId } = req.body;
    const { rating } = req.body;
    const { text } = req.body;
    const post = {
        gameId: parseInt(gameId),
        userId: userId,
        rating: rating,
        text: text
    };

    if (!flag) {
        pool.query(`insert into ${'review'} set ?`, post, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong!"});
            } else {
                return res.send(results);
            }
        });
    } else {
        //TAKE FROM MONGODB
        db.collection("review").insertOne(post, (e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});
            return res.send(resp);
        });

    }

});

app.post('/update-review', (req, res) => {
    const { gameId } = req.body;
    const { userId } = req.body;
    const { rating } = req.body;
    const { text } = req.body;
    const post = {
        gameId: parseInt(gameId),
        userId: userId,
        rating: rating,
        text: text
    };

    if (!flag) {
        pool.query(`update ${'review'} set ${'rating'}='${rating}', ${'text'}='${text}' 
                    where ${'gameId'}='${gameId}' and ${'userId'}='${userId}'`, post, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Something went wrong!"});
            } else {
                return res.send(results);
            }
        });
    } else {
        //TAKE FROM MONGODB
        db.collection("review").updateOne({gameId: parseInt(gameId, 10), userId: userId}, {
            $set: {
                rating: post.rating,
                text: text
            }
        }, (e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});
            return res.send(resp);
        });

    }

});

app.post('/register', (req, res) => {
    const { username } = req.body;
    const { password } = req.body;
    const { age } = req.body;
    const { email } = req.body;
    const post = {
        username: username,
        password: password,
        age: age,
        email: email
    };

    if (!flag) {
        pool.query(`insert into ${'user'} set ?`, post, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ error: "User with this username already exists!"});
            } else {
                return res.send(results);
            }
        });
    } else {
        //TAKE FROM MONGODB
        db.collection("user").findOne(
            { username: username},
            (e, resp) => {
                if (resp) return res.status(403).send({ error: "User already exists"});
                db.collection("user").insertOne(post);
                return res.send(resp);
            }
        );
    }

});

app.post('/popularity-update', (req, res) => {
    const { id } = req.body;

    if (!flag) {
        pool.query(`update ${'videogame'} set ${'popularity'}=${'popularity'} + 1 where ${'id'}=${id}`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong!"});
            } else {
                return res.send(results);
            }
        });
    } else {
        //TAKE FROM MONGODB
        db.collection("videogame").updateOne({id: parseInt(id, 10)}, { $inc:{
            "popularity": 1
        }}, (e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});
            return res.send(resp);
        });
    }

});

app.get('/report-generation', (req, res) => {
    const { limit } = req.query;

    if (!flag) {
        pool.query(`select ${'v.*, GROUP_CONCAT(gc.name) as developers, GROUP_CONCAT(DISTINCT a.name, ", " ,a.category, ", " , a.year SEPARATOR ";") as awards'}  
                    from ${"videogame v"} 
                    inner join ${"developers d"} ON ${'v.id'}=${'d.gameId'}
                    left join ${"gameCompany gc"} on ${'gc.id'}=${'d.companyId'}
                    left join ${'award a'} on ${'v.id'}=${'a.gameId'} or ${'a.companyId'}=${'gc.id'}
                    group by ${'v.id'}
                    order by ${'v.popularity'} desc
                    limit ${limit}`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Something went wrong!"});
            } else {
                if (results.length > 0) {
                    return res.send(results);
                } else return res.status(404).send({ error: 'Report not generated!'});
            }
        });
    } else {
        //TAKE FROM MONGODB
        const cursor = db.collection("videogame").aggregate([
            {$sort: { popularity: -1 }},
            { $limit : parseInt(limit, 10) }
        ]);
        cursor.get((e, resp) => {
            if (e) return res.status(500).send({ error: "Something went wrong!"});
            return res.send(resp);
        });
    }
});

app.get('/migrate', (req, res) => {
    migrate();
    res.send('DONE!');
});

function migrate() {
    db.collection("user").drop().catch(e => console.log(e));
    db.collection("videogame").drop().catch(e => console.log(e));
    db.collection("gameCompany").drop().catch(e => console.log(e));
    db.collection("award").drop().catch(e => console.log(e));
    db.collection("review").drop().catch(e => console.log(e));

    pool.query(`select * from ${'user'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("user").insertMany(results);
    });

    pool.query(`select * from ${'videogame'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("videogame").insertMany(results);
    });

    pool.query(`select * from ${'gameCompany'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("gameCompany").insertMany(results);
    });

    pool.query(`select * from ${'review'}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        db.collection("review").insertMany(results);
    });

    setTimeout(() => {
        pool.query(`select * from ${'award'}`, (err, results) => {
            if (err) {
                console.log(err);
            }
            db.collection("award").insertMany(results);
            for (let i = 0; i < results.length; i++) {
                if (results[i].gameId) {
                    db.collection("videogame").findOne({"id": results[i].gameId}, (err, game) => {
                        db.collection("videogame").updateOne({_id: game._id}, { $push: {
                                "awards": results[i]
                            }});
                    });
                }
            }
        });
    },2000);

    setTimeout(migrateRelations,2000);
    flag = true;
}

function migrateRelations() {
    pool.query(`select * from ${'developers'}`, (err, results) => {
        if (err) {
            console.log(err);
        }

        for (let i = 0; i < results.length; i++) {
            db.collection("videogame").findOne({"id": results[i].gameId}, (err, game) => {
                db.collection("gameCompany").findOne({"id": results[i].companyId}, (error, company) => {
                    db.collection("videogame").updateOne({_id: game._id}, { $push: {
                        "developers": company
                    }});

                });
            });
        }

        for (let i = 0; i < results.length; i++) {
            db.collection("videogame").findOne({"id": results[i].gameId}, (err, game) => {
                db.collection("gameCompany").findOne({"id": results[i].companyId}, (error, company) => {
                    db.collection("gameCompany").updateOne({_id: company._id}, { $push:{
                            "games": game._id
                    }});
                });
            });
        }
    });


}


