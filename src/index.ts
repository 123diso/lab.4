console.log("Hello, TypeScript!");

import AppContainer from './components/AppContainer';
import CharacterCard from './components/CharacterCard';
import VotingStats from './components/VotingStats';

customElements.define('app-container', AppContainer);
customElements.define('character-card', CharacterCard);
customElements.define('voting-stats', VotingStats);




