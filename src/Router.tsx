import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NoteList from "./pages/NoteList";
import NoteEdit from "./pages/NoteEdit";

export default function Router(props: React.PropsWithChildren<{}>) {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path={"/notes/:noteId"}
          render={({ match }) => {
            const noteId = match.params.noteId;
            return <NoteEdit noteId={noteId} />;
          }}
        />
        <Route path="/">
          <NoteList />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
