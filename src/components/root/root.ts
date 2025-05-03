class Root extends HTMLElement {
constructor() {
    super();
    this.attachShadow({mode: 'open'});
console.log('Header');
}

connectedCallback(){
    if(this.shadowRoot) {
        this.shadowRoot.innerHTML = `
        <h1>Hello World</h1>
        <div>
        <my-dog-list></my-dog-list>
        </div>
        `
    }
    

}
}

export default Root;