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
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},
{
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
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},

{
    timestamps: false
});

Ticket.belongsTo(Passenger, { foreignKey: 'passenger_id', targetKey: 'p_id' });


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
    res.redirect('/loginsignup');
    // res.status(200).send('Hello World')
});

app.listen(PORT, () => {
    console.log('Server is running on port 3000.');
});