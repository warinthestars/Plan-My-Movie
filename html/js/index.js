var currentTime;
var movieEndTime;
var movieRunTime;
var currentMovieID = 683970; // hehe

$(function () {
	checkForURLParams();
})

$(function () {
	document.getElementById("timepickergo").value = getLocalTime();
})

$(function () {
	$('#select-movie').selectize({
		valueField: 'id',
		labelField: 'title',
		searchField: 'title',
		options: [],
		create: false,
		render: {
			option: function (item, escape) {

				var movieArt;

				if (item.poster_path === null) {
					movieArt = "assets/images/noart.png";
				} else {
					movieArt = "https://image.tmdb.org/t/p/w92" + item.poster_path;
				}

				return '<div>' +
					'<img src="' + escape(movieArt) + '" alt="">' +
					'<span class="title">' +
					'<span class="name">' + escape(item.title + " " + "(" + item.release_date + ")") + '</span>' +
					'</span>' +
					'<span class="description">' + escape(item.overview || 'No synopsis available at this time.') + '</span>' +
				'</div>';
			}
		},
		load: function (query, callback) {
			if (!query.length) return callback();
			$.ajax({
				url: 'https://api.planmymovie.com/3/search/movie/',
				type: 'GET',
				dataType: 'json',
				data: {
					query: query,
				},
				error: function () {
					callback();
				},
				success: function (res) {
					console.log(res.results);
					callback(res.results);
				}
			});
		}
	})
})

$(function () {

	var $wrapper = document.getElementById('#wrapper');
	// show current input values
	$('select.selectized,input.selectized', $wrapper).each(function () {
		console.log("Selectize Initialized")
		var $idcontainer = $('<div style="display:none">').addClass('value').html('Current Value: '); // TO-DO: Remove this line without breaking everything
		var $value = $('<span>').appendTo($idcontainer);
		var $input = $(this);
		var update = function (e) { $value.text(JSON.stringify($input.val())); }
		$(this).on('change', update);
		update();
		$(this).on('change', getMovieDetails);

		$idcontainer.insertAfter($input);

		$value.text(JSON.stringify($input.val()));

		// TO-DO: Merge internal "getMovieDetails" and global "getMovieDetails" into one function
		function getMovieDetails() {
			$.ajax({
				url: 'https://api.planmymovie.com/3/movie/?id=' + $input.val(),
				type: 'GET',
				dataType: 'json',
				error: function () {
					console();
				},
				success: function (detailsResponse) {
					
					currentMovieID = detailsResponse.id;
					movietitle = detailsResponse.title;
					document.getElementById("selectedmoviename").innerHTML = movietitle;
					movieRunTime = detailsResponse.runtime;
					if (detailsResponse.poster_path === null) {
						posterpath = "assets/images/noart250w.png";
					} else {
						posterpath = "https://image.tmdb.org/t/p/w500" + detailsResponse.poster_path;
					}
					document.getElementById("selectedmovieposterimg").src = posterpath;
					if (detailsResponse.backdrop_path === null) {
						backdroppath = "assets/images/hometheatrebg.jpg";
					} else {
						backdroppath = "https://image.tmdb.org/t/p/original" + detailsResponse.backdrop_path;
						document.body.style.background = "url('" + backdroppath + "') no-repeat center";
					}
					console.log("backdrop path is" + backdroppath);
					releasedate = detailsResponse.release_date;
					document.getElementById("selectedmoviedate").innerHTML = releasedate;
					synoposis = detailsResponse.overview;
					document.getElementById("selectedmoviesynopsis").innerHTML = synoposis;

					console.log(detailsResponse);
					document.getElementById("displayrt").innerHTML = 'Movie Run-Time: ' + timeConvert(movieRunTime) + '<br><br>';
					console.log("movie run time: " + movieRunTime);
				}
			});
			$.ajax({
				url: 'https://api.planmymovie.com/3/movie/credits/?id=' + $input.val(),
				type: 'GET',
				dataType: 'json',
				error: function () {
					console();
				},
				success: function (castresponse) {

					console.log(castresponse);

					var castInfo;

					try {
						castInfo = castresponse.cast[0].name + " as " + castresponse.cast[0].character + "<br>";

						for (var i = 1; i < 5 && i < castresponse.cast.length; i++) {
							castInfo = castInfo + castresponse.cast[i].name + " as " + castresponse.cast[i].character + "<br>";

						}

					} catch (e) {
						var castInfo = "No Cast Information Available.";
					}

					document.getElementById("selectedmoviecast").innerHTML = castInfo;

				}
			});

		}
	});
});

