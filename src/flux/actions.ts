import { AppDispatcher } from './Dispatcher';

export const VotingActions = {
  vote: (fightIndex: number, characterIndex: number) => {
    AppDispatcher.dispatch({
      type: 'VOTE',
      payload: { fightIndex, characterIndex },
    });
  },
};
