import React, { useContext, useState, useEffect, useCallback } from "react";
import { StoreContext } from "../providers/storeContext";
import NoteForm from "../components/NoteForm";
import { NoteAttributes } from "../models/note";
import { Link, useHistory } from "react-router-dom";
import Button from "../components/Button";

interface Props {
  noteId: string;
}

export default function NoteEdit({ noteId }: React.PropsWithChildren<Props>) {
  const store = useContext(StoreContext);
  const [note, setNote] = useState(store.currentState()[noteId]);
  const history = useHistory();

  useEffect(() => {
    // when the noteId changed - for whatever reason we want to use that note
    setNote(store.currentState()[noteId]);

    // subscribe to all further updates
    const subscriptionId = store.subscribe(
      () => setNote(store.currentState()[noteId]),
      change =>
        change.changeType === "set" && change.datum.meta.clientId === noteId
    );

    return () => store.unsubscribe(subscriptionId);
  }, [store, noteId]);

  const updateNote = useCallback(
    (attributes: NoteAttributes) => {
      const newNote = {
        attributes,
        meta: { ...note.meta }
      };

      store.set(newNote);
    },
    [store, note]
  );

  const onNoteDelete = useCallback(() => {
    store.delete(noteId);
    history.push("/");
  }, [store, noteId, history]);

  return (
    <div>
      <Link to="/">List</Link>
      <NoteForm value={note.attributes} onChange={updateNote} />
      <Button onClick={onNoteDelete} danger>
        Delete this note
      </Button>
    </div>
  );
}
