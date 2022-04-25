require('colors')
require('dotenv').config()


const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ')

                // Buscar los lugares
                const ciudades = await busquedas.ciudad(termino.desc);

                // Seleccionar el lugar
                const id = await listarLugares(ciudades);
                if (id === '0') continue;

                const place = ciudades.find(city => city.id === id)

                // Guardar en db para historial
                busquedas.agregarHistorial(place.nombre)

                // Clima del lugar seleccionado
                const temp = await busquedas.climaLugar(place.lat, place.lng)

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad \n'.green);
                console.log('Ciudad: ', place.nombre.green);
                console.log('Lat: ', place.lat);
                console.log('Lng: ', place.lng);
                console.log('Clima: ', temp.desc.green);
                console.log('Temperatura: ', temp.temp);
                console.log('Mínima: ', temp.min);
                console.log('Máxima: ', temp.max);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.blue
                    console.log(`${idx} ${lugar}`);
                })
                break;
            default:
                break;
        }

        if (opt !== 0) await pausa()
    } while (opt !== 0);
}

main()