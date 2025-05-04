import { VotingActions } from '../flux/Actions';
import { store } from '../flux/Store';

class CharacterCard extends HTMLElement {
  fightIndex!: number;
  characterIndex!: number;

  connectedCallback() {
    this.fightIndex = parseInt(this.getAttribute('fight-index')!);
    this.characterIndex = parseInt(this.getAttribute('character-index')!);
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    const character = store.getState().fights[this.fightIndex][this.characterIndex];
    this.shadowRoot!.innerHTML = `
      <style>
        .card {
          border: 2px solid #333;
          padding: 10px;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
        }
        .card:hover {
          background-color: #eee;
        }
      </style>
      <div class="card">
        <h3>${character.name}</h3>
        <img src="${character.image}" width="100" height="100" />
        <button>Votar</button>
      </div>
    `;
    this.shadowRoot!.querySelector('button')!.addEventListener('click', () => {
      VotingActions.vote(this.fightIndex, this.characterIndex);
    });
  }
}

export default CharacterCard;

