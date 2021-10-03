$(function() {
	var $wrapper = $('#wrapper');
	// show current input values
	$('select.selectized,input.selectized', $wrapper).each(function() {
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
		function ajaxget(){
			var jsonresult = $.ajax({
				url: 'https://api.themoviedb.org/3/movie/' + $input.val() + '?api_key=3634a680b1c4dff46bdba60a88625d55&language=en-US',
				type: 'GET',
				dataType: 'jsonp',
				error: function() {
					console();
				},
				success: function(detailsresponse) {
					var movieruntime = detailsresponse.runtime;
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
	});
});