function getFullMonth(ind) {
	switch(ind) {
		case 0:
			return "January";
			break;
		case 1:
			return "February";
			break;
		case 2:
			return "March";
			break;
		case 3:
			return "April";
			break;
		case 4:
			return "May";
			break;
		case 5:
			return "June";
			break;
		case 6:
			return "July";
			break;
		case 7:
			return "August";
			break;
		case 8:
			return "September";
			break;
		case 9:
			return "October";
			break;
		case 10:
			return "November";
			break;
		case 11:
			return "December";
			break;
	}
}

function convertISt12(localTime){
	const ISToffSet = 330; 
	const offset= ISToffSet*60*1000;
	var ISTdate = new Date(localTime+offset);
	var hrs = ISTdate.getHours();
	var mins = ISTdate.getMinutes();
	var date = ISTdate.getDate();
	var month = getFullMonth(ISTdate.getMonth());
	var year = ISTdate.getFullYear();
	if(hrs <= 9)
		hrs = '0' + hrs;
	if(mins < 10)
		mins = '0' + mins;
	var t24 = hrs + ':' + mins;

	var h1 = t24[0] - "0";
	var h2 = t24[1] - "0";

	var pt = "";
	var hh = h1 * 10 + h2;
	var meridian;
	if (hh < 12) {
		meridian = " AM";
	} else {
		meridian = " PM";
	}

	hh = hh % 12;
	if (hh === 0) {
		pt += "12";
	} else {
		pt += hh;
	}

	pt += ":";
	pt += t24[3];
	pt += t24[4];
	pt += meridian;
    pt += " " + date + " " + month + " " + year;
	return pt;
}

function getLikes() {
	var likes = Math.floor(Math.random() * 90000 + 1);
	return likes;
}

export { convertISt12, getLikes };
