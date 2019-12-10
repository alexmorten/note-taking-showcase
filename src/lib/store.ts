import Emitter from "./emitter";
import debounce from "lodash/debounce";

export interface Meta {
  clientId: string;
  apiId?: string;
  localDirty: boolean;
  remoteDirty: boolean;
}

export interface Datum<AttributesType extends Object> {
  meta: Meta;
  attributes: AttributesType;
}

export type SetChange<AttributesType> = {
  changeType: "set";
  datum: Datum<AttributesType>;
};

export type DeleteChange = {
  changeType: "delete";
  clientId: string;
};

export type Change<AttributesType> = SetChange<AttributesType> | DeleteChange;

export interface PersistentStore<AttributesType> {
  set(item: Datum<AttributesType>): Promise<void>;
  list(): Promise<Datum<AttributesType>[]>;
  delete(id: string): Promise<void>;
}

class State<AttributesType> {
  public current: { [k: string]: Datum<AttributesType> };
  private changed: Change<AttributesType>[];
  constructor() {
    this.current = {};
    this.changed = [];
  }

  public set(item: Datum<AttributesType>) {
    item.meta.localDirty = true;
    item.meta.remoteDirty = true;

    this.current = {
      ...this.current,
      [item.meta.clientId]: item
    };
    this.changed.push({ changeType: "set", datum: item });
  }

  public delete(id: string) {
    this.current = {
      ...this.current
    };

    delete this.current[id];
    this.changed.push({ changeType: "delete", clientId: id });
  }

  public flushChanged(): Change<AttributesType>[] {
    const changesSinceLastFlush = this.changed;
    this.changed = [];
    return changesSinceLastFlush;
  }
}

export default class Store<AttributesType extends Object> {
  private changeEmitter: Emitter<Change<AttributesType>[]>;
  private state: State<AttributesType>;

  private persistentStore: PersistentStore<AttributesType>;
  private localUpdateQueue: Change<AttributesType>[];

  private localStateLoaded: boolean;

  constructor(persitentStore: PersistentStore<AttributesType>) {
    this.changeEmitter = new Emitter();
    this.state = new State();
    this.persistentStore = persitentStore;
    this.localStateLoaded = false;
    this.localUpdateQueue = [];
    this.loadLocalState();
  }

  public subscribe(
    handler: (changes: Change<AttributesType>[]) => void,
    filter: (changed: Change<AttributesType>) => boolean
  ): string {
    const subscriptionId = this.changeEmitter.subscribe(allChanges => {
      const filteredChanges = allChanges.filter(filter);
      if (filteredChanges.length > 0) {
        handler(filteredChanges);
      }
    });

    return subscriptionId;
  }

  public unsubscribe(id: string) {
    this.changeEmitter.unsubscribe(id);
  }

  public async waitUntilLoaded() {
    if (this.localStateLoaded) {
      return;
    }
    await new Promise(resolve => {
      const subscriptionId = this.changeEmitter.subscribe(() => {
        if (this.localStateLoaded) {
          this.changeEmitter.unsubscribe(subscriptionId);
          resolve();
        }
      });
    });
  }

  public currentState() {
    return this.state.current;
  }

  public set(item: Datum<AttributesType>) {
    this.state.set(item);

    this.emitLocalChanges();
  }

  public delete(id: string) {
    this.state.delete(id);

    this.emitLocalChanges();
  }

  private emitLocalChanges() {
    const changes = this.state.flushChanged();
    this.changeEmitter.emitChange(changes);

    this.localUpdateQueue = this.localUpdateQueue.concat(changes);
    this.debouncedSaveToPersistentStore();
  }

  private async saveToPersistentStore() {
    const datumsToUpdate = this.localUpdateQueue.reduce((acc, change) => {
      if (change.changeType === "set") {
        const currentDatum = this.state.current[change.datum.meta.clientId];
        if (currentDatum !== undefined) {
          acc[change.datum.meta.clientId] = currentDatum;
        }
      }
      return acc;
    }, {} as { [k: string]: Datum<AttributesType> });

    const idsToDelete = this.localUpdateQueue.reduce((acc, change) => {
      if (change.changeType === "delete") {
        acc[change.clientId] = true;
      }
      return acc;
    }, {} as { [k: string]: boolean });

    this.localUpdateQueue = [];

    await Promise.all(
      Object.entries(datumsToUpdate)
        .map(([id, item]) => this.persistentStore.set(item))
        .concat(
          Object.keys(idsToDelete).map(id => this.persistentStore.delete(id))
        )
    );
  }

  private debouncedSaveToPersistentStore = debounce(
    this.saveToPersistentStore,
    1000
  );

  private async loadLocalState() {
    const items = await this.persistentStore.list();

    items.forEach(item => {
      this.state.set(item);
    });

    this.localStateLoaded = true;

    this.changeEmitter.emitChange(this.state.flushChanged());
  }
}
