var defines = {}
defines.API_USERNAME = 'cse3213';
defines.API_PASSWORD = 'test';
defines.BASE_PATH = '/gsas';
defines.AGGIES = 1;
defines.MAROONS = 2;
defines.COWBELLS = 3;
defines.BULLDOGS = 4;
defines.DRIVER = 1;
defines.THREE_WOOD = 2;
defines.FOUR_WOOD = 3;
defines.FIVE_WOOD = 4;
defines.SEVEN_WOOD = 5;
defines.NINE_WOOD = 6;
defines.TWO_HYBRID = 7;
defines.THREE_HYBRID = 8;
defines.FOUR_HYBRID = 9;
defines.FIVE_HYBRID = 10;
defines.SIX_HYBRID = 11;
defines.TWO_IRON = 12;
defines.THREE_IRON = 13;
defines.FOUR_IRON = 14;
defines.FIVE_IRON = 15;
defines.SIX_IRON = 16;
defines.SEVEN_IRON = 17;
defines.EIGHT_IRON = 18;
defines.NINE_IRON = 19;
defines.PW = 20;
defines.AW = 21;
defines.SW = 22;
defines.LW = 23;
defines.HLW = 24;

function ajaxErrorHandler(f, data, textStatus, xhr)
{
	// eventually send an email to report the error
	alert('An unknown error occured.s');
}

/****************************************************************************
 *
 *
 * Course
 *
 *
 ****************************************************************************/

function Course(data)
{
	if (typeof(data) === 'undefined') data = null;

	this.ID = null;
	this.name = null;
	this.location = null;

	// constructor
	if (data) this.load(data);
}

Course.prototype.load = function(data)
{
	if (!data) return true;

	var thisCourse = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/courses/" + data,
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				ret = false;
				alert('This course does not exist.');
			} else {
				thisCourse.ID = data.course.id;
				thisCourse.name = data.course.name;
				thisCourse.location = data.course.location;
				ret = false;
			}
		},
		error: function(data, textStatus, xhr) {
			ret = null;
			ajaxErrorHandler('courseLoad', data, textStatus, xhr);
		}
	});

	return ret;
}

Course.prototype.save = function()
{
	var thisCourse = this;
	var ret = true;

	if (this.ID) {
		// update
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/courses/" + this.ID,
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					ret = false;
					alert('This course does not exist.');
				} else {
					thisCourse.ID = data.course.id;
					thisCourse.name = data.course.name;
					thisCourse.location = data.course.location;
					ret = true;
				}
			},
			error: function(data, textStatus, xhr) {
				ret = false;
				ajaxErrorHandler('courseSave', data, textStatus, xhr);
			}
		});
	} else {
		// insert
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/courses/",
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				thisCourse.ID = data.course.id;
				thisCourse.name = data.course.name;
				thisCourse.location = data.course.location;
				ret = true;
			},
			error: function(data, textStatus, xhr) {
				ret = false;
				ajaxErrorHandler('courseSave', data, textStatus, xhr);
			}
		});
	}

	return ret;
}

Course.prototype.del = function()
{	
	if (!this.ID) return false;

	var thisCourse = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/courses/destroy/" + this.ID,
		type: "POST",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				ret = false;
				alert('This Course does not exist');
			}
			thisCourse.ID = data.course.id;
			thisCourse.name = data.course.name;
			thisCourse.location = data.course.location;

			ret = true;
		},
		error: function(data, textStatus, xhr) {
			ret = false;
			ajaxErrorHandler('courseDelete', data, textStatus, xhr);
		}
	});

	return ret;
}

Course.prototype.export = function()
{
	var courseObject = 
	{"course":
		{
			"id": this.ID,
			"name": this.name,
			"location": this.location
		}
	};

	return courseObject;
}

function CourseGetAll()
{
	var courses = new Array();

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/courses/",
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			for (var i = 0; i < data.courses.length; i++) {
				var c = new Course();
				c.ID = data.courses[i].course.id;
				c.name = data.courses[i].course.name;
				c.location = data.courses[i].course.location;
				courses.push(c);
			}
		},
		error: function(data, textStatus, xhr) {
			ajaxErrorHandler('courseGetAll', data, textStatus, xhr);
		}
	});

	return courses;
}

