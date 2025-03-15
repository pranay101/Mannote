import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";

// GET /api/boards/[boardId] - Get a specific board
export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const board = await db.collection("boards").findOne({
      id: params.boardId,
      userId: session.user.email,
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error("Error fetching board:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/boards/[boardId] - Update a board
export async function PUT(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return await NextResponse.json(
        { error: "Unauthorized", boardId: params.boardId },
        { status: 401 }
      );
    }

    const { title, description, cards, edges } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (cards !== undefined) updateData.cards = cards;
    if (edges !== undefined) updateData.edges = edges;

    const result = await db
      .collection("boards")
      .updateOne(
        { id: params.boardId, userId: session.user.email },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const updatedBoard = await db.collection("boards").findOne({
      id: params.boardId,
      userId: session.user.email,
    });

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error("Error updating board:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/[boardId] - Delete a board
export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("boards").deleteOne({
      id: params.boardId,
      userId: session.user.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting board:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
