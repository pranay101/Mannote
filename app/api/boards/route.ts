import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { createNewBoard } from "@/lib/models";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper function to check authentication
async function checkAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  return session.user;
}

// GET /api/boards - Get all boards for the current user
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const user = await checkAuth();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to access this resource" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const boards = await db
      .collection("boards")
      .find({ userId: user.email })
      .sort({ updatedAt: -1 })
      .toArray();

    // Set cache control headers to prevent caching
    const response = NextResponse.json(boards);
    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
  } catch (error) {
    console.error("Error fetching boards:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/boards - Create a new board
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await checkAuth();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to access this resource" },
        { status: 401 }
      );
    }

    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const newBoard = createNewBoard(title, user.email, description);

    await db.collection("boards").insertOne(newBoard);

    // Set cache control headers to prevent caching
    const response = NextResponse.json(newBoard, { status: 201 });
    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
  } catch (error) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
