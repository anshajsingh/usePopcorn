import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const key = "af403830";

const tempMovieData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
	},
	{
		imdbID: "tt0133093",
		Title: "The Matrix",
		Year: "1999",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
	},
	{
		imdbID: "tt6751668",
		Title: "Parasite",
		Year: "2019",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
	},
];

const tempWatchedData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		Runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: "tt0088763",
		Title: "Back to the Future",
		Year: "1985",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		Runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


export default function App() {
	//const [movies, setMovies] = useState([]);
	// const [watched, setWatched] = useState(function () {
	// 	const storedValue = localStorage.getItem("watched");
	// 	return storedValue ? JSON.parse(storedValue) : [];
	// });

	const [watched, setWatched] = useLocalStorageState("watched", []);

	//const [loading, setLoading] = useState(false);
	//const [error, setError] = useState(null);
	const [selectedMovie, setSelectedMovie] = useState(null);

	// useEffect(function () {
	// 	fetch(`https://www.omdbapi.com/?s=batman&apikey=${key}`)
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			console.log(data);
	// 			setMovies(data.Search);
	// 		});
	// }, []); will be triggered only once when the component mounts ie during the initial render

	const [query, setQuery] = useState("batman");

	const { movies, loading, error } = useMovies({ query });

	function handleQueryChange(newQuery) {
		setQuery(newQuery);
	}

	function handleCloseSelectedMovie() {
		setSelectedMovie(null);
	}

	function handleSelectMovie(movie) {
		setSelectedMovie(movie);
	}

	function handleWatchMovie(movie) {
		setWatched((watched) => [...watched, movie]);
		setSelectedMovie(null);
	}

	function handleDeleteMovie(imdbID) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== imdbID));
	}

	useEffect(
		function () {
			localStorage.setItem("watched", JSON.stringify(watched));
		},
		[watched],
	);


	return (
		<>
			<Navbar>
				<Search query={query} onKeyDown={handleQueryChange} />
				<FoundMovies movies={movies} />
			</Navbar>
			<Main>
				<Box movies={movies}>
					{loading && error === null ? (
						<Loader />
					) : error ? (
						<Error message={error} />
					) : (
						<MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
					)}
				</Box>
				<Box>
					{selectedMovie ? (
						<SelectedMovies
							selectedMovie={selectedMovie}
							watched={watched}
							onClose={handleCloseSelectedMovie}
							handleWatchMovie={handleWatchMovie}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMovieList watched={watched} onDelete={handleDeleteMovie} />
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function Loader() {
	return <div className="loader">Loading...</div>;
}

function Error({ message }) {
	return <p className="error">{message}</p>;
}

function Main({ children }) {
	return <main className="main">{children}</main>;
}

function Navbar({ children }) {
	return (
		<nav className="nav-bar">
			<Logo />
			{children}
		</nav>
	);
}

function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

function FoundMovies({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies?.length ?? 0}</strong> results
		</p>
	);
}

function Search({ query, onKeyDown }) {
	//const [query, setQuery] = useState("");
	const inputEl = useRef();

	useKey("Enter", function () {
		if (document.currentElement === inputEl.current)
			return;
		inputEl.current.focus();
		onKeyDown("");
	});

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => onKeyDown(e.target.value)}
			ref={inputEl}
		/>
	);
}

function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? "–" : "+"}
			</button>
			{isOpen && children}
		</div>
	);
}

function WatchedSummary({ watched }) {
	const avgImdbRating = average(
		watched.map((movie) => Number(movie.imdbRating).toFixed(1)),
	);
	const avgUserRating = average(
		watched.map((movie) => Number(movie.userRating)),
	);
	const avgRuntime = average(
		watched.map((movie) => movie.Runtime.split(" ")[0]),
	);
	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(1)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(1)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime.toFixed(1)} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedMovieList({ watched, onDelete }) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie key={movie.imdbID} movie={movie} onDelete={onDelete} />
			))}
		</ul>
	);
}

function WatchedMovie({ movie, onDelete }) {
	return (
		<li key={movie.imdbID}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.Runtime} min</span>
				</p>
				<button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
					&times;
				</button>
			</div>
		</li>
	);
}

function MovieList({ movies, handleSelectMovie }) {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie
					key={movie.imdbID}
					movie={movie}
					handleSelectMovie={handleSelectMovie}
				/>
			))}
		</ul>
	);
}

function Movie({ movie, handleSelectMovie }) {
	return (
		<li onClick={() => handleSelectMovie(movie)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

function SelectedMovies({ selectedMovie, onClose, handleWatchMovie, watched }) {
	const [movieDetails, setSelectedMovieDetails] = useState("");
	const [userRating, setUserRating] = useState(0);
	const [error, setError] = useState(null);

	const countRef = useRef(0);

	function handleRatingChange(rating) {
		setUserRating(rating);
	}

	const isWatched = watched.some(
		(movie) => movie.imdbID === selectedMovie.imdbID,
	);

	const id = selectedMovie?.imdbID;

	useEffect(function () {
		if(userRating) {
			countRef.current += 1;
		}
	}, [userRating]);

	useKey("Escape", onClose);


	useEffect(
		function () {
			if (!selectedMovie) return;
			async function fetchSelectedMovieDetails() {
				const response = await fetch(
					`https://www.omdbapi.com/?i=${id}&apikey=${key}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch movie details");
				}
				const data = await response.json();
				if (data.Response === "True") {
					setSelectedMovieDetails(data);
					console.log("Selected movie details:", data);
				} else {
					console.error("Movie not found:", data.Error);
				}
			}
			fetchSelectedMovieDetails();
		},
		[id, selectedMovie],
	);

	useEffect(function () {
		document.title = `${selectedMovie?.Title ?? "Movie Details"} | usePopcorn`;
		return function () {
			document.title = "usePopcorn";
		}
	}, [selectedMovie])

	useEffect(() => {
		setUserRating(0); // <=== Reset rating whenever a new movie is selected
	}, [selectedMovie]);

	if (!selectedMovie) return null;

	const movieDetailsFinal = { ...movieDetails, userRating: userRating, ratingCount: countRef.current };

	return (
		<div className="details">
			<header>
				<button className="btn-back" onClick={onClose}>
					&times;
				</button>
				<img
					src={movieDetails.Poster}
					alt={`${movieDetailsFinal.Title} poster`}
				/>
				<div className="details-overview">
					<h2>{movieDetails.Title}</h2>
					<p>Year: {movieDetails.Year}</p>
					<p>Imdb Rating ⭐️{movieDetails.imdbRating}</p>
				</div>
			</header>
			<section>
				<p className="details-runtime">Cast: {movieDetails.Actors}</p>

				{isWatched ? (
					<p>
						Already watched — your rating: 🌟{" "}
						{
							watched.find((movie) => movie.imdbID === selectedMovie.imdbID)
								?.userRating
						}
					</p>
				) : (
					<>
						<StarRating
							userRating={userRating}
							onRatingChange={handleRatingChange}
							key={selectedMovie.imdbID}
						/>
					</>
				)}

				<p className="details-overview">Plot: {movieDetails.Plot}</p>
				<p className="details-overview">
					Previous Rating: ⭐️
					{movieDetails.ratingCount} </p>
				<button
					className="btn-add"
					onClick={() => handleWatchMovie(movieDetailsFinal)}
				>
					Add to Watch list
				</button>
			</section>
		</div>
	);
}
