type VoteState = {
    [fightId: string]: {
      votes: { [characterId: string]: number }
    }
  };
  
  class VoteStore extends EventTarget {
    private state: VoteState = {};
  
    getState() {
      return this.state;
    }
  
    vote(fightId: string, characterId: string) {
      if (!this.state[fightId]) {
        this.state[fightId] = { votes: {} };
      }
      if (!this.state[fightId].votes[characterId]) {
        this.state[fightId].votes[characterId] = 0;
      }
      this.state[fightId].votes[characterId]++;
  
      this.dispatchEvent(new Event('change'));
    }
  }
  
  export const voteStore = new VoteStore();
  