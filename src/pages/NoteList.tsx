import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../providers/storeContext";
import Button from "../components/Button";
import randomIdentifier from "../utils/randomIdentifier";
import { Link, useHistory } from "react-router-dom";

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
      {Object.entries(notes).map(([id, note]) => (
        <Link to={`/notes/${id}`}>
          <h3 key={id}>{note.attributes.title}</h3>
        </Link>
      ))}

      <Button onClick={addNewNote}>Add a new note</Button>
    </div>
  );
}
