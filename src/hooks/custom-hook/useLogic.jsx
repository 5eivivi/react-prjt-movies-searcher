import { useEffect, useState, useRef, useMemo, useCallback } from 'react'

// Luego de estar usando fetch ya no necesito usar esto como ejemplo para mostrar.
// import withResults from '../../api_result/with-result.json'
// import withoutResults from '../../api_result/no-result.json'
import debounce from "just-debounce-it";

// Custom Hook
// Contiene toda la logica del componente de la aplicacion.
export function useLogic() {
  const [valueInputSearch, setValueInputSearch] = useState('')
  const [error, setError] = useState(null)
  const [isFirstRender, setIsFirstRender] = useState(true)
  // Lista con las movies a mostrar.
  const [responseMovies, setResponseMovies] = useState()
  // Efecto loading.
  const [loading, setLoading] = useState(false)
  // No hacer la misma busqueda 2 veces seguidas.
  const previousSearch = useRef()
  // checkbox marcado, ordena las peliculas alfabeticamente por titulo, 
  // checkbox no marcada, no ordena.
  const [sort, setSort] = useState(false)

  // Actua en pro de la validacion del formulario.
  useEffect(() => {
    // Si es la primera vez que se renderiza el componente rompe.
    // Obj: Que no se muestre el mensaje "No puedes buscar si el input esta vacio."
    // producto a que valueInputSearch === '' al momento de renderizar por pirmera vez.
    if(isFirstRender) {
      setIsFirstRender(false)
      return
    }

    if(valueInputSearch === '') {
      setError("You can't search if the input is empty.")
      return
    }

    // Si el input tiene un numero como valor.
    if(valueInputSearch.match(/^\d+$/)) {
      setError("You can't search using a number.")
      return
    }

    // La busqueda debe tener al menos 3 caracteres
    if(valueInputSearch.length < 3) {
      setError("You must write at least three characters.")
      return
    }

    setError(null)
  }, [valueInputSearch])

  // Actua en pro de la validacion del formulario.
  const handleSubmit = (event) => {
    event.preventDefault()

    const { nameInputSearch } = Object.fromEntries(new window.FormData(event.target))
    // Lo que se escribio en el inupt.
    console.log(nameInputSearch) // thor

    // valueInputSearch es el useState.
    console.log({ valueInputSearch }) // >{nameInvalueInputSearchputSearch: 'thor'}

    // nameInputSearch es la propiedad name del input: '<el dato typed>'
    console.log(Object.fromEntries(new window.FormData(event.target))) // >{nameInputSearch: 'thor'}

    if (valueInputSearch) {
      if (valueInputSearch === previousSearch.current) {
        alert("You can't search for the same movie twice at the same moment.")
        return
      }

      try {
        setLoading(true)

        previousSearch.current = valueInputSearch
        
        getMovies(valueInputSearch)
        
      } catch (e) {
        console.log(e.message)
      } finally {
        // finally hace que el codigo de aqui se ejecute luego del try 
        // en un escenario positivo o del catch en un escenario en que 
        // ocurre un error.

        setLoading(false)
      }
    } else {
        return
    }
  } 

  // Obtener movies con fetch y ordenar o no la lista a mostrar de acuerdo a isChecked.
  // ❗ useCallback
  const getMovies = useCallback(async (valueInputSearch) => {
    const res = await fetch(`http://www.omdbapi.com/?apikey=4287ad07&s=${valueInputSearch}`)
    const data = await res.json()
    // Mapeo | Transformacion las propiedades de cada objeto. 
    // Si cambia la API solo tengo que modificar aqui las propiedades.
    const mappedMovies = data.Search?.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      image: movie.Poster
    }))
    
    setResponseMovies(mappedMovies)
  }, [])
  // 🧪 Solo para probar 
  // que la funcion useCallback de aqui arriba (getMovies) se ejecuta unicamente cuando 
  // cambia el valor de su dependencia (valueInputSearch) ya que se muestra el 
  // mensaje de aqui abajo (mensaje getMovies) unicamente cuando dicha 
  // dependencia cambie. PERO mejor aun puedo quitar la dependencia y pasarsela
  // (valueInputSearch) como parametro, ello propicia que esta funcion (getMovies) se 
  // ejecute solo 1 vez; la primera y ya.
  // useEffect(() => {
  //   console.log('mensaje getMovies')
  // }, [getMovies])

  // Solucion a: Resultado no corresponde con la palabra typeada ( usar debounce ).
  const debounceGetMovies = useCallback(
    debounce(valueInputSearch => {
      getMovies(valueInputSearch)
    }, 300), []
  )
  // 🧪 Solo para probar 
  // Probar que la funcion useCallback de aqui arriba (debounceGetMovies) se ejecuta solo 1 vez.
  useEffect(() => {
    console.log('mensaje debounceGetMovies')
  }, [debounceGetMovies])

  // Actua en pro de la validacion del formulario.
  const handleChange = (event) => {
    const valorActualDelInput = event.target.value
    
    // no puedes iniciar escribiendo espacio en el input.
    if(valorActualDelInput.startsWith(' ')) {
      alert("You can't start typing a space in the input.")
      return 
    }

    setValueInputSearch(event.target.value)

    // Buscar mientras se typea en el input search.
    debounceGetMovies(valorActualDelInput)
  } 

  useEffect(() => {
    getMovies(valueInputSearch)
  }, [sort])

  const handleSort = () => {
    setSort(!sort)
  }
  
  return { movies: responseMovies, valueInputSearch, error, handleSubmit, handleChange, loading, handleSort, sort }
}
