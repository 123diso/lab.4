export function GetInfo() {
    return fetch('https://dog.ceo/api/breeds/list/all') 
    .then((res) => {
        console.log('funciona');
        return res.json();
    })
    .catch((error) => {
        console.log('no funciona', error); 
    })
}

export function GetInfoImage(breed: string) {
    return fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
    .then(res => res.json())
    .catch(error => {
        console.error(`Error al obtener imagen de ${breed}`, error);
    });
}

export function GetInfoSubImage(breed: string, subBreed: string) {
    return fetch(`https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`)
    .then(res => res.json())
    .catch(error => {
        console.error(`Error al obtener imagen de ${subBreed} ${breed}`, error);
    });
}

