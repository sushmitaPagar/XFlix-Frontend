import React from "react";
import Button from "@mui/material/Button";
import "../css/Genre.css";

const Genre = ({allGenre, ageList, selectedGenres, age, sort, handleGenreChange, handleAgeChange, handleSortBy}) => {

    return (
        <>
        <div className="genre-panel">
            {/* Genres */}
            {allGenre.map((genre) => {
                return (
                    <Button
                        onClick={()=>handleGenreChange(genre)}
                        className={selectedGenres.includes(genre.value) 
                                        ? "genre-btn active-genre-btn" 
                                        : "genre-btn"}
                        key={genre.value}
                        >
                            {genre.label}
                        </Button>
                );
            })}
            {/* Sort By */}
            <select
                className="selectBox"
                value={sort}
                onChange={(e) => handleSortBy(e)}
                >
                <option value="releaseDate">Release Date</option>
                <option value="viewCount">View Count</option>
            </select>
        </div>
        <div className="genre-panel">
            {/* Age */}
            {ageList.map((eachAge) => {
                return (
                    <Button
                        onClick={()=>handleAgeChange(eachAge.value)}
                        className={age === eachAge.value 
                                        ? "genre-btn content-rating-btn active-genre-btn" 
                                        : "genre-btn content-rating-btn"}
                        key={eachAge.value}
                        >
                            {eachAge.label}
                        </Button>
                );
            })}
        </div>
        </>
    );
};

export default Genre;