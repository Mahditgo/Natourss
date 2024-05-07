const { log } = require('console');
const fs = require('fs');
const Tour = require('./../models/tourModel');
const { query } = require('express');
const { match } = require('assert');

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// )



exports.getAllTours = async (req, res) => {
   try {
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = Tour.find(JSON.parse(queryStr));

    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        console.log(sortBy);
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //fields
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        console.log(fields);
        query = query.select(fields)
    }else {
        query = query.select('-__v')
    }

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit)

    if(req.query.page) {
        const numTours = await Tour.countDocuments();
        if(skip >= numTours) throw new Error('This page is not exist')
    }
    const tours = await query;
    res.status(200).json({
        status : 'success',
        result : tours.length,
        data : {
            tours
        }
    })
   }catch(err)  {
    res.status(404).json({
        status : 'fail',
        message : err
    })
   }
}



exports.getTour = async(req, res) => {

   try {
    const tour = await Tour.findById(req.params.id);

    
    res.status(200).json({
        status : 'success',
        data : {
            tour
        }
    })
   }catch(err) {
    res.status(404).json({
        status : 'fail',
        message : err
    })
   }
}

exports.createTour = async(req, res) => {
    try{const newtour = await Tour.create(req.body)
        res.status(201).json({
            status : 'success',
            data : {
                tour : newtour
            }
        })}catch(err){
            res.status(404).json({
                status : 'fail',
                message : err
            })
           }
           
}

exports.updateToure = async(req, res) => {
  
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
           new : true,
           runValidator : true
        })

        res.status(200).json({
            status : 'success',
            data : {
                tour
            }
        })

    }catch {
        res.status(404).json({
            status : 'fail',
            message : 'err'
        })
    }
    

}

exports.deleteToure = async(req, res) => {
    try{ await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status : 'success',
            data : null
        })}catch(err) {
            res.status(404).json({
                status : 'fail',
                message : 'err'
            })
        }
   
}