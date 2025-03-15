import React from "react";
import BoardClient from "./client";

// This is a server component that will handle the params
export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { id } = await params;
  return <BoardClient boardId={id} />;
}
