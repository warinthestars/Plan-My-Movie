var currenttime;
var movieendtime;
var movieruntime;

function timeCheck() {
if (document.getElementById('currenttime').checked) {
	
	document.getElementById('localtime').style.display = 'block';
	document.getElementById('selectcustomtime').style.display = 'none';
	document.getElementById('displayrt').style.display = 'block';
	document.getElementById('calctime').style.display = 'block';
	document.getElementById('custcalctime').style.display = 'none';
//	document.getElementById("displayrt").innerHTML = 'Movie Run-Time: ' + '<br><br>';
	document.getElementById("localtime").innerHTML = 'Current Time: ' + getLocaltime() + '<br><br>';
	document.getElementById("calctime").innerHTML = 'Calculated Movie End Time: ' + '<br><br>';
	document.getElementById('select-movie').value = '';
	document.getElementById('buttonregcalc').style.display = 'block';
	document.getElementById('buttoncustcalc').style.display = 'none';
	console.log("current time: " + getLocaltime());
	console.log("selected movie runtime: " + movieruntime);
	
} else {
	document.getElementById('localtime').style.display = 'none';
	document.getElementById('calctime').style.display = 'none';
	document.getElementById('displayrt').style.display = 'block';
	document.getElementById('custcalctime').style.display = 'block';
	document.getElementById('selectcustomtime').style.display = 'block';
//	document.getElementById("displayrt").innerHTML = 'Movie Run-Time: ' + '<br><br>';
	document.getElementById('timepickergo').value = '';
	document.getElementById('custcalctime').innerHTML = 'Calculated Movie End Time:' + '<br><br>';
	document.getElementById('select-movie').value = '';
	document.getElementById('buttonregcalc').style.display = 'none';
	document.getElementById('buttoncustcalc').style.display = 'block';
	
}}

$(function() {
	
	var idforgetdetails;
	
	$('#select-movie').selectize({
		valueField: 'id',
		labelField: 'title',
		searchField: 'title',
		options: [],
		create: false,
		render: {
			option: function(item, escape) {
			
			var tmdbthumb;
			
			if (item.poster_path === null){
				tmdbthumb = "assets/images/noart.png";
			}else{
				tmdbthumb = "https://image.tmdb.org/t/p/w92" + item.poster_path;
			}
			
				return '<div>' +
					'<img src="' + escape(tmdbthumb) + '" alt="">' +
					'<span class="title">' +
						'<span class="name">' + escape(item.title + " " + "(" + item.release_date + ")") + '</span>' +
					'</span>' +
					'<span class="description">' + escape(item.overview || 'No synopsis available at this time.') + '</span>'
				'</div>';
			}
		},
		load: function(query, callback) {
			if (!query.length) return callback();
			$.ajax({
				url: 'https://api.planmymovie.com/3/search/movie/',
				type: 'GET',
				dataType: 'json',
				data: {
					query: query,
				},
				error: function() {
					callback();
				},
				success: function(res) {
					console.log(res.results);
					callback(res.results);
				}
			});
		}
	})
})

$(function() {
	
	var $wrapper = document.getElementById('#wrapper');
	// show current input values
	$('select.selectized,input.selectized', $wrapper).each(function() {
		console.log("Selectize Initialized")
		var $idcontainer = $('<div style="display:none">').addClass('value').html('Current Value: ');
		var $value = $('<span>').appendTo($idcontainer); 
		var $input = $(this);
		var update = function(e) { $value.text(JSON.stringify($input.val())); }
		$(this).on('change', update);
		update();
		$(this).on('change', ajaxget);

		$idcontainer.insertAfter($input);
		
		var $idforgetdetails = $value.text(JSON.stringify($input.val()));

		function ajaxget(){
			var jsonresult = $.ajax({
				url: 'https://api.planmymovie.com/3/movie/?id=' + $input.val(),
				type: 'GET',
				dataType: 'json',
				error: function() {
					console();
				},
				success: function(detailsresponse) {
					
					movietitle = detailsresponse.title;
					document.getElementById("selectedmoviename").innerHTML = movietitle;
					movieruntime = detailsresponse.runtime;
					if (detailsresponse.poster_path === null){
						posterpath = "assets/images/noart250w.png";
					}else{
						posterpath = "https://image.tmdb.org/t/p/w500" + detailsresponse.poster_path;
					}
					document.getElementById("selectedmovieposterimg").src=posterpath;
					releasedate = detailsresponse.release_date;
					document.getElementById("selectedmoviedate").innerHTML = releasedate;
					synoposis = detailsresponse.overview;
					document.getElementById("selectedmoviesynopsis").innerHTML = synoposis;
					
					console.log(detailsresponse);
					document.getElementById("displayrt").innerHTML = 'Movie Run-Time: ' + timeConvert(movieruntime) + '<br><br>';
					console.log("movie run time: " + movieruntime);
					
					
					
				}
			});
			var getcast = $.ajax({
				url: 'https://api.planmymovie.com/3/movie/credits/?id=' + $input.val(),
				type: 'GET',
				dataType: 'json',
				error: function() {
					console();
				},
				success: function(castresponse) {
					
					console.log(castresponse);

					var uhidk;
					
					try {
					uhidk = castresponse.cast[0].name + " as " + castresponse.cast[0].character + "<br>";
					
					for (var i=1; i<5 && i<castresponse.cast.length; i++) {
						uhidk = uhidk + castresponse.cast[i].name + " as " + castresponse.cast[i].character + "<br>";

					}
					
					
					} catch (e) {
						var uhidk = "No Cast Information Available.";
					}
					

					
					document.getElementById("selectedmoviecast").innerHTML = uhidk;
					
					
				}
			});
			
		}
	});
});

$(function() {
	$('#timepickergo').datetimepicker({
		controlType: 'select',
		timeFormat: "hh:mm tt"
	})
})

function getLocaltime(){
	currenttime = new Date();
	return currenttime.toLocaleString();
}

function calctimereg(){
	if (movieruntime===void 0) {
		document.getElementById("calctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a movie and try again!' + '<br><br>';
	}else{
		document.getElementById("calctime").innerHTML = 'Calculated Movie End Time: ' + addMinutes(currenttime, movieruntime).toLocaleString() + '<br><br>';
}}

function calctimecust(){

	var custtimevalue = $('#timepickergo').datetimepicker('getDate');
	
	if (movieruntime===void 0 && custtimevalue!==null) {
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a movie and try again!' + '<br><br>';
		console.log("movie runtime was " + movieruntime + " and entered custom time was " + custtimevalue); 
	}else if (custtimevalue===null && movieruntime!==void 0){
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a custom time and try again!' + '<br><br>';
		console.log("movie runtime was " + movieruntime + " and entered custom time was " + custtimevalue); 
	}else if (movieruntime===void 0 && custtimevalue===null){
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a movie and custom time and try again!' + '<br><br>';
		console.log("movie runtime was " + movieruntime + " and entered custom time was " + custtimevalue); 
	}else{
		
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + addMinutesCust(custtimevalue, movieruntime).toLocaleString() + '<br><br>';
}}

var timeConvert = function(n){
	var minutes = n%60;
	var hours = (n - minutes) / 60;
	return hours + " hour(s) and " + minutes + " minute(s)";
}

function addMinutes(date, minutes) {
	movieendtime = new Date(+date + minutes*60000);
	console.log("movie end time: " + movieendtime.toLocaleString());
	return movieendtime;
}

function addMinutesCust(date, minutes) {
	moviecustendtime = new Date(+date + minutes*60000);
	console.log("movie end time: " + moviecustendtime.toLocaleString());
	return moviecustendtime;
}