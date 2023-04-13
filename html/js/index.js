class MovieDetails {
	constructor(a, b, c, d, e, f, g, h) {
		this.currentMovieID = a;
		this.movieTitle = b;
		this.movieRunTime = c;
		this.posterPath = d;
		this.backDropPath = e;
		this.releaseDate = f;
		this.synoposis = g;
		this.movieCast = h;
	}
}

var currentMovieID;
var movieRunTime;
var currentTime;
var movieEndTime;
var movieSynopsis;
var movieTitle;
const pickedBG = chooseRandomBackdrop();

function setInitBackdrop() {
	try {
	document.body.style.background = "url('" + pickedBG.source + "') no-repeat center center fixed";
	document.getElementById("bgauthor").innerHTML = pickedBG.author;
	document.getElementById("service").innerHTML = pickedBG.service;
	document.getElementById("bgsource").href = pickedBG.originalloc; }
	catch {}
}

function copyToclip() {
	navigator.clipboard.writeText("https://" + window.location.hostname + "?id=" + currentMovieID);
}

async function loadDetails(id) {
	const idParam = id;
	if (idParam) {
		let detailsResponse = await getMovieDetails(idParam);
		let castResponse = await getMovieCast(idParam);
		const movie = new MovieDetails(
			detailsResponse.id,
			detailsResponse.title,
			detailsResponse.runtime,
			detailsResponse.poster_path,
			detailsResponse.backdrop_path,
			detailsResponse.release_date,
			detailsResponse.overview,
			castResponse
		);
		await preload(movie.posterPath, movie.backDropPath);
		currentMovieID = idParam;
		movieRunTime = detailsResponse.runtime;
		movieSynopsis = detailsResponse.overview;
		movieTitle = detailsResponse.title;
		await updatePage(movie);
		calcTime(movieRunTime);
	};
};

async function getMovieDetails(movieID) {
	const xhttpgetmovieurl = "https://api.planmymovie.com/3/movie/?id=" + movieID;
	let fetchmovieresponse = await fetch(xhttpgetmovieurl);
	let detailsResponse = await fetchmovieresponse.json();
	return detailsResponse;
}

async function getMovieCast(movieID) {
	const xhttpgetcreditsurl = "https://api.planmymovie.com/3/movie/credits/?id=" + movieID;
	let fetchmoviecast = await fetch(xhttpgetcreditsurl);
	let castResponse = await fetchmoviecast.json();
	try {
		castOutput = castResponse.cast[0].name + " as " + castResponse.cast[0].character + "<br>";

		for (var i = 1; i < 5 && i < castResponse.cast.length; i++) {
			castOutput = castOutput + castResponse.cast[i].name + (castResponse.cast[i].character != "" && castResponse.cast[i].character != null ? (" as " + castResponse.cast[i].character) : "") + "<br>";
		}
	} catch (e) {
		castOutput = "No Cast Information Available.";
	}
	return castOutput;
}

async function preload(a, b) {
	document.getElementById("posterpathpre").style.background = a ? "url('" + "https://image.tmdb.org/t/p/original" + a + "')" : "url('" + pickedBG.source + "')";
	document.getElementById("bgpre").style.background = b ? "url('" + "https://image.tmdb.org/t/p/original" + b + "') no-repeat center center fixed" : "url('" + pickedBG.source + "') no-repeat center center fixed";
}

async function updatePage(movie) {
	document.title = "Plan My Movie - " + movie.movieTitle;
	document.body.style.background = movie.backDropPath ? "url('" + "https://image.tmdb.org/t/p/original" + movie.backDropPath + "') no-repeat center center fixed" : "url('" + pickedBG.source + "') no-repeat center center fixed";
	document.body.style.backgroundSize = "cover";
	document.getElementById("displaypostercontainer").style.background = movie.posterPath ? "url('" + "https://image.tmdb.org/t/p/original" + movie.posterPath + "')" : "url('./assets/images/noart250w.png')";
	document.getElementById("displaypostercontainer").title = movie.movieTitle ? movie.movieTitle + " (" + movie.releaseDate + ")" : "No Movie Selected";
	document.getElementById("title").innerHTML = movie.movieTitle;
	document.getElementById("releasedate").innerHTML = "(" + movie.releaseDate + ")" + "<br><br>";
	document.getElementById("synopsis").innerHTML = movie.synoposis + "<br><br>";
	document.getElementById("cast").innerHTML = "Cast: "
	document.getElementById("selectedmoviecast").innerHTML = movie.movieCast;
	document.getElementById("displayrt").innerHTML = '<b>Movie Run-Time:</b> ' + timeConvert(movie.movieRunTime) + '<br><br>';
}

function chooseRandomBackdrop () {
	const initbackgrounds = {
		backgrounds: [
			{source: "./assets/images/backgrounds/1.jpg", author: "Jeremy Yap", originalloc: "https://unsplash.com/photos/J39X2xX_8CQ", service: "Unsplash"},
			{source: "./assets/images/backgrounds/2.jpg", author: "Chris Murray", originalloc: "https://unsplash.com/photos/iwfHhOZLVMU", service: "Unsplash"},
			{source: "./assets/images/backgrounds/3.jpg", author: "Denise Jans", originalloc: "https://unsplash.com/photos/Lq6rcifGjOU", service: "Unsplash"},
			{source: "./assets/images/backgrounds/4.jpg", author: "Felix Mooneeram", originalloc: "https://unsplash.com/photos/evlkOfkQ5rE", service: "Unsplash"},
			{source: "./assets/images/backgrounds/5.jpg", author: "Jakob Owens", originalloc: "https://unsplash.com/photos/CiUR8zISX60", service: "Unsplash"},
			{source: "./assets/images/backgrounds/6.jpg", author: "Kilyan Sockalingum", originalloc: "https://unsplash.com/photos/nW1n9eNHOsc", service: "Unsplash"},
			{source: "./assets/images/backgrounds/7.jpg", author: "Marius GIRE", originalloc: "https://unsplash.com/photos/VuN3x0cKC4I", service: "Unsplash"},
			{source: "./assets/images/backgrounds/8.jpg", author: "Myke Simon", originalloc: "https://unsplash.com/photos/atsUqIm3wxo", service: "Unsplash"},
			{source: "./assets/images/backgrounds/9.jpg", author: "Tyson Moultrie", originalloc: "https://unsplash.com/photos/BQTHOGNHo08", service: "Unsplash"}
		]
	}
	return initbackgrounds.backgrounds[getRndInteger(0, initbackgrounds.backgrounds.length)];
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
  }