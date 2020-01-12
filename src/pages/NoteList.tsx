import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../providers/storeContext";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import randomIdentifier from "../utils/randomIdentifier";
import { useHistory } from "react-router-dom";
import NoteListItem from "../components/NoteListItem";

export default function NoteList(props: React.PropsWithChildren<{}>) {
  const store = useContext(StoreContext);
  const [notes, setNotes] = useState(store.currentState());
  const history = useHistory();
  const addNewNote = () => {
    const id = randomIdentifier();
    store.set({
      meta: {
        clientId: id,
        localDirty: true,
        remoteDirty: true
      },
      attributes: { text: "", title: "" }
    });

    history.push(`/notes/${id}`);
  };

  useEffect(() => {
    const subscriptionId = store.subscribe(
      () => setNotes(store.currentState()),
      () => true
    );

    return () => store.unsubscribe(subscriptionId);
  }, [store]);

  return (
    <div>
      <PageHeader>
        <h1>Your Notes</h1>
      </PageHeader>

      {Object.entries(notes).map(([id, note]) => (
        <NoteListItem key={id} attributes={note.attributes} noteId={id} />
      ))}

      {Object.keys(notes).length === 0 && (
        <>
          <h2>You don't have any notes yet</h2>
          <p>Would you like to add some?</p>
        </>
      )}

      <Button action onClick={addNewNote}>
        Add a new note
      </Button>
    </div>
  );
}
