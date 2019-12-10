import React, { useContext, useState, useEffect, useCallback } from "react";
import { StoreContext } from "../providers/storeContext";
import NoteForm from "../components/NoteForm";
import { NoteAttributes } from "../models/note";
import { Link } from "react-router-dom";

interface Props {
  noteId: string;
}

export default function NoteEdit({ noteId }: React.PropsWithChildren<Props>) {
  const store = useContext(StoreContext);
  const [note, setNote] = useState(store.currentState()[noteId]);

  useEffect(() => {
    // when the noteId changed - for whatever reason we want to use that note
    setNote(store.currentState()[noteId]);

    // subscribe to all further updates
    const subscriptionId = store.subscribe(
      () => setNote(store.currentState()[noteId]),
      change => change.meta.clientId === noteId
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

  return (
    <div>
      <Link to="/">List</Link>
      <NoteForm value={note.attributes} onChange={updateNote} />
    </div>
  );
}
