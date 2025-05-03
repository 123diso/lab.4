console.log("Hello, TypeScript!");
import DogList from "./components/Header/DogList";
import Root from "./components/root/root";

customElements.define("my-dog-list", DogList);
customElements.define("my-root", Root);