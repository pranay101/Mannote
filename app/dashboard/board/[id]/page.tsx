import React from "react";
import BoardClient from "./client";

// This is a server component that will handle the params
export default function BoardPage({ params }: { params: { id: string } }) {
  // In future versions of Next.js, params will be a Promise
  // and will need to be unwrapped with React.use()
  // For now, we can pass the id directly
  return <BoardClient boardId={params.id} />;
}
