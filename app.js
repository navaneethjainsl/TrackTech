const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const {Sequelize, DataTypes} = require("sequelize");
const dotenv = require('dotenv/config');
const session = require('express-session');
const passport = require('passport');
const {Strategy} = require('passport-local');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
    session({
        secret: "TOPSECRETWORD",
        resave: false,
        saveUninitialised: true,
    })
)

app.use(passport.initialize());
app.use(passport.session());

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
    access: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user' // Specify the default value here
    }
},
{
    tableName: 'passenger',
    timestamps: false
});


// const Admin = sequelize.define("admin", {
//     a_id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     ph_no: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     dob: {
//         type: DataTypes.DATE,
//         allowNull: true,
//     },
// },
// {
//     tableName: 'admin',
//     timestamps: false
// });


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
app.post('/login', passport.authenticate("local", {
    successRedirect: '/home',
    failureRedirect: '/login'
}));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    sequelize.sync().then(async () => {
        let details = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            ph_no: req.body.ph_no,
            dob: req.body.dob,
            
        };
        
        await Passenger.create(details);
        
        // details = {
        //     ...details,
        //     ...{expiry: now.getTime() + expirationTime * 1000}
        // }
        // localStorage.setItem("Credentials", JSON.stringify(details));

        res.redirect('/login');
  
    }).catch((error) => {
        console.error('Unable to create user : ', error);
        console.log('-------------------------------------------- ');
        res.redirect('/signup');
    });
});

app.get('/home', (req, res) => {
    console.log("req.user");
    console.log(req.user);
    
    if(req.isAuthenticated()){
        res.render('home', {options: [["Book Ticket", "stations"], ["View Ticket", "display"], ["Check Nearby Bus", "bus"]]});
    }
    else{
        res.redirect('/login');
    }
});

app.get('/stations', (req, res) => {

    if(req.isAuthenticated()){
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
    }
    else{
        res.redirect('/login');
    }
 
});

