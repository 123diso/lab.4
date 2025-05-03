import { AppDispatcher, Action } from './Dispatcher';
import { VoteActionTypes } from './actions';

export type VoteState = {
    votes: { [dogId: string]: number };
    votedPairs: { [pairId: string]: boolean }
    
};

type Listener = (state: VoteState) => void;

class VoteStore {
    private _state: VoteState = {
        votes: {},
        votedPairs: {},
    };
    private _listeners: Listener[] = [];

    constructor() {
        AppDispatcher.register(this._handleActions.bind(this));
        this._loadState();
    }

    getState(): VoteState {
        return this._state;
    }

    private _handleActions(action: Action): void {
        switch (action.type) {
            case VoteActionTypes.VOTE_FOR_DOG:
                const dogId = action.payload;
                this._state = {
                    ...this._state,
                    votes: {
                        ...this._state.votes,
                        [dogId]: (this._state.votes[dogId] || 0) + 1,
                    },
                };
                this._emitChange();
                break;
            default:
                break;
        }
        this._saveState();
    }


    subscribe(listener: Listener): () => void {
        this._listeners.push(listener);
        listener(this.getState());
        

        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }

    private _emitChange(): void {
        this._listeners.forEach(listener => listener(this.getState()));
    }

    private _saveState(): void {
        localStorage.setItem('dogVotingState', JSON.stringify(this._state));
    }

    private _loadState(): void {
        const storedState = localStorage.getItem('dogVotingState');
        if (storedState) {
            this._state = JSON.parse(storedState);
            this._emitChange();
        }
    }
}

export const voteStore = new VoteStore();