/****************************************************************************
 *
 *
 * User
 *
 *
 ****************************************************************************/

function User(data)
{
	if (typeof(data) === 'undefined') data = null;

	this.ID = null;
	this.memberID = null;
	this.nickname = null;
	this.name = null;
	this.email = null;
	this.age = null;
	this.gender = null;
	this.hand = null;

	this.birthDate = null;
	this.rightHanded = null;
	this.DBgender = null;

	this.stats = null;

	// constructor
	if (data) this.load(data);
}

User.prototype.load = function(data)
{
	if (!data) return true;

	var thisUser = this;
	var ret = true;
	var constructMethod = data;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/users/" + data,
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				ret = null;
				if ( typeof(constructMethod) === 'string') {
					if (constructMethod.indexOf('@') != -1) {
						alert('Invalid Email');
					} else {
						alert('Invalid Member ID');
					}
				} else {
					alert('Invalid User ID');
				}
			} else {
				thisUser.ID = data.user.id;
				thisUser.memberID = data.user.memberID;
				thisUser.nickname = data.user.nickname;
				thisUser.name = data.user.name;
				thisUser.email = data.user.email;
				thisUser.DBgender = data.user.gender;
				thisUser.rightHanded = data.user.rightHanded;
				thisUser.birthDate = data.user.birthDate;

				data.user.gender == "m" ? thisUser.gender = "male" : thisUser.gender = "female";
				data.user.rightHanded ? thisUser.hand = "right" : thisUser.hand = "left";

				thisUser.age = getAge(data.user.birthDate);

				thisUser.stats = data.user.stats;
				ret = true;
			}
		},
		error: function(data, textStatus, xhr) {
			ret = null;
			ajaxErrorHandler('userLoad', data, textStatus, xhr);
		}
	});

	return ret;
}

User.prototype.save = function()
{
	var thisUser = this;
	var ret = true;

	if (this.ID) {
		// update
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/users/" + this.ID,
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					ret = false;
					alert('This user does not exist.');
				} else {
					thisUser.ID = data.user.id;
					thisUser.memberID = data.user.memberID;
					thisUser.nickname = data.user.nickname;
					thisUser.name = data.user.name;
					thisUser.email = data.user.email;
					thisUser.DBgender = data.user.gender;
					thisUser.rightHanded = data.user.rightHanded;
					thisUser.birthDate = data.user.birthDate;
					
					data.user.gender == "m" ? thisUser.gender = "male" : thisUser.gender = "female";
					data.user.rightHanded ? thisUser.hand = "right" : thisUser.hand = "left";

					thisUser.age = getAge(data.user.birthDate);
					
					thisUser.stats = data.user.stats;
					ret = true;
				}
			},
			error: function(data, textStatus, xhr) {
				ret = false;
				if (xhr.status == 412) {
					// memberID and email violate ICs
					alert('MemberID and email already taken.');
				} else if (xhr.status == 406) {
					// memberID IC violation
					alert('MemberID is already taken.');
				} else if (xhr.status == 409) {
					// email IC violation
					alert('Email is already taken.');
				} else {
					ajaxErrorHandler('userSave', data, textStatus, xhr);
				}
			}
		});
	} else {
		// insert
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/users/",
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				thisUser.ID = data.user.id;
				thisUser.memberID = data.user.memberID;
				thisUser.nickname = data.user.nickname;
				thisUser.name = data.user.name;
				thisUser.email = data.user.email;
				thisUser.DBgender = data.user.gender;
				thisUser.rightHanded = data.user.rightHanded;
				thisUser.birthDate = data.user.birthDate;

				data.user.gender == "m" ? thisUser.gender = "male" : thisUser.gender = "female";
				data.user.rightHanded ? thisUser.hand = "right" : thisUser.hand = "left";

				thisUser.age = getAge(data.user.birthDate);
				
				thisUser.stats = data.user.stats;
				ret = true;
			},
			error: function(data, textStatus, xhr) {
				ret = false;
				if (xhr.status == 412) {
					// memberID and email violate ICs
					alert('MemberID and email already taken.');
				} else if (xhr.status == 406) {
					// memberID IC violation
					alert('MemberID is already taken.');
				} else if (xhr.status == 409) {
					// email IC violation
					alert('Email is already taken.');
				} else {
					ajaxErrorHandler('userSave', data, textStatus, xhr);
				}
			}
		});
	}

	return ret;
}

