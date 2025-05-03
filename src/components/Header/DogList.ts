import { GetInfo, GetInfoImage, GetInfoSubImage } from "../service/service";
import { VoteActions } from "../../flux/actions";
import { voteStore, VoteState } from "../../flux/Store";

type Dog = {
    message: {
        [breed: string]: string[];
    };
    status: string;
};

class DogList extends HTMLElement {
    private unsubscribe: (() => void) | null = null;
    private votes: { [dogId: string]: number } = {};
    private allBreeds: { name: string; isSubBreed: boolean; parentBreed?: string }[] = [];
    private dogPairs: { name: string; isSubBreed: boolean; parentBreed?: string }[][] = [];
    private dogPairsWithImages: {
        name: string;
        isSubBreed: boolean;
        parentBreed?: string;
        imageUrl: string;
        displayName: string;
        type: string;
        id: string;
    }[][] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.unsubscribe = voteStore.subscribe((state: VoteState) => this.updateVotes(state.votes));
        this.loadAndRenderDogs();
    }

    disconnectedCallback() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null; 
        }
    }

    updateVotes(newVotes: { [dogId: string]: number }) {
        this.votes = newVotes;
        this.renderDogPairs(this.dogPairsWithImages);
    }

    async loadAndRenderDogs() {
        if (this.shadowRoot) {
            try {
                const response: Dog = await GetInfo();
                const breeds = Object.entries(response.message);

                this.allBreeds = [];
                breeds.forEach(([breed, subBreeds]) => {
                    this.allBreeds.push({ name: breed, isSubBreed: false });
                    subBreeds.forEach(sub => {
                        this.allBreeds.push({ name: sub, isSubBreed: true, parentBreed: breed });
                    });
                });

                this.dogPairs = [];
                for (let i = 0; i < this.allBreeds.length; i += 2) {
                    if (i + 1 < this.allBreeds.length) {
                        this.dogPairs.push([this.allBreeds[i], this.allBreeds[i + 1]]);
                    } else {
                        this.dogPairs.push([this.allBreeds[i]]);
                    }
                }

                this.dogPairsWithImages = await Promise.all(
                    this.dogPairs.map(async (pair) => {
                        return Promise.all(
                            pair.map(async (dog) => {
                                const imageData = dog.isSubBreed
                                    ? await GetInfoSubImage(dog.parentBreed!, dog.name)
                                    : await GetInfoImage(dog.name);
                                const dogId = dog.isSubBreed ? `${dog.parentBreed}-${dog.name}` : dog.name;
                                return {
                                    ...dog,
                                    imageUrl: imageData.message,
                                    displayName: dog.isSubBreed
                                        ? `${dog.name} ${dog.parentBreed}`
                                        : dog.name,
                                    type: dog.isSubBreed ? 'Subraza' : 'Raza principal',
                                    id: dogId,
                                };
                            })
                        );
                    })
                );

                this.renderDogPairs(this.dogPairsWithImages);

            } catch (error) {
                console.error('Error al cargar las razas de perros:', error);
                this.shadowRoot.innerHTML = `
                    <style>
                        .error {
                            color: white;
                            background: #e74c3c;
                            padding: 20px;
                            border-radius: 8px;
                            text-align: center;
                            margin: 20px;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        }
                    </style>
                    <div class="error">
                        <h3>¡Ups! Algo salió mal</h3>
                        <p>No pudimos cargar las imágenes de los perros. Por favor, intenta nuevamente más tarde.</p>
                    </div>
                `;
            }
        }
    }

    renderDogPairs(pairsWithImages: {
        name: string;
        isSubBreed: boolean;
        parentBreed?: string;
        imageUrl: string;
        displayName: string;
        type: string;
        id: string;
    }[][]) {
        if (!this.shadowRoot) return;

        const pairsHtml = pairsWithImages.map((pair, index) => {
            return `
                <div class="dog-pair-container">
                    <div class="dog-pair" id="pair-${index}">
                        ${pair.map(dog => `
                            <div class="dog-card">
                                <div class="card-header">
                                    <h3>${dog.displayName}</h3>
                                    <span class="dog-type">${dog.type}</span>
                                </div>
                                <div class="card-image">
                                    <img src="${dog.imageUrl}" alt="${dog.displayName}">
                                </div>
                                <div class="card-footer">
                                    <button
                                        class="vote-btn ${this.votes[dog.id] ? 'voted' : ''}"
                                        data-dog-id="${dog.id}"
                                    >
                                        <span class="heart-icon"></span> Votar (${this.votes[dog.id] || 0})
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 20px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    min-height: 100vh;
                }

                h2 {
                    font-family: 'Arial', sans-serif;
                    text-align: center;
                    color: #2c3e50;
                    margin-bottom: 30px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                }

                .dog-pair-container {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    padding: 20px;
                    margin-bottom: 30px;
                    transition: transform 0.3s ease;
                }

                .dog-pair-container:hover {
                    transform: translateY(-5px);
                }

                .dog-pair {
                    display: flex;
                    justify-content: space-around;
                    gap: 2rem;
                    padding: 1rem;
                }

                .dog-card {
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                    overflow: hidden;
                    width: 280px;
                    transition: all 0.3s ease;
                    border: 1px solid #e0e0e0;
                }

                .dog-card:hover {
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                    transform: scale(1.02);
                }

                .card-header {
                    padding: 15px;
                    background: linear-gradient(to right, #3498db, #2980b9);
                    color: white;
                    text-align: center;
                }

                .card-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                }

                .dog-type {
                    display: block;
                    font-size: 0.8rem;
                    opacity: 0.9;
                    margin-top: 5px;
                }

                .card-image {
                    padding: 15px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 200px;
                    background-color: #f8f9fa;
                }

                .card-image img {
                    max-width: 100%;
                    max-height: 100%;
                    border-radius: 8px;
                    object-fit: cover;
                }

                .card-footer {
                    padding: 15px;
                    text-align: center;
                    background-color: #f8f9fa;
                    border-top: 1px solid #e0e0e0;
                }

                .vote-btn {
                    padding: 10px 20px;
                    background: linear-gradient(to right, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: bold;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .vote-btn:hover {
                    background: linear-gradient(to right, #c0392b, #e74c3c);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
                }

                .vote-btn.voted {
                    background: linear-gradient(to right, #2ecc71, #27ae60);
                }

                .vote-btn.voted:hover {
                    background: linear-gradient(to right, #27ae60, #2ecc71);
                }

                .heart-icon {
                    font-size: 1.1em;
                }

                @media (max-width: 768px) {
                    .dog-pair {
                        flex-direction: column;
                        align-items: center;
                    }

                    .dog-card {
                        width: 100%;
                        max-width: 300px;
                    }
                }
            </style>
            <h2>Vota por tu perro favorito </h2>
            <div class="pairs-container">
                ${pairsHtml}
            </div>
        `;

        this.shadowRoot.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                const dogId = target.getAttribute('data-dog-id');
                if (dogId) {
                    VoteActions.voteForDog(dogId);
                }
            });
        });
    }
}

export default DogList;