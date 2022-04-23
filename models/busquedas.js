const axios = require('axios');

class Busquedas {

    historial = []

    constructor() {
        //TODO: Leer DB i existe
    }

    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            language: 'es'
        }
    }

    async ciudad(lugar = '') {
        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();

            return resp.data.features.map(place => ({
                id: place.id,
                nombre: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }))

        } catch (error) {
            return [];
        }


    }
}

module.exports = Busquedas