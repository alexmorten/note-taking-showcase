import React from "react";
import { NoteAttributes } from "../models/note";
import { Link } from "react-router-dom";
import "./NoteListItem.css";
import MarkdownEditor from "rich-markdown-editor";

interface Props {
  attributes: NoteAttributes;
  noteId: string;
}

export default function NoteListItem({
  attributes,
  noteId
}: React.PropsWithChildren<Props>) {
  const previewText = firstNLines(10, attributes.text);
  return (
    <div className="NoteListItem">
      <Link className="inherit-color" to={`/notes/${noteId}`}>
        <h3>{attributes.title || "<No Title Yet>"}</h3>
      </Link>
      <MarkdownEditor defaultValue={previewText} readOnly dark />
    </div>
  );
}

function firstNLines(n: number, text: string): string {
  return text
    .split("\n", n + 1)
    .slice(0, n)
    .join("\n");
}
