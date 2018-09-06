const express = require('express');
const app = express();
const BitfinexRoutes = express.Router();

// Require AdUnit model in our routes module
let BitfinexCandles = require('../models/bitfinex.model');

// Defined store route
BitfinexRoutes.route('/add').post(function (req, res) {
  let bitfinexCandles = new BitfinexCandles({
    timestamp:  req.body.timestamp,
    // open: req.body.open,
    // high: req.body.high,
    // low: req.body.low,
    value: req.body.value,
    // volume: req.body.volume
  });
  console.log(req.body)
  bitfinexCandles.save()
    .then(game  => {
        console.log('hey');
     res.status(200).json({'BitfinexCandles': 'BitfinexCandles in added successfully'});
    })
    .catch(err => {
     res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
BitfinexRoutes.route('/').get(function (req, res) {
    BitfinexCandles.find(function (err, bitfinexCandles){
    if(err){
        err
      console.log(err);
    }
    else {
      res.json(bitfinexCandles);
    }
  });
});

// Defined edit route
BitfinexRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  BitfinexCandles.findById(id, function (err, bitfinexCandles){
      res.json(bitfinexCandles);
  });
});

// //  Defined update route
// BitfinexRoutes.route('/update/:id').post(function (req, res) {
//     BitfinexCandles.findById(req.params.id, function(err, bitfinexCandles) {
//     if (!bitfinexCandles)
//       return next(new Error('Could not load Document'));
//     else {
//         bitfinexCandles. = req.body.unit_name;
//         bitfinexCandles.unit_price = req.body.unit_price;

//         bitfinexCandles.save().then(bitfinexCandles => {
//           res.json('Update complete');
//       })
//       .catch(err => {
//             res.status(400).send("unable to update the database");
//       });
//     }
//   });
// });

// Defined delete | remove | destroy route
BitfinexRoutes.route('/delete').get(function (req, res) {
    BitfinexCandles.remove( function(err, bitfinexCandles){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = BitfinexRoutes;