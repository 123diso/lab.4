export interface Action {
    type: string;
    payload?: any;
}

export class Dispatcher {
    private _listeners: Array<(action: Action) => void> = [];

    register(callback: (action: Action) => void): void {
        this._listeners.push(callback);
    }

    dispatch(action: Action): void {
        this._listeners.forEach(listener => listener(action));
    }
}

export const AppDispatcher = new Dispatcher();