import "./App.css";
import {useEffect, useRef, useState} from "react";
import {apiRequest} from "./lib/api/api";
import {movieList} from "./lib/api/url";
import Characters from "./components/Characters";
import logo from "./assets/images/logo.png";
import loader from "./assets/images/loader.gif";

function App() {
  const initialFilters = {
    isNameAscending: false,
    isHeightAscending: false,
    gender: "all",
  };
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [filmCharacters, setFilmCharacters] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
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

  const fetchAllCharacters = async () => {
    const allCharacters = await Promise.all(
      selectedFilm.characters.map((url) => apiRequest(url, "get", {}))
    );
    isMounted.current && setFilmCharacters(allCharacters);
  };

  useEffect(() => {
    //fetch character when movie is selected
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
          {!films.length ? (
            <img src={loader} alt="fetching movies" className="loader-gif" />
          ) : (
            <form>
              <select
                className="movie-dropdown"
                onChange={(e) => {
                  if (isMounted.current) {
                    setSelectedFilm(films[e.target.value]);
                    setFilmCharacters([]);
                    setFilters(initialFilters);
                  }
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
          )}
        </div>
      </section>
      <section id="content-section">
        <div className={`app-content`}>
          {/* Opening Crawl for selected movie */}
          {selectedFilm && (
            <div className="opening-crawl">
              <marquee direction="up" loop={"1"} scrollDelay={200} height={200}>
                <span>{selectedFilm.opening_crawl}</span>
              </marquee>
            </div>
          )}

          {/* Table for characters in selected movie */}
          {!filmCharacters?.length ? <img src={loader} alt="fetching movies" className="loader-gif" /> : (
            <Characters
              filters={filters}
              onFilter={setFilters}
              filmCharacters={filmCharacters}
              setFilmCharacters={setFilmCharacters}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
