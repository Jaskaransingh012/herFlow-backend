const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  cycleStartDate: { type: Date, required: true },
  cycleEndDate: { type: Date, required: true },
  cycleLength: { type: Number }, // Auto-calculated based on start & end dates
  lutealPhaseLength: { type: Number, default: 14 }, // Can be user-input or predicted
  symptoms: [
    {
      date: { type: Date, required: true },
      flowIntensity: { type: String, enum: ['Light', 'Medium', 'Heavy', 'Spotting'] },
      cramps: { type: String, enum: ['None', 'Mild', 'Moderate', 'Severe'] },
      mood: { type: String, enum: ['Happy', 'Irritable', 'Sad', 'Anxious', 'Neutral'] },
      bodyTemperature: { type: Number }, // In °C or °F
      cervicalMucus: { type: String, enum: ['Dry', 'Sticky', 'Creamy', 'Egg White', 'Watery'] },
      ovulationTestResult: { type: String, enum: ['Positive', 'Negative', 'Not Taken'] },
      additionalNotes: { type: String }
    }
  ],
  lifestyleFactors: {
    sleepHours: { type: Number }, // Average sleep duration
    stressLevel: { type: String, enum: ['Low', 'Moderate', 'High'] },
    exerciseRoutine: { type: String, enum: ['Sedentary', 'Light', 'Moderate', 'Intense'] }
  },
  predictions: {
    nextCycleStart: { type: Date }, // Predicted start date of the next cycle
    nextOvulationDate: { type: Date }, // Predicted ovulation date
    fertileWindow: [{ type: Date }], // Array of 5 dates indicating the fertile period
    nextPeriodDate: { type: Date }, // Predicted start date of the next period
    nextCyclePhases: [{
      date: { type: Date, required: true }, // Date of the phase
      phase: { type: String, required: true } // Phase name (e.g., "Menstruation", "Ovulation")
    }],
    sleepRecommendations: { type: String }, // Sleep duration range (e.g., "7-9 hours")
    lifestyleChangeRecommendations: { type: String } // Short lifestyle tips (1-2 sentences)
  },
  createdAt: { type: Date, default: Date.now } // Timestamp of when the record was created
});

const Cycle = mongoose.model('Cycle', CycleSchema);
module.exports = Cycle;
