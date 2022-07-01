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
var	currentTime;
var movieEndTime;
var settings = {
	onInitialize: function() {
		initialBlah();
	},
	onChange: eventHandleChange('onChange'),
	onDelete: function() {
		document.getElementById("display-poster").src = "./assets/images/noart250w.png";
		document.getElementById("display-poster").title = "No Movie Selected.";
		document.body.style.background = "url('./assets/images/hometheatrebg.jpg') no-repeat center center fixed";
		document.getElementById("selectedmoviecast").innerHTML = "";
		document.getElementById("displayrt").innerHTML = '<b>Movie Run-Time:</b><br><br> ';
		movieRunTime = null;
	},
	valueField: 'id',
	labelField: 'title',
	searchField: 'title',
	create: false,
	persist: false,
	maxItems: 1,
	load: function (query, callback) {
		if (!query.length) {
			return callback();
		} else {
			var url = "https://api.planmymovie.com/3/search/movie/" + encodeURIComponent(query);
			fetch(url)
				.then(response => response.json())
				.then(json => {
					callback(json.items);
				}).catch(()=>{
					callback();
				});
		}
	},
	// custom rendering functions for options and items
	render: {
		option: 
			function(item) {
				return '' +
					'<div class="row border-bottom py-4 clearfix">' +
						'<div class="col-md-1">' +
							'<img class="img-fluid" id="selectedart" src="' + (!item.poster_path ? './assets/images/noart.png' : 'https://image.tmdb.org/t/p/w92' + item.poster_path) + '"/>' + 
						'</div>' + 
						'<div class="col-md-11">' +
							'<div class="mt-0 d-inline"><b>' + item.title + '</b>' +
								'<span class="small text-muted"> (' + item.release_date + ')</span>' +
							'</div>' +
							'<div class="mb-1">' + (!item.overview ? 'No synopsis available at this time.' : item.overview) + '</div>' +
						'</div>' +
					'</div>';
		},
		item: 
			function(item) {
				movieRunTime = item.runtime;
				currentMovieID = item.id;
				return '' +
				'<div class="row border-bottom py-2">' +
					'<div class="col-lg-4">' +
						'<div class="mt-0"><b>' + item.title + '</b>' +
							'<span class="small text-muted"> (' + item.release_date + ')</span>' +
						'</div>' +
						'<div class="mb-1">' + (!item.overview ? 'No synopsis available at this time.' : item.overview) + '</div>' +
					'</div>' +
				'</div>';
			}
	}
};

async function getMovies(url, query) {
	await fetch(url, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
		},
		data: {
			query: query,
		},
	});
}

function eventHandleChange(name) {
	return function() {
		console.log(name, arguments[0]);
		(JSON.stringify(arguments[0]));
		currentMovieID = arguments[0] ? arguments[0]:"";
		console.log(currentMovieID);
		blah(arguments[0] ? arguments[0]:"");
	};
}

$(() => {
	$('#timepickergo').datetimepicker({
		onSelect: eventTimeChange('onSelect'),
		controlType: 'select',
		timeFormat: "h:mm TT",
		timeInput: true,
		parse: "loose",
		alwaysSetTime: true
	});
	document.getElementById("timepickergo").value = getLocalTime();
})

var eventTimeChange = function() {
	return function() {
		calcTime(movieRunTime);
	}
}

function getLocalTime() {
	currentTime = new Date().toLocaleString();
	result = currentTime.replace(',', '');
	calcTime(movieRunTime);
	return result;
}

function calcTime(rt) {
	console.log("calc time ran");
	console.log(rt);
	var timeValue = $('#timepickergo').datetimepicker('getDate');
	var calctimeselector = document.getElementById("custcalctime");
	calctimeselector.innerHTML = '<b>Calculated Movie End Time:</b> ';

	if (rt === void 0 && timeValue !== null) {
		null;
	} else if (rt !== void 0 && timeValue === null) {
		calctimeselector.innerHTML += 'Select a time and try again!';
	} else if (rt === void 0 && timeValue === null) {
		calctimeselector.innerHTML += 'Select a movie and time and try again!';
	} else if (rt === null && timeValue !== null) {
		calctimeselector.innerHTML += 'Select a movie and try again!';
	} else if (rt === "" && timeValue !== null) {
		calctimeselector.innerHTML += 'Run-time information missing from database.'
	} else {
		calctimeselector.innerHTML += addMinutes(timeValue, rt).toLocaleString();
	}
	calctimeselector.innerHTML += '<br><br>';
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

async function initialBlah () {
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
		currentMovieID = idParam;
		movieRunTime = detailsResponse.runtime;
		select.addOption(currentMovieID);
		updatePage(movie);
		calcTime(movieRunTime);
		return movie;
	};
};

async function blah (id) {
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
		currentMovieID = idParam;
		movieRunTime = detailsResponse.runtime;
		updatePage(movie);
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
				castOutput = castOutput + castResponse.cast[i].name + (castResponse.cast[i].character != "" && castResponse.cast[i].character != null ? (" as " + castResponse.cast[i].character):"") + "<br>";
			}

		} catch (e) {
			castOutput = "No Cast Information Available.";
		}

	return castOutput;

}

function updatePage(movie) {
	/*
	document.getElementById("selectedmoviename").innerHTML = movie.movieTitle;
	document.getElementById("selectedmoviedate").innerHTML = movie.releaseDate;
	document.getElementById("selectedmoviesynopsis").innerHTML = movie.synoposis ? movie.synoposis:"No synopsis available at this time."; */
	document.getElementById("display-poster").src = movie.posterPath ? "https://image.tmdb.org/t/p/original" + movie.posterPath:"./assets/images/noart250w.png";
	document.getElementById("display-poster").title = movie.movieTitle ? movie.movieTitle + " (" + movie.releaseDate + ")":"No Movie Selected";
	document.getElementById("displayrt").innerHTML = '<b>Movie Run-Time:</b> ' + timeConvert(movie.movieRunTime) + '<br><br>';
	document.getElementById("selectedmoviecast").innerHTML = movie.movieCast;
	document.body.style.background = movie.backDropPath ? "url('" + "https://image.tmdb.org/t/p/original" + movie.backDropPath + "') no-repeat center center fixed":"url('./assets/images/hometheatrebg.jpg') no-repeat center center fixed";
	document.body.style.backgroundSize = "cover";
}