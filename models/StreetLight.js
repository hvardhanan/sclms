// models/StreetLight.js
const mongoose = require('mongoose');

const StreetLightSchema = new mongoose.Schema({
  id: { type: String, required: true },
  dateOfFixing: { type: Date, required: true },
  intensity: { type: Number, required: true },
  workingCondition: { type: Boolean, required: true }
});

module.exports = mongoose.models.StreetLight || mongoose.model('StreetLight', StreetLightSchema);
