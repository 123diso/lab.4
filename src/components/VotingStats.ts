import { store } from '../flux/Store';

class VotingStats extends HTMLElement {
  fightIndex!: number;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.fightIndex = parseInt(this.getAttribute('fight-index')!);

    store.subscribe(() => this.renderStats());

    this.renderStats();
  }

  renderStats() {
    const [a, b] = store.getState().fights[this.fightIndex];
    const totalVotes = a.votes + b.votes;

    let percentA = 0;
    let percentB = 0;

    if (totalVotes > 0) {
      percentA = Math.round((a.votes / totalVotes) * 100);
      percentB = 100 - percentA;
    }

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          .bar {
            height: 20px;
            margin: 8px 0;
            line-height: 20px;
            color: white;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
        <div>
          <div class="bar" style="width: ${percentA}%; background-color: red;">${a.name}: ${percentA}%</div>
          <div class="bar" style="width: ${percentB}%; background-color: blue;">${b.name}: ${percentB}%</div>
        </div>
      `;
    }
  }
}

export default VotingStats;


