import './App.css'
import { Movies } from './components/Movies.jsx'
import { useLogic } from './hooks/custom-hook/useLogic.jsx'

function App() {
  // Custom Hook
  // Contiene toda la logica del componente de la aplicacion.
  const { movies, valueInputSearch, error, handleSubmit, handleChange, loading, handleSort, sort } = useLogic()

  return (
    <div className='page'>

      <header>
        <h1>Search Movies:</h1>
        <form className='form' onSubmit={handleSubmit}>
          {/* Puedo poner  propiedades sobre el input que tambien actuan a favor de la validacion. */}
          <input onChange={handleChange} value={valueInputSearch} name='nameInputSearch' id='idInputSearch' placeholder='Avengers, Star Wars,...'  style={{ border: '1px solid transparent', borderColor: error ? 'red' : 'transparent' }} />
          <label>Sort</label>
          <input type='checkbox' onChange={handleSort} checked={sort} id='idInputCheckbox' />
          <button type="submit">Search</button>
        </form>
        {/* Renderizado condicional. */}
        {error && <p style={{color: 'red'}}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Loading...</p> : <Movies movies={movies} sort={sort} />
        }        
      </main>
    </div>
  )
}

export default App