User.prototype.del = function()
{	
	if (!this.ID) return false;

	var thisUser = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/users/destroy/" + this.ID,
		type: "POST",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				ret = false;
				alert('This user does not exist');
			}
			thisUser.ID = data.user.id;
			thisUser.memberID = data.user.memberID;
			thisUser.nickname = data.user.nickname;
			thisUser.name = data.user.name;
			thisUser.email = data.user.email;
			thisUser.DBgender = data.user.gender;
			thisUser.rightHanded = data.user.rightHanded;
			thisUser.birthDate = data.user.birthDate;

			data.user.gender == "m" ? thisUser.gender = "male" : thisUser.gender = "female";
			data.user.rightHanded ? thisUser.hand = "right" : thisUser.hand = "left";

			thisUser.age = getAge(data.user.birthDate);

			thisUser.stats = data.user.stats;

			ret = true;
		},
		error: function(data, textStatus, xhr) {
			ret = false;
			ajaxErrorHandler('userDelete', data, textStatus, xhr);
		}
	});

	return ret;
}

User.prototype.export = function()
{
	var userObject = 
	{"user":
		{
			"id": this.ID,
			"memberID": this.memberID,
			"nickname": this.nickname,
			"name": this.name,
			"email": this.email,
			"birthDate": this.birthDate,
			"gender": this.gender == "male" ? "m" : "f",
			"rightHanded": this.hand == "right" ? true : false,
			"stats": this.stats
		}
	};

	return userObject;
}

function UserGetAll()
{
	var users = new Array();

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/users/",
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			for (var i = 0; i < data.users.length; i++) {
				var u = new User();
				u.ID = data.users[i].id;
				u.name = data.users[i].name;
				users.push(u);
			}
		},
		error: function(data, textStatus, xhr) {
			ajaxErrorHandler('userGetAll', data, textStatus, xhr);
		}
	});

	return users;
}

/****************************************************************************
 *
 *
 * Shot
 *
 *
 ****************************************************************************/

function Shot()
{
	this.ID = null;
	this.holeID = null;
	this.club = null;
	this.shotNumber = null;
	this.aimLatitude = null;
	this.aimLongitude = null;
	this.startLatitude = null;
	this.startLongitude = null;
	this.endLatitude = null;
	this.endLongitude = null;
}

Shot.prototype.export = function()
{
	var shotObject = 
	{"shot":
		{
			"id": this.ID,
			"holeID": this.holeID,
			"club": this.club,
			"shotNumber": this.shotNumber,
			"aimLatitude": this.aimLatitude,
			"aimLongitude": this.aimLongitude,
			"startLatitude": this.startLatitude,
			"startLongitude": this.startLongitude,
			"endLatitude": this.endLatitude,
			"endLongitude": this.endLongitude
		}
	};

	return shotObject;
}

/****************************************************************************
 *
 *
 * Hole
 *
 *
 ****************************************************************************/

function Hole()
{
	this.ID = null;
	this.roundID = null;
	this.holeScore = null;
	this.FIR = null;
	this.GIR = null;
	this.putts = null;
	this.distance = null;
	this.par = null;
	this.holeNumber = null;
	this.firstRefLat = null;
	this.firstRefLong = null;
	this.secondRefLat = null;
	this.secondRefLong = null;
	this.firstRefX = null;
	this.firstRefY = null;
	this.secondRefX = null;
	this.secondRefY = null;
	this.shots = new Array();
}

