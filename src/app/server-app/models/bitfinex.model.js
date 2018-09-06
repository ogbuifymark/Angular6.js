
const mongoose = require('mongoose');

const BitfinexCandles = mongoose.Schema({
    timestamp: String,
    open: String,
    high: String,
    low: String,
    value: String,
    volume: String
});

module.exports = mongoose.model('BitfinexCandles', BitfinexCandles);