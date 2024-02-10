const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const {Sequelize, DataTypes} = require("sequelize");
const dotenv = require('dotenv/config');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER_NAME,
    process.env.USER_PASSWORD,
    {
        host: process.env.USER_HOST,
        dialect: process.env.DIALECT,
        define: {
            timestamps: false
        }
    }
);

// Authenticate with DB
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});


const Station = sequelize.define("station", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    sname: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    tableName: 'station',
    timestamps: false
});


const Capacity = sequelize.define("capacity", {
    capacity_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    available: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    booked: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    capacity_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},

{
    tableName: 'capacity',
    timestamps: false
});


const Train = sequelize.define("train", {
    train_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    tname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    arrival_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    departure_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
},

{
    tableName: 'train',
    timestamps: false
});

Train.belongsTo(Capacity, { foreignKey: 'capacity_id', targetKey: 'capacity_id' });


const Passenger = sequelize.define("passenger", {
    p_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ph_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},
{
    tableName: 'passenger',
    timestamps: false
});


const Ticket = sequelize.define("ticket", {
    ticket_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    passenger_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    seat_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    train_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalPrice:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},

{
    tableName: 'ticket',
    timestamps: false
});

Ticket.belongsTo(Passenger, { foreignKey: 'passenger_id', targetKey: 'p_id' });
Ticket.belongsTo(Train, { foreignKey: 'train_id', targetKey: 'train_id' });


const Login = sequelize.define("login", {
    login_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    p_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
},

{
    tableName: 'login',
    timestamps: false
});

Login.belongsTo(Passenger, { foreignKey: 'p_id', targetKey: 'p_id' });


// Home
app.get('/', (req, res) => {
    sequelize.sync().then(() => {
        console.log('Trainer table created successfully!');
    }).catch((error) => {
    console.error('Unable to create table : ', error);
    });
    res.redirect('/login');
    // res.status(200).send('Hello World')
});


app.get('/login', async (req, res)=>{
    res.render('login');
});


// Login User
app.post('/login', async (req, res)=>{
    // console.log("req.body");
    // console.log(req.body);

    sequelize.sync().then(() => {
  
        Passenger.findOne({
            where: {
                username : req.body.username
            }
        }).then(async (user) => {
        console.log("user");
        console.log(user);
        console.log("user.dataValues");
        console.log(user.dataValues);
  
        if(user && user.dataValues.password === req.body.password){
  
          await Login.create({
            p_id: user.dataValues.p_id,
            start_time: new Date(),
            // start_time: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' }),
        
          });
        
          res.redirect('/home');
        }
        else{
          res.send('<h1>Incorrect username or password<h1>');
  
        }
      }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
      });
  
    }).catch((error) => {
      console.error('Unable to create table : ', error);
    });
    
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    sequelize.sync().then(async () => {
        
        await Passenger.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            ph_no: req.body.ph_no,
            dob: req.body.dob,
    
        });
    
        res.redirect('/login');
  
    }).catch((error) => {
        console.error('Unable to create user : ', error);
    });
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/stations', (req, res) => {

    sequelize.sync().then(() => {
  
        Station.findAll()
        .then(async (stations) => {
            console.log("stations");
            console.log(stations);
            console.log("stations[0].dataValues");
            console.log(stations[0].dataValues);
    
            res.render('search_trains', {stations: stations});
            
        }).catch((error) => {
            console.error('Failed to retrieve data from stations table\n Error : ', error);
        });
  
    }).catch((error) => {
      console.error('Unable to sync with database \nError : ', error);
    });
    
    
});

app.post('/trains', (req, res) => {
    console.log(req.body);

    sequelize.sync().then(() => {

        Train.findAll()
        .then(async (trains) => {
            console.log("trains");
            console.log(trains);
            console.log("trains[0].dataValues");
            console.log(trains[0].dataValues);
    
            res.render('train_display', {trains: trains, places: req.body});
            
        }).catch((error) => {
            console.error('Failed to retrieve data from trains table\n Error : ', error);
        });
  
    }).catch((error) => {
        console.error('Unable to sync with database \nError : ', error);
    });
});

app.post('/payment', (req, res) => {
    console.log("req.body");
    console.log(req.body);
    
    let tickets = 1;
    // let totalPrice = {totalPrice: req.body.price * tickets};

    const details = {
        ...req.body,
        ...{tickets: tickets},
    }

    console.log("details");
    console.log(details);
    
    res.render('payment', {details: details});
});

app.get('/display', async (req, res) => {
    let trainList = [], ticketsList;
    
    sequelize.sync().then(async () => {
        await Ticket.findAll({
            where: {
                passenger_id : 1
            }
        })
        .then(async (tickets) => {
            console.log("tickets");
            console.log(tickets);
            ticketsList = tickets;
            
            
            const trainPromises = tickets.map(async (ticket) => {
                const train = await Train.findOne({
                    where: {
                        train_id : ticket.train_id
                    }
                });
                return train;
            });
    
            const trainList = await Promise.all(trainPromises);

            console.log("trainList");
            console.log(trainList);
            
            res.render('ticket_details', {ticket: ticketsList, train: trainList});
            
        })
        .catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    })
    .catch((error) => {
        console.error('Unable to coonnect : ', error);
    });
    
});

app.post('/display', (req, res) => {
    console.log('req.body');
    console.log(req.body);
    
    const details = JSON.parse(req.body.details);
    console.log('req.body.details');
    console.log(details);

    const seats = 1;
    let capacity;

    sequelize.sync().then(async () => {

        await Capacity.findOne({
            where: {
              capacity_id : details.tid
            }
        })
        .then(async (cap) => {
            capacity = cap;
            console.log("capacity");
            console.log(capacity);
        
            if(capacity.dataValues.available > 0){
                const obj = {
                    available: capacity.dataValues.available - seats,
                    booked: capacity.dataValues.booked + seats,
                }

                await Capacity.update(
                    obj, 
                    {
                        where: {
                          capacity_id: capacity.dataValues.capacity_id
                        }
                    }
                ).then(() => {
                    console.log("Successfully updated Capacity.")
            
                }).catch((error) => {
                    console.error('Failed to update Capacity : ', error);
                });
            }
            else{
                res.send('<h1>No seats Left<h1>');
            }
        })
        .catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
        
        console.log("details.tid")
        console.log(details.tid)
        console.log("capacity");
        console.log(capacity);

        let now = new Date();

        // Get the current time components
        let hours = now.getHours().toString().padStart(2, '0'); // Get hours and pad with leading zero if necessary
        let minutes = now.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if necessary
        let seconds = now.getSeconds().toString().padStart(2, '0'); // Get seconds and pad with leading zero if necessary

        // Format the time as HH:MM:SS
        let currentTime = `${hours}:${minutes}:${seconds}`;

        
        
        let train;
        await Train.findOne({
            where: {
              train_id : details.tid
            }
        })
        .then(async (tr) => {
            train = tr;
            console.log("train");
            console.log(train);
        
            
        })
        .catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
        
        
        await Ticket.create({
            passenger_id: 1, //
            time: currentTime,
            date: now,
            seat_no: capacity.dataValues.booked + 1, //
            train_id: details.tid,
            from: details.from,
            to: details.to,
            totalPrice: details.tickets * train.dataValues.price,
        });
    
        res.redirect('/display');
  
    }).catch((error) => {
        console.error('Unable to create user : ', error);
    });
})

app.get('/bus', (req, res) => {
    res.redirect('https://www.redbus.in/');
});


app.listen(PORT, () => {
    console.log('Server is running on port 3000.');
});