const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const helmet = require('helmet');
const compression = require('compression');

const userRoutes = require('./routes/user');


const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Page not Found')
    error.statusCode = 404
    next(error)
});

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    res.status(status).json({ 
        message: error.message, 
        data: error.data,
    });
});

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.gvbrv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  
mongoose.connect(DB_URI)
.then(result => {
    app.listen(process.env.PORT || 8000);
})
.catch(err => console.log(err));