var DateTime = luxon.DateTime;

const fp = flatpickr(document.querySelector("#timepickergo"), {
    onValueUpdate: () => {
        calcTime(movieRunTime);
    },
    enableTime: true,
    dateFormat: "Y-m-d h:i K",
    defaultDate: new Date()
});  // flatpickr

function eventTimeChange() {
	return function () {
		calcTime(movieRunTime);
	};
}

function calcTime(rt) {
	var timeValue = fp.selectedDates;
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
		let calculatedTime = addMinutes(timeValue, rt);
        let userFriendlyTime = calculatedTime.toLocaleString(DateTime.DATETIME_FULL);
        calculatedtimeselector.innerHTML = userFriendlyTime;
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

function setSystemtime() {
	fp.setDate(new Date(), true);
    calcTime(movieRunTime);
}

function addMinutes(date, min) {
    let thedate = new Date(date);
    let isodate = thedate.toISOString();
    let start = DateTime.fromISO(isodate);
    let result = start.plus({minutes: min});
    return result;
}

function getEvent(type) {
	let calCurrDateAndTime = new Date(fp.selectedDates);
	let calCurrDate = (calCurrDateAndTime.toISOString().split('T')[0]).replace(/-/g, '');
	let calCurrTime = ((calCurrDateAndTime.toISOString().split('T')[1]).replace(/:/g, '')).replace(/\./, '');
	let calEndDateAndTimeRaw = new Date(addMinutes(calCurrDateAndTime, movieRunTime));
    let calEndDateAndTime = new Date(calEndDateAndTimeRaw.toLocaleString(DateTime.DATETIME_FULL));
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