import { useEffect, useState } from 'react'
import imageRickMorty from './img/rick-morty.png'
import './App.css'

const API_URL = 'https://rickandmortyapi.com/api/character'

const statusLabels = {
  Alive: 'Vivo',
  Dead: 'Muerto',
  unknown: 'Desconocido',
}

const genderLabels = {
  Female: 'Femenino',
  Male: 'Masculino',
  Genderless: 'Sin género',
  unknown: 'Desconocido',
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

function ArrowIcon({ direction = 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={direction === 'left' ? 'arrow-left' : ''}
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}

function getPageItems(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  let start = Math.max(2, currentPage - 1)
  let end = Math.min(totalPages - 1, currentPage + 1)

  if (currentPage <= 2) end = 3
  if (currentPage >= totalPages - 1) start = totalPages - 2

  const pages = [1]
  if (start > 2) pages.push('…')
  for (let page = start; page <= end; page += 1) pages.push(page)
  if (end < totalPages - 1) pages.push('…')
  pages.push(totalPages)

  return pages
}

function App() {
  const [characters, setCharacters] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCharacters, setTotalCharacters] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [noResults, setNoResults] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!hasLoaded) return undefined

    const controller = new AbortController()

    async function loadCharacters() {
      const params = new URLSearchParams({ page: String(currentPage) })
      if (searchTerm) params.set('name', searchTerm)

      try {
        const response = await fetch(`${API_URL}/?${params.toString()}`, {
          signal: controller.signal,
        })
        const data = await response.json()

        if (!response.ok) {
          if (response.status === 404 && searchTerm) {
            setCharacters([])
            setTotalPages(0)
            setTotalCharacters(0)
            setNoResults(true)
            return
          }
          throw new Error(data.error || 'No se pudieron cargar los personajes.')
        }

        setCharacters(data.results || [])
        setTotalPages(data.info?.pages || 1)
        setTotalCharacters(data.info?.count || 0)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'No fue posible conectar con la API.')
          setCharacters([])
          setTotalPages(0)
          setTotalCharacters(0)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadCharacters()
    return () => controller.abort()
  }, [hasLoaded, currentPage, searchTerm, retryCount])

  const pageItems = getPageItems(totalPages, currentPage)

  const startExploring = () => {
    setLoading(true)
    setError('')
    setNoResults(false)
    setHasLoaded(true)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const nextTerm = searchInput.trim()

    if (nextTerm === searchTerm && currentPage === 1 && !error && !noResults) return

    setLoading(true)
    setError('')
    setNoResults(false)
    setCurrentPage(1)
    setSearchTerm(nextTerm)
    setHasLoaded(true)

    if (nextTerm === searchTerm && currentPage === 1) {
      setRetryCount((count) => count + 1)
    }
  }

  const clearSearch = () => {
    setSearchInput('')
    if (searchTerm === '' && currentPage === 1 && !error && !noResults) return

    setLoading(true)
    setError('')
    setNoResults(false)
    setSearchTerm('')
    setCurrentPage(1)
    setHasLoaded(true)

    if (searchTerm === '' && currentPage === 1) {
      setRetryCount((count) => count + 1)
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) return
    setLoading(true)
    setError('')
    setNoResults(false)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <div className="ambient-glow ambient-glow-one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-two" aria-hidden="true" />

      <header className="site-header">
        <a
          className="brand"
          href="#inicio"
          aria-label="Rick and Morty Explorer, inicio"
          onClick={(event) => {
            event.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <span className="brand-symbol" aria-hidden="true">
            <span />
          </span>
          <span className="brand-copy">
            <strong>RICK <span>&amp; MORTY</span></strong>
            <small>MULTIVERSE EXPLORER</small>
          </span>
        </a>

        <div className="connection-status">
          <span className="connection-dot" />
          <span>Explorador interdimensional</span>
        </div>
      </header>

      <main id="inicio" className="main-content">
        <section className={`hero ${hasLoaded ? 'hero-compact' : ''}`}>
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              BASE DE DATOS MULTIVERSAL
            </div>
            <h1>
              Hay infinitos universos.
              <span>Empieza por este.</span>
            </h1>
            <p className="hero-description">
              Viaja por dimensiones, conoce formas de vida extraordinarias y encuentra a tus personajes favoritos de Rick y Morty.
            </p>

            {!hasLoaded && (
              <button
                type="button"
                className="primary-button hero-button"
                onClick={startExploring}
              >
                Explorar personajes
                <ArrowIcon />
              </button>
            )}

            <div className="hero-facts" aria-label="Información del explorador">
              <div className="hero-fact">
                <span className="fact-icon">✳</span>
                <span><strong>Multiverso</strong><small>Sin límites</small></span>
              </div>
              <div className="fact-divider" />
              <div className="hero-fact">
                <span className="fact-icon fact-icon-ring">◎</span>
                <span><strong>Datos en vivo</strong><small>API oficial</small></span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Ilustración de Rick y Morty">
            <div className="portal portal-back" />
            <div className="portal portal-front" />
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <img src={imageRickMorty} alt="Rick y Morty explorando el multiverso" />
            <div className="floating-label floating-label-top">
              <span className="floating-label-dot" /> DIMENSIÓN C-137
            </div>
            <div className="floating-label floating-label-bottom">
              <span>✦</span> WUBBA LUBBA DUB DUB!
            </div>
          </div>
        </section>

        <section className="explorer-section" aria-labelledby="explorer-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> ARCHIVO INTERDIMENSIONAL</div>
              <h2 id="explorer-title">Explora el <span>multiverso</span></h2>
              <p>Busca, descubre y conoce cada detalle de sus habitantes.</p>
            </div>
            {hasLoaded && !loading && !error && !noResults && (
              <div className="total-counter">
                <strong>{totalCharacters.toLocaleString('es-MX')}</strong>
                <span>personajes encontrados</span>
              </div>
            )}
          </div>

          {hasLoaded && (
            <>
              <form className="search-form" onSubmit={handleSearch} role="search">
                <SearchIcon />
                <input
                  type="search"
                  name="character-search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Busca por nombre... ej. Rick, Morty, Summer"
                  aria-label="Buscar personajes por nombre"
                />
                {searchInput && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearchInput('')}
                    aria-label="Borrar texto de búsqueda"
                    title="Borrar texto"
                  >
                    ×
                  </button>
                )}
                <button className="primary-button search-button" type="submit" disabled={loading}>
                  Buscar <span className="search-button-icon"><SearchIcon /></span>
                </button>
              </form>
              <div className="search-meta">
                <span>Busca por nombre en todo el universo</span>
                {searchTerm && (
                  <button type="button" className="reset-search" onClick={clearSearch}>
                    Limpiar búsqueda <span>×</span>
                  </button>
                )}
              </div>
            </>
          )}

          {!hasLoaded && (
            <div className="launch-panel">
              <div className="launch-panel-icon"><SearchIcon /></div>
              <div>
                <strong>Todo el multiverso, en un solo lugar</strong>
                <p>Consulta personajes en tiempo real, busca por nombre y navega entre páginas.</p>
              </div>
              <div className="launch-tags" aria-label="Funciones disponibles">
                <span>BUSCADOR</span>
                <span>PAGINACIÓN</span>
                <span>DETALLES</span>
              </div>
            </div>
          )}

          {error && (
            <div className="feedback-panel error-panel" role="alert">
              <span className="feedback-symbol">!</span>
              <div><strong>No se pudo conectar</strong><p>{error}</p></div>
              <button type="button" className="secondary-button" onClick={() => { setLoading(true); setError(''); setNoResults(false); setRetryCount((count) => count + 1) }}>
                Volver a intentar
              </button>
            </div>
          )}

          {loading && (
            <div className="character-grid" aria-label="Cargando personajes" aria-busy="true">
              {Array.from({ length: 8 }, (_, index) => (
                <div className="skeleton-card" key={index}>
                  <div className="skeleton-image" />
                  <div className="skeleton-line skeleton-line-title" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line skeleton-line-short" />
                </div>
              ))}
            </div>
          )}

          {!loading && noResults && (
            <div className="feedback-panel empty-panel">
              <span className="empty-emoji">🛸</span>
              <h3>No encontramos a ese personaje</h3>
              <p>Prueba con otro nombre o limpia la búsqueda para volver al archivo completo.</p>
              <button type="button" className="primary-button" onClick={clearSearch}>
                Ver todos los personajes <ArrowIcon />
              </button>
            </div>
          )}

          {!loading && !error && !noResults && hasLoaded && characters.length > 0 && (
            <>
              <div className="results-toolbar">
                <p>
                  Mostrando <strong>{characters.length}</strong> personajes
                  {searchTerm && <> para <strong>“{searchTerm}”</strong></>}
                </p>
                <span className="page-indicator">PÁGINA {currentPage} <i /> {totalPages}</span>
              </div>

              <div className="character-grid">
                {characters.map((character) => (
                  <article className="character-card" key={character.id}>
                    <div className="card-art">
                      <span className="character-id">N.º {String(character.id).padStart(3, '0')}</span>
                      <img
                        src={character.image}
                        alt={character.name}
                        className="character-image"
                        loading="lazy"
                      />
                      <span className={`status-pill status-${character.status.toLowerCase()}`}>
                        <span className="status-dot" />
                        {statusLabels[character.status] || character.status}
                      </span>
                    </div>

                    <div className="card-content">
                      <div className="card-title-row">
                        <h3 title={character.name}>{character.name}</h3>
                        <span className="gender-symbol" title={genderLabels[character.gender] || character.gender}>
                          {character.gender === 'Male' ? '♂' : character.gender === 'Female' ? '♀' : '◈'}
                        </span>
                      </div>
                      <p className="character-species">
                        {character.species}
                        {character.type && <span> · {character.type}</span>}
                      </p>

                      <div className="card-divider" />

                      <div className="character-detail">
                        <span className="detail-label"><span className="detail-icon">⌖</span> ORIGEN</span>
                        <p title={character.origin?.name || 'Desconocido'}>{character.origin?.name || 'Desconocido'}</p>
                      </div>
                      <div className="character-detail">
                        <span className="detail-label"><span className="detail-icon detail-icon-location">⌁</span> ÚLTIMA UBICACIÓN</span>
                        <p title={character.location?.name || 'Desconocida'}>{character.location?.name || 'Desconocida'}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="pagination" aria-label="Paginación de personajes">
                  <button
                    type="button"
                    className="page-arrow"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    aria-label="Página anterior"
                  >
                    <ArrowIcon direction="left" /> <span>Anterior</span>
                  </button>

                  <div className="page-numbers">
                    {pageItems.map((page, index) => (
                      page === '…' ? (
                        <span className="page-ellipsis" key={`ellipsis-${index}`} aria-hidden="true">…</span>
                      ) : (
                        <button
                          type="button"
                          className={`page-number ${page === currentPage ? 'active' : ''}`}
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          aria-label={`Ir a la página ${page}`}
                          aria-current={page === currentPage ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    type="button"
                    className="page-arrow page-arrow-next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    aria-label="Página siguiente"
                  >
                    <span>Siguiente</span> <ArrowIcon />
                  </button>
                </nav>
              )}
              <p className="pagination-caption">Explorando página {currentPage} de {totalPages}</p>
            </>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#inicio" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          RICK <span>&amp; MORTY</span>
        </a>
        <p>Hecho para exploradores de todas las dimensiones.</p>
        <span className="footer-credit">DATOS DE RICKANDMORTYAPI.COM</span>
      </footer>
    </div>
  )
}

export default App
