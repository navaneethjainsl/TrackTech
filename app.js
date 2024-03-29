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

const Capacities = sequelize.define("capacities", {
    capacity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booked_1A: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    booked_2A: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    booked_3A: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    booked_ac: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    booked_sleeper: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    capacity_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
},

{
    tableName: 'capacities',
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
        type: DataTypes.TIME,
        allowNull: false,
    },
    departure_time: {
        type: DataTypes.TIME,
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
    },
    num_seats:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    class:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Sleeper',
    },
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
                    const capacity = await Capacities.findOne({
                        where: {
                            capacity_id : train.capacity_id
                        }
                    });
                    return capacity;
                });

                const capacity = await Promise.all(capacityPromises);
                console.log("capacity");
                console.log(capacity);
                
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
        // let totalPrice = {totalPrice: Number(req.body.price) * Number(tickets)};
    
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

app.get('/displayTicket', async (req, res) => {

    if(req.isAuthenticated()){
        let ticket;
        
        sequelize.sync().then(async () => {
            await Ticket.findOne({
                where: {
                    passenger_id : req.user.p_id,
                },
                order: [['ticket_id', 'DESC']],
            })
            .then(async (tick) => {
                console.log("tickets");
                console.log(tick);
                ticket = tick;
                
                
                const train = await Train.findOne({
                    where: {
                        train_id : ticket.train_id
                    }
                });
                // const trainPromises = tickets.map(async (ticket) => {
                //     return train;
                // });
        
                // const train = await Promise.all(trainPromises);
    
                console.log("train");
                console.log(train);
                
                res.render('ticket_details', {ticket: [ticket], train: [train]});
                
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

app.post('/display', (req, res) => {

    if(req.isAuthenticated()){
        console.log('req.body');
        console.log(req.body);
        
        const details = JSON.parse(req.body.details);
        console.log('req.body.details');
        console.log(details);
    
        const seats = Number(details.seats);
        let capacity, seatNo, tclass;
    
        sequelize.sync().then(async () => {
    
            await Capacities.findOne({
                where: {
                  capacity_id : details.tid
                }
            })
            .then(async (cap) => {
                capacity = cap;
                console.log("capacity");
                console.log(capacity);

                let obj;
                console.log("details.class")
                console.log(details.class)
                console.log("Number(details.class)")
                console.log(Number(details.class))
                switch(Number(details.class)){
                    case 5:
                        obj = {
                            booked_1A: Number(capacity.dataValues.booked_1A) + seats,
                        };
                        seatNo = Number(capacity.dataValues.booked_1A) + 1;
                        tclass = "1A"; 
                        console.log(5);
                        break;
                        
                    case 4:
                        obj = {
                            booked_2A: Number(capacity.dataValues.booked_2A) + seats,
                        };
                        seatNo = Number(capacity.dataValues.booked_2A) + 1;
                        tclass = "2A";
                        console.log(4);
                        break;
                    case 3:
                        obj = {
                            booked_3A: Number(capacity.dataValues.booked_3A) + seats,
                        };
                        seatNo = Number(capacity.dataValues.booked_3A) + 1;
                        tclass = "3A"; 
                        console.log(3);
                        break;
                        
                    case 2:
                        obj = {
                            booked_ac: Number(capacity.dataValues.booked_ac) + seats,
                        };
                        seatNo = Number(capacity.dataValues.booked_ac) + 1;
                        tclass = "AC"; 
                        console.log(2);
                        break;
                                
                    case 1:
                        obj = {
                            booked_sleeper: Number(capacity.dataValues.booked_sleeper) + seats,
                        };
                        seatNo = Number(capacity.dataValues.booked_sleeper) + 1;
                        tclass = "Sleeper"; 
                        console.log(1);
                        break;
                }
                

                await Capacities.update(
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
            })
            .catch((error) => {
                console.error('Failed to retrieve data : ', error);
            });
            
            console.log("details.tid")
            console.log(details.tid)
            console.log("capacity");
            console.log(capacity);
            console.log("tclass");
            console.log(tclass);
    
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
                passenger_id: req.user.p_id,
                time: currentTime,
                date: now,
                seat_no: seatNo,
                train_id: details.tid,
                from: details.from,
                to: details.to,
                totalPrice: Number(details.tickets) * Number(train.dataValues.price) * Number(details.class),
                num_seats: details.tickets,
                class: tclass,
            });
        
            res.redirect('/displayTicket');
      
        })
        .catch((error) => {
            console.error('Unable to create user : ', error);
        });
        
    }
    else{
        res.redirect('/login');
    }
    
    
});

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
        
        res.render('train', {train: req.body, action: 'updatetrain'});
    }
    else{
        res.redirect('/login');
    }
});

app.post('/updatetrain', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        sequelize.sync().then(async () => {
            console.log(req.body);

            obj = {
                train_id: req.body.train_id,
                tname: req.body.tname,
                capacity_id: req.body.capacity_id,
                arrival_time: req.body.arrival_time,
                departure_time: req.body.departure_time,
                price: req.body.price,
            }

            await Train.update(
                obj, 
                {
                    where: {
                        train_id: req.body.train_id
                    }
                }
            ).then(() => {
                console.log("Successfully updated Train.")
        
            }).catch((error) => {
                console.error('Failed to update Train : ', error);
            });
            

            res.redirect('/admintrains');
      
        }).catch((error) => {
          console.error('Unable to sync with database \nError : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.get('/addtrain',async (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){

        sequelize.sync().then(async() => {

            obj = {
                train_id: '',
                tname: '',
                capacity_id: 0,
                arrival_time: 0,
                departure_time: 0,
                price: 0,
            }

            res.render('train', {train: req.body, action: 'addtrain'});

        }).catch((error) => {
            console.error('Unable to connect : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.post('/addtrain',async (req, res) => {
    console.log(req.body);
    
    if(req.isAuthenticated() && req.user.access === 'admin'){

        sequelize.sync().then(async() => {

            obj = {
                tname: req.body.tname,
                capacity_id: req.body.capacity_id,
                arrival_time: req.body.arrival_time,
                departure_time: req.body.departure_time,
                price: req.body.price,
            }

            await Train.create(obj)

            res.redirect('/admintrains')

        }).catch((error) => {
            console.error('Unable to connect : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.post('/deletetrains',async (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){

        sequelize.sync().then(async() => {

            await Train.destroy({
                where: {
                    train_id: req.body.train_id,
                }
            }).then(() => {
                console.log("Successfully deleted record.")
            }).catch((error) => {
                console.error('Failed to delete record : ', error);
            });

            res.redirect('/admintrains')

        }).catch((error) => {
            console.error('Unable to connect : ', error);
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
        
        res.render('station', {station: req.body, action: 'updatestation'});
    }
    else{
        res.redirect('/login');
    }
});

app.post('/updatestation', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        sequelize.sync().then(async () => {

            obj = {
                id: req.body.id,
                sname: req.body.sname,
            }

            await Station.update(
                obj, 
                {
                    where: {
                        id: req.body.id
                    }
                }
            ).then(() => {
                console.log("Successfully updated Station.")
        
            }).catch((error) => {
                console.error('Failed to update Station : ', error);
            });

            res.redirect('/adminstations');
      
        }).catch((error) => {
          console.error('Unable to sync with database \nError : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.get('/addstation',async (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){

        sequelize.sync().then(async() => {

            obj = {
                
                id: req.body.id,
                sname: req.body.sname,
            }

            res.render('station', {station: req.body, action: 'addstation'});


        }).catch((error) => {
            console.error('Unable to connect : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.post('/addstation',async (req, res) => {
    console.log(req.body);
    
    if(req.isAuthenticated() && req.user.access === 'admin'){

        sequelize.sync().then(async() => {

            obj = {
                sname: req.body.sname,
            }

            await Station.create(obj)

            res.redirect('/adminstations')

        }).catch((error) => {
            console.error('Unable to connect : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.post('/deletestation',async (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        console.log('Delete adminstations');

        sequelize.sync().then(async() => {

            await Station.destroy({
                where: {
                    id: req.body.id,
                }
            }).then(() => {
                console.log("Successfully deleted record.")
            }).catch((error) => {
                console.error('Failed to delete record : ', error);
            });

            res.redirect('/adminstations');

        }).catch((error) => {
            console.error('Unable to connect : ', error);
        });
    }
    else{
        res.redirect('/login');
    }
});

app.get('/admincapacity', (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){
        sequelize.sync().then(async() => {
            
            await Capacities.findAll()
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

            obj = {
                capacity_id: req.body.capacity_id,
                booked_1A: req.body.booked_1A,
                booked_2A: req.body.booked_2A,
                booked_3A: req.body.booked_3A,
                booked_ac: req.body.booked_ac,
                booked_sleeper: req.body.booked_sleeper,
                capacity_total: req.body.capacity_total,
            }

            await Capacities.update(
                obj, 
                {
                    where: {
                        capacity_id: req.body.capacity_id
                    }
                }
            ).then(() => {
                console.log("Successfully updated Capacity")
        
            }).catch((error) => {
                console.error('Failed to update Capacity : ', error);
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

app.post('/deletecapacity',async (req, res) => {
    if(req.isAuthenticated() && req.user.access === 'admin'){

        sequelize.sync().then(async() => {

            await Capacities.destroy({
                where: {
                    capacity_id: req.body.capacity_id,
                }
            }).then(() => {
                console.log("Successfully deleted record.")
            }).catch((error) => {
                console.error('Failed to delete record : ', error);
            });

            res.redirect('/admincapacity')

        }).catch((error) => {
            console.error('Unable to connect : ', error);
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
                return cb('Incorrect username or password')
                
            }
            })
            .catch((error) => {
                console.error('Failed to retrieve data : ', error);
                return cb('username does not exist')
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