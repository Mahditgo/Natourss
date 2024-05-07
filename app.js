const fs = require('fs')
const express = require('express');
const morgan = require('morgan');
const exp = require('constants');
const tourRouter = require('./routs/tourRouter');
const userRouter = require('./routs/userRouter'); 
const { log } = require('console');

// middle ware
const app = express();
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev')) 

}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))
// app.get('/', (req,res) => {
//     res.status(200).json({message : 'hello from server side'})
// })





// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', creatTour);
// app.patch('/api/v1/tours/:id', updateToure);
// app.delete('/api/v1/tours/:id', deleteToure);



app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// server

module.exports = app;