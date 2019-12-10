import React from "react";
import { NoteAttributes } from "../models/note";
import { Link } from "react-router-dom";
import "./NoteListItem.css";
import Button from "./Button";

interface Props {
  attributes: NoteAttributes;
  noteId: string;
  onDelete(): void;
}

export default function NoteListItem({
  attributes,
  noteId,
  onDelete
}: React.PropsWithChildren<Props>) {
  return (
    <div className="NoteListItem">
      <Link to={`/notes/${noteId}`}>
        <h3>{attributes.title || "<No Title Yet>"}</h3>
      </Link>
      <div className="flexContainer">
        <Button onClick={onDelete} small danger>
          Delete this note
        </Button>
      </div>
    </div>
  );
}
