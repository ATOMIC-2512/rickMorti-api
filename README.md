# Rick & Morty — Multiverse Explorer

Aplicación web desarrollada con React y Vite para explorar personajes de Rick y Morty mediante la API pública de Rick and Morty.

## Funcionalidades

- Buscador de personajes por nombre.
- Paginación conectada a los resultados de la API.
- Tarjetas con imagen, estado, especie, género, origen y última ubicación.
- Diseño adaptable a escritorio, tabletas y móviles.
- Estados visuales de carga, errores y búsquedas sin resultados.

## Requisitos

- Node.js 20.19+ o 22.12+.
- npm.
- Conexión a internet para consultar la API y cargar las fuentes web.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Para generar la versión de producción:

```bash
npm run build
npm run preview
```

## API

La aplicación utiliza la API pública:

`https://rickandmortyapi.com/api/character`

La búsqueda se realiza con el parámetro `name` y la navegación entre resultados con `page`.
