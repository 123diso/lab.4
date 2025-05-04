import { store } from '../flux/Store';

class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (this.shadowRoot) {
      const fights = store.getState().fights;
      this.shadowRoot.innerHTML = `
        <style>
          .fight {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
          }
        </style>
        <div>
        ${fights.map((_, i) => `
          <div class="fight">
            <character-card fight-index="${i}" character-index="0"></character-card>
            <character-card fight-index="${i}" character-index="1"></character-card>
          </div>
          <voting-stats fight-index="${i}"></voting-stats>
        `).join('')}
        </div>
      `;
    }
  }
}

export default AppContainer;
