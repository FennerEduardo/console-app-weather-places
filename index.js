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
                const place = ciudades.find(city => city.id === id)

                // Clima del lugar seleccionado

                // Mostrar resultados

                console.log('\nInformación de la ciudad \n'.green);
                console.log('Ciudad: ', place.nombre);
                console.log('Lat: ', place.lat);
                console.log('Lng: ', place.lng);
                console.log('Temperatura: ',);
                console.log('Mínima: ',);
                console.log('Máxima: ',);
                break;
            case 2:
                //console.log(opt);
                break;
            default:
                break;
        }

        if (opt !== 0) await pausa()
    } while (opt !== 0);
}

main()