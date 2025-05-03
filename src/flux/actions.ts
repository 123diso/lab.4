import { AppDispatcher } from './Dispatcher';

export const VoteActionTypes = {
    VOTE_FOR_DOG: 'VOTE_FOR_DOG',
};

export const VoteActions = {
    voteForDog: (dogId: string) => {
        AppDispatcher.dispatch({
            type: VoteActionTypes.VOTE_FOR_DOG,
            payload: dogId,
        });
    },
};