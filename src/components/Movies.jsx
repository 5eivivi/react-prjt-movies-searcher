import { useMemo, useEffect } from 'react'

function ListOfMovies({ movies, sort }) {
  // ❗ useMemo
  const resMovies = useMemo(() => {
    return sort 
      ? movies.sort((a, b) => a.title.localeCompare(b.title)) 
      : movies
  }, [sort, movies])

  // 🧪 Solo para probar 
  // que la funcion useMemo de aqui arriba (resMovies) se ejecuta unicamente cuando 
  // cambia los valores de las dependencias (sort y/o movies) ya que se muestra 
  // el mensaje de aqui abajo (mensaje resMovies) unicamente cuando dichas 
  // dependencias cambien.
  // useEffect(() => {
  //   console.log('mensaje resMovies')
  // }, [resMovies])

  return (
    <ul className="movies">
      {
        resMovies.map(movie => (
          <li className="movie" key={ movie.id }>
            <h3>{ movie.title }</h3>
            <p>{ movie.year }</p>
            <img src={movie.image} alt={movie.title} />
          </li>
        ))
      }
    </ul>
  )
}

function NoMoviesResults() {
  return (
    <p>Movies not found.</p>
  )
}

export function Movies({ movies, sort }) {
  const hasMovies = movies?.length > 0

  return (
    // Operador condicional.
    hasMovies 
      ? (
          <ListOfMovies movies={movies} sort={sort} />
        )
      : (
        <NoMoviesResults />
      )
  )
}
