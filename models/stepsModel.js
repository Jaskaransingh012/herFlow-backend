const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    stepCount: { type: Number, required: true },
})

const Step = mongoose.model('Step', stepSchema);
module.exports = Step;