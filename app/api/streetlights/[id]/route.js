import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { StreetLight } from '../../../../models/StreetLight';

async function connectToDatabase() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const result = await StreetLight.deleteOne({ id });

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: 'Street light deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Street light not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting street light', error: error.message }, { status: 500 });
  }
}