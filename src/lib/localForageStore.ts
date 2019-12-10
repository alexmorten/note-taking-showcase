import { Datum } from "./store";
import localforage from "localforage";

export default class LocalForageStore<AttributesType> {
  constructor() {
    localforage.setDriver([localforage.INDEXEDDB, localforage.WEBSQL]);
  }

  public async set(item: Datum<AttributesType>): Promise<void> {
    await localforage.setItem(item.meta.clientId, item);
  }

  public async list(): Promise<Datum<AttributesType>[]> {
    const items: Datum<AttributesType>[] = [];
    await localforage.iterate(item => {
      items.push(item as Datum<AttributesType>);
    });

    return items;
  }

  public async delete(id: string): Promise<void> {
    await localforage.removeItem(id);
  }
}
