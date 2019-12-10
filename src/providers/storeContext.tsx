import React, { createContext, useState, useEffect } from "react";
import { NoteAttributes } from "../models/note";
import Store from "../lib/store";
import LocalForageStore from "../lib/localForageStore";

const forageStore = new LocalForageStore<NoteAttributes>();
const store = new Store<NoteAttributes>(forageStore);

export const StoreContext = createContext(store);

export function StoreProvider(props: React.PropsWithChildren<{}>) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    store.waitUntilLoaded().then(() => setLoaded(true));
  }, []);

  return (
    <StoreContext.Provider value={store}>
      {loaded && props.children}
    </StoreContext.Provider>
  );
}
