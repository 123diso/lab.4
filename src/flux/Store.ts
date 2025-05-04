import { AppDispatcher, Action } from './Dispatcher';

export type Character = {
  name: string;
  image: string;
  votes: number;
  voted?: boolean;
};

export type State = {
  fights: [Character, Character][];
};

function loadStateFromStorage(): State | null {
  const saved = localStorage.getItem('fights-state');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

const defaultState: State = {
  fights: Array.from({ length: 8 }, (_, i) => [
    { name: `Peleador ${i * 2 + 1}`, image: 'https://via.placeholder.com/100', votes: 0 },
    { name: `Peleador ${i * 2 + 2}`, image: 'https://via.placeholder.com/100', votes: 0 },
  ]),
};

const initialState: State = loadStateFromStorage() || defaultState;


type Listener = (state: State) => void;

class Store {
  private state: State = initialState;
  private listeners: Listener[] = [];

  constructor() {
    AppDispatcher.register(this.handleActions.bind(this));
  }

  getState() {
    return this.state;
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  private emitChange() {
    localStorage.setItem('fights-state', JSON.stringify(this.state));
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
  

  private handleActions(action: Action) {
    switch (action.type) {
      case 'VOTE': {
        const { fightIndex, characterIndex } = action.payload as { fightIndex: number; characterIndex: number };
        const fights = [...this.state.fights];
        const fight = [...fights[fightIndex]];
      
        const currentVotedIndex = fight.findIndex(c => c.voted);
      

        if (currentVotedIndex === characterIndex) break;
      

        if (currentVotedIndex !== -1) {
          fight[currentVotedIndex] = {
            ...fight[currentVotedIndex],
            votes: Math.max(0, fight[currentVotedIndex].votes - 1),
            voted: false,
          };
        }
      

        fight[characterIndex] = {
          ...fight[characterIndex],
          votes: fight[characterIndex].votes + 1,
          voted: true,
        };
      
        fights[fightIndex] = fight as [Character, Character];
        this.state = { fights };
        this.emitChange();
        break;
      }
      
    }
  }
}

export const store = new Store();
