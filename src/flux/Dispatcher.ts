export type Action = {
  type: string;
  payload?: any;
};

class Dispatcher {
  private listeners: ((action: Action) => void)[] = [];

  register(listener: (action: Action) => void) {
    this.listeners.push(listener);
  }

  dispatch(action: Action) {
    for (const listener of this.listeners) {
      listener(action);
    }
  }
}

export const AppDispatcher = new Dispatcher();