$(function () {
	$('#timepickergo').datetimepicker({
		controlType: 'select',
		timeFormat: "h:mm TT",
		timeInput: true,
		parse: "loose",
		alwaysSetTime: true

	})
})

function getLocalTime() {
	currentTime = new Date().toLocaleString();
	result = currentTime.replace(',', '');
	return result;
}

function calcTime() {

	var timeValue = $('#timepickergo').datetimepicker('getDate');

	if (movieRunTime === void 0 && timeValue !== null) {
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a movie and try again!' + '<br><br>';
		console.log("movie runtime was " + movieRunTime + " and entered custom time was " + timeValue);
	} else if (timeValue === null && movieRunTime !== void 0) {
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a time and try again!' + '<br><br>';
		console.log("movie runtime was " + movieRunTime + " and entered custom time was " + timeValue);
	} else if (movieRunTime === void 0 && timeValue === null) {
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a movie and time and try again!' + '<br><br>';
		console.log("movie runtime was " + movieRunTime + " and entered custom time was " + timeValue);
	} else {
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + addMinutes(timeValue, movieRunTime).toLocaleString() + '<br><br>';
	}
}

var timeConvert = function (n) {
	var minutes = n % 60;
	var hours = (n - minutes) / 60;
	var minutesPlurality;
	var hoursPlurality;
	if (minutes == 1) {
		minutesPlurality = "minute"
	} else {
		minutesPlurality = "minutes"
	}
	if (hours == 1) {
		hoursPlurality = "hour"
	} else {
		hoursPlurality = "hours"
	}
	return hours + " " + hoursPlurality + " and " + minutes + " " + minutesPlurality;
}

function addMinutes(date, minutes) {
	movieEndTime = new Date(+date + minutes * 60000);
	console.log("movie end time: " + movieEndTime.toLocaleString());
	return movieEndTime;
}

function setSystemtime() {
	document.getElementById("timepickergo").value = getLocalTime();
}

function copyToclip() {
	navigator.clipboard.writeText("https://dev.planmymovie.com/?id=" + currentMovieID);
	console.log(currentMovieID);
}

function checkForURLParams() {
	var urlForIdParam = window.location.search;
	var urlParams = new URLSearchParams(urlForIdParam);
	var idParam = urlParams.get('id');
	console.log(idParam);
	getMovieDetails(idParam);
}

function getMovieDetails(id) {
	$.ajax({
		url: 'https://api.planmymovie.com/3/movie/?id=' + id,
		type: 'GET',
		dataType: 'json',
		success: function (detailsResponse) {
			
			currentMovieID = detailsResponse.id;
			movietitle = detailsResponse.title;
			document.getElementById("selectedmoviename").innerHTML = movietitle;
			movieRunTime = detailsResponse.runtime;
			if (detailsResponse.poster_path === null) {
				posterpath = "assets/images/noart250w.png";
			} else {
				posterpath = "https://image.tmdb.org/t/p/w500" + detailsResponse.poster_path;
			}
			document.getElementById("selectedmovieposterimg").src = posterpath;
			if (detailsResponse.backdrop_path === null) {
				backdroppath = "assets/images/hometheatrebg.jpg";
			} else {
				backdroppath = "https://image.tmdb.org/t/p/original" + detailsResponse.backdrop_path;
				document.body.style.background = "url('" + backdroppath + "') no-repeat center fixed";
				document.body.style.backgroundSize = "contain";
			}
			console.log("backdrop path is" + backdroppath);
			releasedate = detailsResponse.release_date;
			document.getElementById("selectedmoviedate").innerHTML = releasedate;
			synoposis = detailsResponse.overview;
			document.getElementById("selectedmoviesynopsis").innerHTML = synoposis;

			console.log(detailsResponse);
			document.getElementById("displayrt").innerHTML = 'Movie Run-Time: ' + timeConvert(movieRunTime) + '<br><br>';
			console.log("movie run time: " + movieRunTime);
		}
	});
	$.ajax({
		url: 'https://api.planmymovie.com/3/movie/credits/?id=' + id,
		type: 'GET',
		dataType: 'json',
		success: function (castresponse) {

			console.log(castresponse);

			var uhidk;

			try {
				uhidk = castresponse.cast[0].name + " as " + castresponse.cast[0].character + "<br>";

				for (var i = 1; i < 5 && i < castresponse.cast.length; i++) {
					uhidk = uhidk + castresponse.cast[i].name + " as " + castresponse.cast[i].character + "<br>";

				}

			} catch (e) {
				var uhidk = "No Cast Information Available.";
			}

			document.getElementById("selectedmoviecast").innerHTML = uhidk;

		}
	})
};