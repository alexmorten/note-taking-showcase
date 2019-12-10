import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../providers/storeContext";

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

  return (
    <div>
      <h1>{note.attributes.title}</h1>
      <p>{note.attributes.text}</p>
    </div>
  );
}
