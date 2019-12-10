import Emitter from "./emitter";
import debounce from "lodash/debounce";

export interface Meta {
  clientId: string;
  apiId: string | undefined;
  localDirty: boolean;
  remoteDirty: boolean;
}

export interface Datum<AttributesType extends Object> {
  meta: Meta;
  attributes: AttributesType;
}

export interface PersistentStore<AttributesType> {
  set(item: Datum<AttributesType>): Promise<void>;
  list(): Promise<Datum<AttributesType>[]>;
  delete(id: string): Promise<void>;
}

class State<AttributesType> {
  public current: { [k: string]: Datum<AttributesType> };
  private changed: Datum<AttributesType>[];
  constructor() {
    this.current = {};
    this.changed = [];
  }

  public set(item: Datum<AttributesType>) {
    this.current[item.meta.clientId] = item;
    item.meta.localDirty = true;
    item.meta.remoteDirty = true;
    this.changed.push(item);
  }

  public flushChanged(): Datum<AttributesType>[] {
    const changesSinceLastFlush = this.changed;
    this.changed = [];
    return changesSinceLastFlush;
  }
}

export default class Store<AttributesType extends Object> {
  private changeEmitter: Emitter<Datum<AttributesType>[]>;
  private state: State<AttributesType>;
  private persistentStore: PersistentStore<AttributesType>;

  private localStateLoaded: boolean;

  constructor(persitentStore: PersistentStore<AttributesType>) {
    this.changeEmitter = new Emitter();
    this.state = new State();
    this.persistentStore = persitentStore;
    this.localStateLoaded = false;

    this.loadLocalState();
  }

  public subscribe(
    handler: (changes: Datum<AttributesType>[]) => void,
    filter: (changed: Datum<AttributesType>) => boolean
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
          resolve();
          this.changeEmitter.unsubscribe(subscriptionId);
        }
      });
    });
  }

  public currentState() {
    return this.state.current;
  }

  public set(item: Datum<AttributesType>) {
    this.state.set(item);

    this.changeEmitter.emitChange(this.state.flushChanged());

    this.debouncedSaveToPersistentStore();
  }

  private async saveToPersistentStore() {
    const dirtyItems = Object.entries(this.state.current)
      .map(([key, item]) => item)
      .filter(item => item.meta.localDirty);
    await Promise.all(dirtyItems.map(item => this.persistentStore.set(item)));
  }

  private debouncedSaveToPersistentStore = debounce(
    this.saveToPersistentStore,
    5000
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
