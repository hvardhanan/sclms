// models/StreetLight.js
import mongoose from 'mongoose';

const StreetLightSchema = new mongoose.Schema({
  id: { type: String, required: true },
  dateOfFixing: { type: Date, required: true },
  intensity: { type: Number, required: true },
  workingCondition: { type: String, required: true },
  location: { type: String, required: true}
});

export const StreetLight = mongoose.models.StreetLight || mongoose.model('StreetLight', StreetLightSchema);