Hole.prototype.export = function()
{
	var shotArray = [];

	for (var i = 0; i < this.shots.length; i++) {
		shotArray.push(s[i].export());
	}

	var holeObject = 
	{"hole":
		{
			"id": this.ID,
			"roundID": this.roundID,
			"holeScore": this.holeScore,
			"FIR": this.FIR,
			"GIR": this.GIR,
			"putts": this.putts,
			"distance": this.distance,
			"par": this.par,
			"holeNumber": this.holeNumber,
			"firstRefLat": this.firstRefLat,
			"firstRefLong": this.firstRefLong,
			"secondRefLat": this.secondRefLat,
			"secondRefLong": this.secondRefLong,
			"firstRefX": this.firstRefX,
			"firstRefY": this.firstRefY,
			"secondRefX": this.secondRefX,
			"secondRefY": this.secondRefY,
			"shots": shotArray
		}
	};

	return holeObject;
}

/****************************************************************************
 *
 *
 * Round
 *
 *
 ****************************************************************************/

function Round(data)
{
	if (typeof(data) === 'undefined') data = null;

	this.ID = null;
	//this.user = null;
	this.course = null;
	this.totalScore = null;
	this.teeID = null;
	this.startTime = null;
	this.holes = new Array();

	// constructor
	if (data) this.load(data);
}

Round.prototype.loadByJSON = function(data)
{
	this.ID = data.round.id;
					
	// create a new user for the user attribute
	/*var u = new User();
	u.ID = data.round.user.user.id;
	u.memberID = data.round.user.user.memberID;
	u.nickname = data.round.user.user.nickname;
	u.name = data.round.user.user.name;
	u.email = data.round.user.user.email;
	u.stats = data.round.user.user.stats;
	this.user = u;*/

	// create a new course for the course attribute
	var c = new Course();
	c.ID = data.round.course.course.id;
	c.name = data.round.course.course.name;
	c.location = data.round.course.course.location;
	this.course = c;

	this.totalScore = data.round.totalScore;
	this.teeID = data.round.teeID;
	this.startTime = data.round.startTime;

	var holeArray = new Array();

	// loop through all holes
	for (var i = 0; i < data.round.holes.length; i++) {
		var h = new Hole();
		h.ID = data.round.holes[i].hole.id;
		h.roundID = data.round.holes[i].hole.roundID;
		h.holeScore = data.round.holes[i].hole.holeScore;
		h.FIR = data.round.holes[i].hole.FIR;
		h.GIR = data.round.holes[i].hole.GIR;
		h.putts = data.round.holes[i].hole.putts;
		h.distance = data.round.holes[i].hole.distance;
		h.par = data.round.holes[i].hole.par;
		h.holeNumber = data.round.holes[i].hole.holeNumber;
		h.firstRefLat = data.round.holes[i].hole.firstRefLat;
		h.firstRefLong = data.round.holes[i].hole.firstRefLong;
		h.secondRefLat = data.round.holes[i].hole.secondRefLat;
		h.secondRefLong = data.round.holes[i].hole.secondRefLong;
		h.thirdRefLat = data.round.holes[i].hole.thirdRefLat;
		h.thirdRefLong = data.round.holes[i].hole.thirdRefLong;
		h.firstRefX = data.round.holes[i].hole.firstRefX;
		h.firstRefY = data.round.holes[i].hole.firstRefY;
		h.secondRefX = data.round.holes[i].hole.secondRefX;
		h.secondRefY = data.round.holes[i].hole.secondRefY;
		h.thirdRefX = data.round.holes[i].hole.thirdRefX;
		h.thirdRefY = data.round.holes[i].hole.thirdRefY;

		var shotArray = new Array();

		for (var j = 0; j < data.round.holes[i].hole.shots.length; j++) {
			var s = new Shot();
			s.ID = data.round.holes[i].hole.shots[j].shot.id;
			s.holeID = data.round.holes[i].hole.shots[j].shot.holeID;
			s.club = data.round.holes[i].hole.shots[j].shot.club;
			s.shotNumber = data.round.holes[i].hole.shots[j].shot.shotNumber;
			s.aimLatitude = data.round.holes[i].hole.shots[j].shot.aimLatitude;
			s.aimLongitude = data.round.holes[i].hole.shots[j].shot.aimLongitude;
			s.startLatitude = data.round.holes[i].hole.shots[j].shot.startLatitude;
			s.startLongitude = data.round.holes[i].hole.shots[j].shot.startLongitude;
			s.endLatitude = data.round.holes[i].hole.shots[j].shot.endLatitude;
			s.endLongitude = data.round.holes[i].hole.shots[j].shot.endLongitude;

			shotArray.push(s);
		}

		h.shots = shotArray;
		holeArray.push(h);
	}

	this.holes = holeArray;
}

