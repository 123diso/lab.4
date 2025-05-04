import { store } from '../flux/Store';

class VotingStats extends HTMLElement {
  fightIndex!: number;

  connectedCallback() {
    this.fightIndex = parseInt(this.getAttribute('fight-index')!);
    this.attachShadow({ mode: 'open' });
    store.subscribe(() => this.render());
    this.render();
  }

  render() {
    const [a, b] = store.getState().fights[this.fightIndex];
    const totalVotes = a.votes + b.votes;
  
    let percentA = 0;
    let percentB = 0;
  
    if (totalVotes > 0) {
      percentA = Math.round((a.votes / totalVotes) * 100);
      percentB = 100 - percentA;
    }
  
    this.shadowRoot!.innerHTML = `
      <style>
        .bar {
          height: 20px;
          margin: 8px 0;
          line-height: 20px;
          padding-left: 5px;
        }
      </style>
      <div>
        <div class="bar" style="width: ${percentA}%; background-color: red;">${a.name}: ${percentA}%</div>
        <div class="bar" style="width: ${percentB}%; background-color: blue;">${b.name}: ${percentB}%</div>
      </div>
    `;
  }
}  

export default VotingStats;

