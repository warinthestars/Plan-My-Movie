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
	document.body.style.background = "url('" + pickedBG.source + "') no-repeat center center fixed";
	document.getElementById("bgauthor").innerHTML = pickedBG.author;
	document.getElementById("service").innerHTML = pickedBG.service;
	document.getElementById("bgsource").href = pickedBG.originalloc;
}

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
		calculatedtimeselector.innerHTML = (addMinutes(timeValue, rt).toLocaleString()).toString();
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

function getEvent(type) {
	let calCurrDateAndTime = $('#timepickergo').datetimepicker('getDate');
	let calCurrDate = (calCurrDateAndTime.toISOString().split('T')[0]).replace(/-/g, '');
	let calCurrTime = ((calCurrDateAndTime.toISOString().split('T')[1]).replace(/:/g, '')).replace(/\./, '');
	let calEndDateAndTime = addMinutes(calCurrDateAndTime, movieRunTime);
	let calEndDate = (calEndDateAndTime.toISOString().split('T')[0]).replace(/-/g, '');
	let calEndTime = ((calEndDateAndTime.toISOString().split('T')[1]).replace(/:/g, '')).replace(/\./, '');

	switch (type) {
		case "gcal":
			window.open(new URL("https://calendar.google.com/calendar/render?action=TEMPLATE&dates=" + calCurrDate + "T" + calCurrTime + "%2F" + calEndDate + "T" + calEndTime + "&details=" + movieSynopsis + "&text=" + movieTitle), '_blank');
			break;
		case "outlook":
			let outlookCurrTime = (calCurrDateAndTime.toISOString().split('T')[1]).replace(/\./, '');
			let outlookEndTime = (calEndDateAndTime.toISOString().split('T')[1]).replace(/\./, '');
			window.open(new URL("https://outlook.live.com/calendar/0/deeplink/compose?allday=false&body=" + movieSynopsis + "&enddt=" + (calEndDateAndTime.toISOString().split('T')[0]) + "T" + outlookEndTime.split(':')[0] + "%3A" + outlookEndTime.split(':')[1] + "%3A00%2B00%3A00&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=" + (calCurrDateAndTime.toISOString().split('T')[0]) + "T" + outlookCurrTime.split(':')[0] + "%3A" + outlookCurrTime.split(':')[1] + "%3A00%2B00%3A00&subject=" + movieTitle), "_blank");
			break; 
		case "yahoo":
			window.open(new URL("https://calendar.yahoo.com/?desc=" + movieSynopsis + "&dur=&et=" + calEndDate + "T" + calEndTime + "&st=" + calCurrDate + "T" + calCurrTime + "&title=" + movieTitle + "&v=60"), '_blank');
			break;
		case "ical":
			var cal = ics();
			cal.addEvent(movieTitle, movieSynopsis, "", calCurrDateAndTime.toISOString(), calEndDateAndTime.toISOString());
			cal.download("itismovietimemydudes")
			break;
	}
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