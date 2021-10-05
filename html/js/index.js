function timeCheck() {
if (document.getElementById('currenttime').checked) {
	document.getElementById('localtime').style.display = 'block';
	document.getElementById('custtime').style.display = 'none';
	document.getElementById('calctime').style.display = 'block';
	document.getElementById('calctimecust').style.display = 'none';

} else {
	document.getElementById('localtime').style.display = 'none';
	document.getElementById('custtime').style.display = 'block';
	document.getElementById('calctime').style.display = 'none';
	document.getElementById('calctimecust').style.display = 'block';
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
				url: 'https://api.themoviedb.org/3/search/movie?api_key=3634a680b1c4dff46bdba60a88625d55&language=en-US&include_adult=false',
				type: 'GET',
				dataType: 'jsonp',
				data: {
					query: query,
					page_limit: 10,
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
		console.log("aaaaaaa")
		var $idcontainer = $('<div>').addClass('value').html('Current Value: ');
		var $value = $('<span>').appendTo($idcontainer);
		var $input = $(this);
		var update = function(e) { $value.text(JSON.stringify($input.val())); }
		$(this).on('change', update);
		update();
		$(this).on('change', ajaxget);

		$idcontainer.insertAfter($input);
		
		var $idforgetdetails = $value.text(JSON.stringify($input.val()));
		var currenttime;
		var movieendtime;
		var movieruntime;

		function ajaxget(){
			var jsonresult = $.ajax({
				url: 'https://api.themoviedb.org/3/movie/' + $input.val() + '?api_key=3634a680b1c4dff46bdba60a88625d55&language=en-US',
				type: 'GET',
				dataType: 'jsonp',
				error: function() {
					console();
				},
				success: function(detailsresponse) {
					movieruntime = detailsresponse.runtime;
					console.log(detailsresponse);
					document.getElementById("displayrt").innerHTML = 'Movie Run-Time: ' + timeConvert(movieruntime);
					console.log("movie run time: " + movieruntime);
					document.getElementById("localtime").innerHTML = 'Current Time: ' + getLocaltime();
					console.log("current time: " + getLocaltime());
					document.getElementById("calctime").innerHTML = 'Calculated Movie End Time: ' + addMinutes(currenttime, movieruntime).toLocaleString();
				}
			});
		}
		
		var timeConvert = function(n){
			var minutes = n%60;
			var hours = (n - minutes) / 60;
			return hours + " hour(s) and " + minutes + " minute(s)";
		}
		
		function getLocaltime(){
			currenttime = new Date();
			return currenttime.toLocaleString();
		}
		
		function addMinutes(date, minutes) {
			movieendtime = new Date(+date + minutes*60000);
			console.log("movie end time: " + movieendtime.toLocaleString());
			return movieendtime;
		}
		
		function addMinutesCust(date, minutes) {
			movieendtime = new Date(+date + minutes*60000);
			console.log("movie end time: " + movieendtime.toLocaleString());
			document.getElementById("calctimecust").innerHTML = 'Calculated Movie End Time: ' + addMinutes(currenttime, movieruntime).toLocaleString();
		}
	});
});

$(function() {
	$('#timepickergo').datetimepicker({
		controlType: 'select',
		timeFormat: 'hh:mm tt'
	})
})