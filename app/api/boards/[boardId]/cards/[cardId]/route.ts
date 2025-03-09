import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";

// PUT /api/boards/[boardId]/cards/[cardId] - Update a card
export async function PUT(
  req: NextRequest,
  { params }: { params: { boardId: string; cardId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, position } = await req.json();

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

    // Check if the card exists
    const cardExists = board.cards?.some(
      (card: any) => card.id === params.cardId
    );

    if (!cardExists) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Update the card
    const updateData: any = {
      "cards.$.updatedAt": new Date(),
    };

    if (title !== undefined) updateData["cards.$.title"] = title;
    if (content !== undefined) updateData["cards.$.content"] = content;
    if (position !== undefined) updateData["cards.$.position"] = position;

    await db.collection("boards").updateOne(
      {
        id: params.boardId,
        "cards.id": params.cardId,
      },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    // Get the updated board
    const updatedBoard = await db.collection("boards").findOne({
      id: params.boardId,
      userId: session.user.email,
    });

    const updatedCard = updatedBoard.cards.find(
      (card: any) => card.id === params.cardId
    );

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/[boardId]/cards/[cardId] - Delete a card
export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string; cardId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Remove the card from the board
    await db.collection("boards").updateOne(
      { id: params.boardId },
      {
        $pull: { cards: { id: params.cardId } },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
