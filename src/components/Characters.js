import React from "react";
import {
  convertCMToFeet,
  convertFeetFractionToInches,
  sortAphabetically,
  sortNumerically,
} from "../lib/utils/utils";
import filter from "../assets/images/filter.svg";
export default function Characters({
  filters,
  onFilter,
  filmCharacters,
  setFilmCharacters,
}) {
  let sum = 0,
    characters = 0;

  const handleFilter = (filterParameter, sortedArray) => {
    setFilmCharacters(sortedArray);
    onFilter({...filters, [filterParameter]: !filters[filterParameter]});
  };

  const gender = [
    {type: "All", value: "all"},
    {type: "Female", value: "female"},
    {type: "Hermaphrodite", value: "hermaphrodite"},
    {type: "Male", value: "male"},
    {type: "N/A", value: "n/a"},
  ];

  return (
    <div className="content-table">
      <div className="gender-filter">
        <span>Filter by gender</span>
        <select
          onChange={({target}) =>
            onFilter((prevState) => ({
              ...prevState,
              gender: target.value,
            }))
          }
          value={filters.gender}
        >
          {gender.map(({type, value}, i) => (
            <option value={value} key={`${i}`}>{type}</option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th
              onClick={() =>
                handleFilter(
                  "isNameAscending",
                  sortAphabetically(
                    filters.isNameAscending,
                    filmCharacters,
                    "name"
                  )
                )
              }
            >
              Characters{" "}
              <img src={filter} alt="filter" className="filter-img" />
            </th>
            <th>Gender</th>
            <th
              onClick={() =>
                handleFilter(
                  "isHeightAscending",
                  sortNumerically(
                    filters.isHeightAscending,
                    filmCharacters,
                    "height"
                  )
                )
              }
            >
              Height <img src={filter} alt="filter" className="filter-img" />
            </th>
          </tr>
        </thead>
        <tbody>
          {filmCharacters.map(({name, gender, height}, i) => {
            if (filters.gender === "all" || filters.gender === gender) {
              characters += 1;
              return (
                <tr key={i}>
                  <td>{name}</td>
                  <td>{gender !== "n/a" ? gender[0].toUpperCase() : "-"}</td>
                  <td>{height}</td>
                </tr>
              );
            } else return null;
          })}
          <tr>
            <td></td>
            <td className="total-text">Count: {characters}</td>
            <td className="total-text">
              {filmCharacters.reduce((total, item) => {
                sum +=
                  filters.gender === "all" || filters.gender === item.gender
                    ? parseInt(item.height)
                    : 0;
                return `${sum}cm (${convertCMToFeet(
                  sum
                )}ft/${convertFeetFractionToInches(sum)}in)`;
              }, filmCharacters[0].height)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
