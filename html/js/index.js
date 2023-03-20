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

$(() => {
	document.getElementById("timepickergo").value = getLocalTime();
	$('#timepickergo').datetimepicker({
		onSelect: eventTimeChange('onSelect'),
		controlType: 'select',
		timeFormat: "h:mm TT",
		timeInput: true,
		parse: "loose",
		alwaysSetTime: true
	});
})

function eventTimeChange() {
	return function () {
		calcTime(movieRunTime);
	};
}

function getLocalTime() {
	currentTime = new Date().toLocaleString();
	result = currentTime.replace(',', '');
	calcTime(movieRunTime);
	return result;
}

function calcTime(rt) {
	var timeValue = $('#timepickergo').datetimepicker('getDate');
	var calculatedtimeselector = document.getElementById("movieendtimeoutput");
	if (rt === void 0 && timeValue !== null) {
		null;
	} else if (rt !== void 0 && timeValue === null) {
		calculatedtimeselector.innerHTML = '<u>Select a time and try again!</u>';
	} else if (rt === void 0 && timeValue === null) {
		calculatedtimeselector.innerHTML = '<u>Select a movie and time and try again!</u>';
	} else if (rt === null && timeValue !== null) {
		calculatedtimeselector.innerHTML = '<u>Select a movie and try again!</u>';
	} else if (rt == 0 && timeValue !== null) {
		calculatedtimeselector.innerHTML = '<u>Run-time information missing from database.</u>'
	} else {
		calculatedtimeselector.innerHTML = addMinutes(timeValue, rt).toLocaleString();
	}
}

var timeConvert = (n) => {
	var minutes = n % 60;
	var hours = (n - minutes) / 60;
	var minutesPlurality;
	var hoursPlurality;
	minutes == 1 ? minutesPlurality = "minute" : minutesPlurality = "minutes";
	hours == 1 ? hoursPlurality = "hour" : hoursPlurality = "hours";
	return hours + " " + hoursPlurality + " and " + minutes + " " + minutesPlurality;
}

function addMinutes(date, minutes) {
	return movieEndTime = new Date(+date + minutes * 60000);
}

function setSystemtime() {
	document.getElementById("timepickergo").value = getLocalTime();
}

function copyToclip() {
	navigator.clipboard.writeText(window.location.hostname + "?id=" + currentMovieID);
}
/*
(async function initialLoadDetails() {
	const idParam = new URLSearchParams(window.location.search).get('id');
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
		updatePage(movie);
		calcTime(movieRunTime);
		return movie;
	};
})();*/

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
	document.getElementById("posterpathpre").style.background = a ? "url('" + "https://image.tmdb.org/t/p/original" + a + "')" : "url('./assets/images/noart250w.png')";
	document.getElementById("bgpre").style.background = b ? "url('" + "https://image.tmdb.org/t/p/original" + b + "') no-repeat center center fixed" : "url('./assets/images/hometheatrebg.jpg') no-repeat center center fixed";
}

async function updatePage(movie) {
	document.title = "Plan My Movie - " + movie.movieTitle;
	document.body.style.background = movie.backDropPath ? "url('" + "https://image.tmdb.org/t/p/original" + movie.backDropPath + "') no-repeat center center fixed" : "url('./assets/images/hometheatrebg.jpg') no-repeat center center fixed";
	document.body.style.backgroundSize = "cover";
	document.getElementById("displaypostercontainer").style.background = movie.posterPath ? "url('" + "https://image.tmdb.org/t/p/original" + movie.posterPath + "')" : "url('./assets/images/noart250w.png')";
	document.getElementById("displaypostercontainer").title = movie.movieTitle ? movie.movieTitle + " (" + movie.releaseDate + ")" : "No Movie Selected";
	document.getElementById("title").innerHTML = movie.movieTitle;
	document.getElementById("releasedate").innerHTML = "(" + movie.releaseDate + ")" + "<br><br>";
	document.getElementById("synopsis").innerHTML = movie.synoposis + "<br><br>";
	document.getElementById("selectedmoviecast").innerHTML = movie.movieCast;
	document.getElementById("displayrt").innerHTML = '<b>Movie Run-Time:</b> ' + timeConvert(movie.movieRunTime) + '<br><br>';
}

$(window).load(function () {
    $(".trigger_popup").click(function(){
       $('.hover_bkgr').show();
    });
    $('.hover_bkgr').click(function(){
        $('.hover_bkgr').hide();
    });
    $('.popupCloseButton').click(function(){
        $('.hover_bkgr').hide();
    });
});

