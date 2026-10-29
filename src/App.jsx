
import { useState } from 'react'
import imageRickMorty from './img/rick-morty.png'
import './App.css'

function App() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reqApi = async () => {
    try {
      setLoading(true)
      setError('')

      const api = await fetch(
        'https://rickandmortyapi.com/api/character'
      )

      if (!api.ok) {
        throw new Error('No se pudieron obtener los personajes')
      }

      const characterApi = await api.json()
      setCharacters(characterApi.results)
    } catch (err) {
      setError(err.message || 'Ocurrió un error al conectar con la API')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1 className="title">Rick and Morty</h1>

      {characters.length === 0 && (
        <section className="home">
          <img
            src={imageRickMorty}
            alt="Rick and Morty"
            className="img-home"
          />

          <p>
            Explora los personajes del universo de Rick and Morty.
          </p>

          <button
            onClick={reqApi}
            className="btn-search"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Buscar Personajes'}
          </button>
        </section>
      )}

      {error && <p className="error">{error}</p>}

      {loading && <p className="loading">Cargando personajes...</p>}

      {characters.length > 0 && (
        <>
          <h2 className="subtitle">Personajes</h2>

          <button
            onClick={reqApi}
            className="btn-search"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Actualizar personajes'}
          </button>

          <section className="characters">
            {characters.map((character) => (
              <article className="card" key={character.id}>
                <img
                  src={character.image}
                  alt={character.name}
                  className="character-img"
                  loading="lazy"
                />

                <div className="card-info">
                  <h3>{character.name}</h3>

                  <p>
                    <strong>Estado:</strong>{' '}
                    <span
                      className={`status status-${character.status.toLowerCase()}`}
                    >
                      {character.status}
                    </span>
                  </p>

                  <p>
                    <strong>Especie:</strong> {character.species}
                  </p>

                  <p>
                    <strong>Género:</strong> {character.gender}
                  </p>

                  <p>
                    <strong>Origen:</strong> {character.origin.name}
                  </p>

                  <p>
                    <strong>Última ubicación:</strong>{' '}
                    {character.location.name}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  )
}

export default App
