// app/api/streetlights/route.js
import { NextResponse } from 'next/server';
import StreetLight from '../../../models/StreetLight';
import mongoose from 'mongoose';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location') || '';

  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  const filter = location ? { location } : {};  // Filter by location if provided

  const streetlights = await StreetLight.find(filter);  // Query the database
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