app.post('/trains', (req, res) => {

    if(req.isAuthenticated()){
        
        console.log(req.body);
    
        let capacity;
        sequelize.sync().then(async() => {
            
            await Train.findAll()
            .then(async (trains) => {
                console.log("trains");
                console.log(trains);
                console.log("trains[0].dataValues");
                console.log(trains[0].dataValues);

                const capacityPromises = trains.map(async (train) => {
                    const capacity = await Capacity.findOne({
                        where: {
                            capacity_id : train.capacity_id
                        }
                    });
                    return capacity;
                });

                const capacity = await Promise.all(capacityPromises);
                console.log("capacity");
                console.log(capacity);
        
                // await Capacity.findAll()
                // .then(async (cap) => {
                //     capacity = cap;
                //     console.log("capacity");
                //     console.log(capacity);
                
                // })
                // .catch((error) => {
                //     console.error('Failed to retrieve data : ', error);
                // });
                
                res.render('train_display', {trains: trains, places: req.body, capacity: capacity});
                
            }).catch((error) => {
                console.error('Failed to retrieve data from trains table\n Error : ', error);
            });
      
        }).catch((error) => {
            console.error('Unable to sync with database \nError : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
    
});

app.post('/payment', (req, res) => {

    if(req.isAuthenticated()){
        console.log("req.body");
        console.log(req.body);

        console.log("req.body.seats");
        console.log(req.body.seats);
        
        let tickets = req.body.seats;
        // let totalPrice = {totalPrice: req.body.price * tickets};
    
        const details = {
            ...req.body,
            ...{tickets: tickets},
        }
    
        console.log("details");
        console.log(details);
        
        res.render('payment', {details: details});
        
    }
    else{
        res.redirect('/login');
    }
    
});

app.get('/display', async (req, res) => {

    if(req.isAuthenticated()){
        let ticketsList;
        
        sequelize.sync().then(async () => {
            await Ticket.findAll({
                where: {
                    passenger_id : req.user.p_id,
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
        
    }
    else{
        res.redirect('/login');
    }
    
    
});

// app.get('/displayTicket', async (req, res) => {

//     if(req.isAuthenticated()){
//         let ticketsList;
        
//         sequelize.sync().then(async () => {
//             await Ticket.findAll({
//                 where: {
//                     passenger_id : req.user.p_id,
//                 }
//             })
//             .then(async (tickets) => {
//                 console.log("tickets");
//                 console.log(tickets);
//                 ticketsList = tickets;
                
                
//                 const trainPromises = tickets.map(async (ticket) => {
//                     const train = await Train.findOne({
//                         where: {
//                             train_id : ticket.train_id
//                         }
//                     });
//                     return train;
//                 });
        
//                 const trainList = await Promise.all(trainPromises);
    
//                 console.log("trainList");
//                 console.log(trainList);
                
//                 res.render('ticket_details', {ticket: [ticketsList[ticketsList - 1]], train: [trainList[ticketsList - 1]]});
                
//             })
//             .catch((error) => {
//                 console.error('Failed to retrieve data : ', error);
//             });
//         })
//         .catch((error) => {
//             console.error('Unable to coonnect : ', error);
//         });
        
//     }
//     else{
//         res.redirect('/login');
//     }
    
    
// });

app.post('/display', (req, res) => {

    if(req.isAuthenticated()){
        console.log('req.body');
        console.log(req.body);
        
        const details = JSON.parse(req.body.details);
        console.log('req.body.details');
        console.log(details);
    
        const seats = Number(details.seats);
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
                passenger_id: req.user.p_id, //
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
        
    }
    else{
        res.redirect('/login');
    }
    
    
})

app.get('/bus', (req, res) => {
    if(req.isAuthenticated()){
        res.redirect('https://www.redbus.in/');
    }
    else{
        res.redirect('/login');
    }
    
});

app.get('/adminHome', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        res.render('home', {options: [["Trains", "admintrains"], ["Stations", "adminstations"], ["Capacity", "admincapacity"]]});
    }
    else{
        res.redirect('/login');
    }
});

app.get('/admintrains', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        sequelize.sync().then(async() => {
            
            await Train.findAll()
            .then(async (trains) => {
                console.log("trains");
                console.log(trains);
                console.log("trains[0].dataValues");
                console.log(trains[0].dataValues);
                
                res.render('admin_train', {trains: trains});
                
            }).catch((error) => {
                console.error('Failed to retrieve data from trains table\n Error : ', error);
            });
      
        }).catch((error) => {
            console.error('Unable to sync with database \nError : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.post('/admintrains', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        console.log("req.body");
        console.log(req.body);
        
        res.render('train', {train: req.body});
    }
    else{
        res.redirect('/login');
    }
});

app.post('/updatetrain', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        sequelize.sync().then(async () => {
      
            await Train.create({
                train_id: req.user.train_id,
                tname: req.user.tname,
                capacity_id: req.user.capacity_id,
                arrival_time: req.user.arrival_time,
                departure_time: req.user.departure_time,
                price: req.user.price,
            });

            res.redirect('/admintrain');
      
        }).catch((error) => {
          console.error('Unable to sync with database \nError : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.get('/adminstations', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        sequelize.sync().then(async() => {
            
            await Station.findAll()
            .then(async (stations) => {
                console.log("stations");
                console.log(stations);
                console.log("stations[0].dataValues");
                console.log(stations[0].dataValues);
                
                res.render('admin_station', {stations: stations});
                
            }).catch((error) => {
                console.error('Failed to retrieve data from stations table\n Error : ', error);
            });
      
        }).catch((error) => {
            console.error('Unable to sync with database \nError : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.post('/adminstations', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        console.log("req.body");
        console.log(req.body);
        
        res.render('station', {station: req.body});
    }
    else{
        res.redirect('/login');
    }
});

app.post('/updatestation', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        sequelize.sync().then(async () => {
      
            await Station.create({
                id: req.user.id,
                sname: req.user.sname,
            });

            res.redirect('/adminstation');
      
        }).catch((error) => {
          console.error('Unable to sync with database \nError : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.get('/admincapacity', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        sequelize.sync().then(async() => {
            
            await Capacity.findAll()
            .then(async (capacities) => {
                console.log("capacities");
                console.log(capacities);
                console.log("capacities[0].dataValues");
                console.log(capacities[0].dataValues);
                
                res.render('admin_capacity', {capacities: capacities});
                
            }).catch((error) => {
                console.error('Failed to retrieve data from capacities table\n Error : ', error);
            });
      
        }).catch((error) => {
            console.error('Unable to sync with database \nError : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.post('/admincapacity', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        console.log("req.body");
        console.log(req.body);
        
        res.render('capacity', {capacity: req.body});
    }
    else{
        res.redirect('/login');
    }
});

app.post('/updatecapacity', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        sequelize.sync().then(async () => {
      
            await Train.create({
                capacity_id: req.user.capacity_id,
                available: req.user.available,
                booked: req.user.booked,
                capacity_total: req.user.capacity_total,
            });

            res.redirect('/admincapacity');
      
        }).catch((error) => {
          console.error('Unable to sync with database \nError : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});


passport.use(new Strategy(
    async function(username, password, cb) {
        
        // console.log("req.body");
        // console.log(req.body);
        let expirationTime = 300; //5 minutes
        
        sequelize.sync().then(() => {
  
            Passenger.findOne({
                where: {
                    username : username
                }
            }).then(async (user) => {
            console.log("user");
            console.log(user);
            console.log("user.dataValues");
            console.log(user.dataValues);
      
            if(user && user.dataValues.password === password){
      
                await Login.create({
                    p_id: user.dataValues.p_id,
                    start_time: new Date(),
                    // start_time: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' }),
                
                });
    
                // user.dataValues = {
                //     ...details,
                //     ...{expiry: now.getTime() + expirationTime * 1000}
                // }
    
                // localStorage.setItem("Credentials", JSON.stringify(user.dataValues));
                
                // res.redirect('/home');

                return cb(null, user);
            }
            else{
                // res.send('<h1>Incorrect username or password<h1>');
                return cb('<h1>Incorrect username or password<h1>')
      
            }
            })
            .catch((error) => {
                console.error('Failed to retrieve data : ', error);
            });
      
        }).catch((error) => {
            console.error('Unable to create table : ', error);
        });
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});


app.listen(PORT, () => {
    console.log('Server is running on port 3000.');
});