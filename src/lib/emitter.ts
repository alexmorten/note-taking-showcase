import randomIdentifier from "../utils/randomIdentifier";

interface Subscription<ChangeType> {
  id: string;
  handler: (chnange: ChangeType) => void;
}

export default class Emitter<ChangeType> {
  private subscribedHandlers: Subscription<ChangeType>[];
  constructor() {
    this.subscribedHandlers = [];
  }

  /**
   * subscribe with the given handler. The handler is called each time emitChange is called, until the handler is unsubscribe()'d
   */
  public subscribe(handler: (change: ChangeType) => void): string {
    const id = randomIdentifier();
    const wrappedHandler: Subscription<ChangeType> = { id, handler };
    this.subscribedHandlers.push(wrappedHandler);
    return id;
  }

  // unsubscribe the handler that is identified by id
  public unsubscribe(id: string) {
    this.subscribedHandlers = this.subscribedHandlers.filter(
      subscription => subscription.id !== id
    );
  }

  // emitChange calls all subscribed handlers with change
  public emitChange(change: ChangeType) {
    this.subscribedHandlers.forEach(subscription =>
      subscription.handler(change)
    );
  }
}
