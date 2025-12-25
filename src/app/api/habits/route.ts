import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("taskmaster");
    const habits = await db.collection("habits").find({}).toArray();
    return NextResponse.json(habits);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch habits" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("taskmaster");
    const collection = db.collection("habits");

    const { name, count, type } = await req.json();

    if (!name || !type) {
      return NextResponse.json(
        { message: "Missing name or type" },
        { status: 400 }
      );
    }

    const newHabit = {
      name,
      count,
      type,
      createdAt: new Date(),
      lastCompletedAt: null,
    };

    const result = await db.collection("habits").insertOne(newHabit);

    return NextResponse.json({
       habit: { ...newHabit, _id: result.insertedId } });
  } catch (error) {
    console.error("DB error: ", error);
    return NextResponse.json({ succes: false, error });
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("taskmaster");

    const { id, updates } = await req.json();

    if (!id || !updates) {
      return NextResponse.json(
        { message: "Missing id or updates" },
        { status: 400 }
      );
    }

    await db.collection("habits").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("taskmaster");

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { message: "Missing ids array" },
        { status: 400 }
      );
    }

    await db.collection("habits").deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}