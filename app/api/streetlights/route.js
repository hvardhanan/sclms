// app/api/streetlights/route.js
import { NextResponse } from 'next/server';
import StreetLight from '../../../models/StreetLight';
import mongoose from 'mongoose';

export async function GET() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  const streetlights = await StreetLight.find();
  return NextResponse.json(streetlights);
}

export async function POST(req) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  const newStreetLight = new StreetLight(await req.json());
  await newStreetLight.save();
  return NextResponse.json(newStreetLight, { status: 201 });
}
