const mongoose = require('mongoose');

const pregnancySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pregnancyStartDate: { type: Date, required: true },
  pregnancyEndDate: { type: Date },
  symptoms: [
    {
      date: { type: Date, required: true },
      morningSickness: { type: String, enum: ['None', 'Mild', 'Moderate', 'Severe'] },
      fatigue: { type: String, enum: ['None', 'Mild', 'Moderate', 'Severe'] },
      moodSwings: { type: String, enum: ['None', 'Mild', 'Moderate', 'Severe'] },
      breastChanges: { type: String, enum: ['None', 'Mild', 'Moderate', 'Severe'] },
      foodCravings: { type: String, enum: ['None', 'Mild', 'Moderate', 'Severe'] },
      bodyTemperature: { type: Number },
      cervicalMucus: { type: String, enum: ['Dry', 'Sticky', 'Creamy', 'Egg White', 'Watery'] },
      ovulationTestResult: { type: String, enum: ['Positive', 'Negative', 'Not Taken'] },
      additionalNotes: { type: String }
    }
  ]
});

const Pregnancy = mongoose.model('Pregnancy', pregnancySchema);
module.exports = Pregnancy;
