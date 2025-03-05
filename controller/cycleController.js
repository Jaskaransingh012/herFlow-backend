const Cycle = require('../models/cycleModel');
const {generateCyclePredictions} = require('../config/openAi');

const calculateCycleLength = (startDate, endDate) => {
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(0, 0, 0, 0);
    const diffTime = end.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 3600 * 24)) + 1;
};


const createCycle = async (req, res) => {
    try {
      const { userId, cycleStartDate, cycleEndDate, ...rest } = req.body;
  
      // Validation
      if (!userId || !cycleStartDate || !cycleEndDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: userId, cycleStartDate, cycleEndDate' 
        });
      }
  
      const startDate = new Date(cycleStartDate);
      const endDate = new Date(cycleEndDate);
      
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid date format' 
        });
      }
      if (endDate < startDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'cycleEndDate must be after cycleStartDate' 
        });
      }
  
      // Generate AI predictions
      const predictionData = {
        cycleStartDate,
        cycleEndDate,
        lutealPhaseLength: rest.lutealPhaseLength || 14,
        symptoms: rest.symptoms || [],
        lifestyleFactors: rest.lifestyleFactors || {}
      };
      console.log("first");
      const predictions = await generateCyclePredictions(predictionData);
      console.log(predictions);
  
      // Create cycle
      const newCycle = new Cycle({
        userId,
        cycleStartDate: startDate,
        cycleEndDate: endDate,
        cycleLength: calculateCycleLength(startDate, endDate),
        ...rest,
        predictions: predictions || {}
      });
  
      await newCycle.save();
      
      res.status(201).json({ 
        success: true, 
        message: 'Cycle created successfully', 
        data: newCycle 
      });
  
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error creating cycle',
        error: error.message 
      });
    }
  };

const getCycleById = async (req, res) => {
    try {
        const cycle = await Cycle.findById(req.params.cycleId).populate('userId', 'username email');
        if (!cycle) return res.status(404).json({ message: 'Cycle not found' });
        res.json(cycle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCyclesByUserId = async (req, res) => {
    try {
        const cycles = await Cycle.find({ userId: req.params.userId }).sort({ cycleStartDate: -1 });
        res.json(cycles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCycle = async (req, res) => {
    try {
      const { cycleId } = req.params;
      const updateData = { ...req.body };
      
      const cycle = await Cycle.findById(cycleId);
      if (!cycle) {
        return res.status(404).json({ 
          success: false, 
          message: 'Cycle not found' 
        });
      }
  
      // Date validation
      let newStartDate = cycle.cycleStartDate;
      let newEndDate = cycle.cycleEndDate;
  
      if (updateData.cycleStartDate) {
        newStartDate = new Date(updateData.cycleStartDate);
        if (isNaN(newStartDate)) {
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid cycleStartDate format' 
          });
        }
      }
  
      if (updateData.cycleEndDate) {
        newEndDate = new Date(updateData.cycleEndDate);
        if (isNaN(newEndDate)) {
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid cycleEndDate format' 
          });
        }
      }
  
      if (newEndDate < newStartDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'cycleEndDate must be after cycleStartDate' 
        });
      }
  
      // Recalculate cycle length if dates change
      if (updateData.cycleStartDate || updateData.cycleEndDate) {
        updateData.cycleLength = calculateCycleLength(newStartDate, newEndDate);
      }
  
      // Generate new predictions
      const predictionData = {
        cycleStartDate: updateData.cycleStartDate || cycle.cycleStartDate.toISOString(),
        cycleEndDate: updateData.cycleEndDate || cycle.cycleEndDate.toISOString(),
        lutealPhaseLength: updateData.lutealPhaseLength || cycle.lutealPhaseLength,
        symptoms: updateData.symptoms || cycle.symptoms,
        lifestyleFactors: updateData.lifestyleFactors || cycle.lifestyleFactors
      };
  
      const newPredictions = await generateCyclePredictions(predictionData);
      updateData.predictions = newPredictions || cycle.predictions;
  
      // Update cycle
      const updatedCycle = await Cycle.findByIdAndUpdate(
        cycleId,
        updateData,
        { new: true, runValidators: true }
      );
  
      res.json({ 
        success: true, 
        message: 'Cycle updated successfully', 
        data: updatedCycle 
      });
  
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error updating cycle',
        error: error.message 
      });
    }
};



const deleteCycle = async (req, res) => {
    try {
        const cycle = await Cycle.findByIdAndDelete(req.params.cycleId);
        if (!cycle) return res.status(404).json({ message: 'Cycle not found' });
        res.json({ message: 'Cycle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addSymptom = async (req, res) => {
    try {
        const { cycleId } = req.params;
        const symptomData = req.body;

        // Validate required symptom date
        if (!symptomData.date) {
            return res.status(400).json({ message: 'Date is required for symptom' });
        }

        const cycle = await Cycle.findById(cycleId);
        if (!cycle) return res.status(404).json({ message: 'Cycle not found' });

        cycle.symptoms.push(symptomData);
        await cycle.save();
        res.json(cycle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSymptom = async (req, res) => {
    try {
        const { cycleId, symptomId } = req.params;
        const updateData = req.body;

        const cycle = await Cycle.findById(cycleId);
        if (!cycle) return res.status(404).json({ message: 'Cycle not found' });

        const symptom = cycle.symptoms.id(symptomId);
        if (!symptom) return res.status(404).json({ message: 'Symptom not found' });

        Object.assign(symptom, updateData);
        await cycle.save();
        res.json(cycle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSymptom = async (req, res) => {
    try {
      const { cycleId, symptomId } = req.params;
  
      const cycle = await Cycle.findById(cycleId);
      if (!cycle) return res.status(404).json({ message: 'Cycle not found' });
  
      const symptom = cycle.symptoms.id(symptomId);
      if (!symptom) return res.status(404).json({ message: 'Symptom not found' });
  
      symptom.remove();
      await cycle.save();
      res.json(cycle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports = { createCycle, getCycleById, getCyclesByUserId, updateCycle, deleteCycle, addSymptom, updateSymptom, deleteSymptom };