Round.prototype.load = function(data)
{
	if (!data) return true;

	var thisRound = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/rounds/" + data,
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				ret = null;
				alert('This round does not exist.');
			} else {
				thisRound.loadByJSON(data);

				ret = true;
			}
		},
		error: function(data, textStatus, xhr) {
			ret = null;
			ajaxErrorHandler('roundLoad', data, textStatus, xhr);
		}
	});

	return ret;
}

Round.prototype.save = function()
{
	var thisRound = this;
	var ret = true;

	if (this.ID) {
		// update
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/rounds/" + this.ID,
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					ret = false;
					alert('This round does not exist.');
				} else {
					thisRound.loadByJSON(data);

					ret = true;
				}
			},
			error: function(data, textStatus, xhr) {
				ret = false;
				ajaxErrorHandler('roundSave', data, textStatus, xhr);
			}
		});
	} else {
		// insert
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/rounds/",
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				thisRound.loadByJSON(data);

				ret = true;
			},
			error: function(data, textStatus, xhr) {
				ret = false;
				ajaxErrorHandler('roundSave', data, textStatus, xhr);
			}
		});
	}

	return ret;
}

Round.prototype.del = function()
{	
	if (!this.ID) return false;

	var thisRound = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/rounds/destroy/" + this.ID,
		type: "POST",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				ret = false;
				alert('This round does not exist');
			} else {
				thisRound.loadByJSON(data);

				ret = true;
			}
		},
		error: function(data, textStatus, xhr) {
			ret = false;
			ajaxErrorHandler('roundDelete', data, textStatus, xhr);
		}
	});

	return ret;
}

Round.prototype.export = function()
{
	var holeArray = [];

	for (var i = 0; i < this.holes.length; i++) {
		holeArray.push(h[i].export());
	}

	var roundObject = 
	{"round":
		{
			"id": this.ID,
			//"user": this.user.export(),
			"course": this.course.export(),
			"totalScore": this.totalScore,
			"teeID": this.teeID,
			"startTime": this.startTime,
			"holes": holeArray
		}
	};

	return roundObject;
}

function RoundGetAll(data)
{
	if (typeof(data) === 'undefined') data = null;

	this.rounds = new Array();
	this.nextPage = 1;

	if (data) {
		this.userID = data;
		this.url = "API/rounds/user/" + this.userID + "/";
		this.next();
	} else {
		this.userID = null;
		this.url = "API/rounds/all/";
		this.next();
	}
}

RoundGetAll.prototype.next = function()
{
	if (this.nextPage) {
		var self = this;

		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: this.url + this.nextPage,
			type: "GET",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			success: function(data, textStatus, xhr) {
				for (var i = 0; i < data.rounds.length; i++) {
					var r = new Round();
					r.ID = data.rounds[i].id;
					r.startTime = data.rounds[i].startTime;

					self.rounds.push(r);
				}

				self.nextPage = data.nextPage;
			},
			error: function(data, textStatus, xhr) {
				ajaxErrorHandler('roundGetAllByUser', data, textStatus, xhr);
			}
		});
	}
}

/*******************
 *
 * extra functions
 *
 ******************/

 function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}