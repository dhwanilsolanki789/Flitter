function t12(t24) {
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
	return pt;
}

function getLikes() {
	var likes = Math.floor(Math.random() * 90000 + 1);
	return likes;
}

export { t12, getLikes };
