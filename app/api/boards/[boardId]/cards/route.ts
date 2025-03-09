import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { createNewCard } from "@/lib/models";

// POST /api/boards/[boardId]/cards - Add a new card to a board
export async function POST(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, position } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the board and verify ownership
    const board = await db.collection("boards").findOne({
      id: params.boardId,
      userId: session.user.email,
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    // Create a new card
    const newCard = createNewCard(title, content, position);

    // Add the card to the board
    await db.collection("boards").updateOne(
      { id: params.boardId },
      {
        $push: { cards: newCard },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
