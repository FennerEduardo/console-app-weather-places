const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = []
    dbPath = './db/database.json'

    constructor() {
        this.leerDB()
    }

    get historialCapitalizado() {
        return this.historial.map(hist => {
            const arr = hist.split(' ');
            const newArr = arr.map(element => {
                const text = element.toLocaleLowerCase();
                return `${element.charAt(0).toUpperCase()}${text.slice(1)}`;
            });
            return newArr.join(' ');
        })
    }

    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            language: 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
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

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lon, lat }
            })

            const resp = await instance.get();
            const { weather, main } = resp.data
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = '') {

        if (this.historial.includes(lugar.toLocaleLowerCase())) return;

        this.historial = this.historial.splice(0, 8);
        
        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })

        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}

module.exports = Busquedas