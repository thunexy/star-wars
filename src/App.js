import logo from "./assets/logo.png";
import "./App.css";
import {useEffect, useRef, useState} from "react";
import {apiRequest} from "./lib/api/api";
import {movieList} from "./lib/api/url";

function App() {
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedFilmCharacters, setSelectedFilmCharacters] = useState([]);
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    apiRequest(movieList, "get", {})
      .then((response) => {
        setFilms(response?.results);
      })
      .catch((e) => console.log(e));
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchCharacter = (url) => {
    return apiRequest(url, "get", {});
  };

  const fetchAllCharacters = async () => {
    const allCharacters = await Promise.all(
      selectedFilm.characters.map(fetchCharacter)
    );
    setSelectedFilmCharacters(allCharacters);
  };

  useEffect(() => {
    if (selectedFilm) {
      fetchAllCharacters();
    }
  }, [selectedFilm]);

  return (
    <div className="app">
      <section id="header-section">
        <div
          className={`app-header movie-${
            !!selectedFilm ? "selected" : "empty"
          }`}
        >
          <img src={logo} className="app-logo" alt="logo" />
          <form>
            <select
              className="movie-dropdown"
              onChange={(e) => {
                isMounted.current && setSelectedFilm(films[e.target.value]);
                isMounted.current && setSelectedFilmCharacters([]);
              }}
            >
              <option>Select a movie</option>
              {films.map(({title}, i) => (
                <option value={i} key={`${i}`}>
                  {title}
                </option>
              ))}
            </select>
          </form>
        </div>
      </section>
      <section id="content-section">
        <div className={`app-content`}>
          {selectedFilm && (
            <marquee
              direction="up"
              loop={4}
              height={130}
              vSpace={20}
              scrollAmount={2}
            >
              <span>{selectedFilm.opening_crawl}</span>
            </marquee>
          )}
          {selectedFilmCharacters.length && (
            <div className="content-table">
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Full Name</th>
                    <th>Gender</th>
                    <th>Height</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFilmCharacters.map(({name, gender, height}, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{name}</td>
                      <td>{gender}</td>
                      <td>{height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
