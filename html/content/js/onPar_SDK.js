var defines = {}
defines.API_USERNAME = 'cse3213';
defines.API_PASSWORD = 'test';
defines.AGGIES = 1;
defines.MAROONS = 2;
defines.COWBELLS = 3;
defines.TIPS = 4;
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
	('Unknown error from function ' + f + ' that returned status code: ' + xhr.status + '. Email Kevin and report this error');
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

	this._id = null;
	this._name = null;
	this._location = null;

	// constructor
	if (data) this.load(data);
}

Course.prototype.ID = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._id = data;
	} else {
		return this._id;
	}
}

Course.prototype.name = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._name = data;
	} else {
		return this._name;
	}
}

Course.prototype.location = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._location = data;
	} else {
		return this._location;
	}
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
				ret = null;
				alert('This course does not exist.');
			} else {
				thisCourse.ID(data.course.id);
				thisCourse.name(data.course.name);
				thisCourse.location(data.course.location);
				ret = true;
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

	if (this.ID()) {
		// update
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/courses/" + this.ID(),
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
					thisCourse.ID(data.course.id);
					thisCourse.name(data.course.name);
					thisCourse.location(data.course.location);
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
				thisCourse.ID(data.course.id);
				thisCourse.name(data.course.name);
				thisCourse.location(data.course.location);
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
	if (!this.ID()) return false;

	var thisCourse = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/courses/destroy/" + this.ID(),
		type: "POST",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				ret = false;
				alert('This Course does not exist');
			}
			thisCourse.ID(data.course.id);
			thisCourse.name(data.course.name);
			thisCourse.location(data.course.location);

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
			"id": this.ID(),
			"name": this.name(),
			"location": this.location()
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
				c.ID(data.courses[i].course.id);
				c.name(data.courses[i].course.name);
				c.location(data.courses[i].course.location);
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

	this._id = null;
	this._memberID = null;
	this._nickname = null;
	this._name = null;
	this._email = null;
	this._stats = null;

	// constructor
	if (data) this.load(data);
}

User.prototype.ID = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._id = data;
	} else {
		return this._id;
	}
}

User.prototype.memberID = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._memberID = data;
	} else {
		return this._memberID;
	}
}

User.prototype.nickname = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._nickname = data;
	} else {
		return this._nickname;
	}
}

User.prototype.name = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._name = data;
	} else {
		return this._name;
	}
}

User.prototype.email = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._email = data;
	} else {
		return this._email;
	}
}

User.prototype.stats = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._stats = data;
	} else {
		return this._stats;
	}
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
				thisUser.ID(data.user.id);
				thisUser.memberID(data.user.memberID);
				thisUser.nickname(data.user.nickname);
				thisUser.name(data.user.name);
				thisUser.email(data.user.email);
				thisUser.stats(data.user.stats);
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

	if (this.ID()) {
		// update
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/users/" + this.ID(),
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
					thisUser.ID(data.user.id);
					thisUser.memberID(data.user.memberID);
					thisUser.nickname(data.user.nickname);
					thisUser.name(data.user.name);
					thisUser.email(data.user.email);
					thisUser.stats(data.user.stats);
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
				thisUser.ID(data.user.id);
				thisUser.memberID(data.user.memberID);
				thisUser.nickname(data.user.nickname);
				thisUser.name(data.user.name);
				thisUser.email(data.user.email);
				thisUser.stats(data.user.stats);
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
	if (!this.ID()) return false;

	var thisUser = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/users/destroy/" + this.ID(),
		type: "POST",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				ret = false;
				alert('This user does not exist');
			}
			thisUser.ID(data.user.id);
			thisUser.memberID(data.user.memberID);
			thisUser.nickname(data.user.nickname);
			thisUser.name(data.user.name);
			thisUser.email(data.user.email);
			thisUser.stats(data.user.stats);

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
			"id": this.ID(),
			"memberID": this.memberID(),
			"nickname": this.nickname(),
			"name": this.name(),
			"email": this.email(),
			"stats": this.stats()
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
				u.ID(data.users[i].user.id);
				u.memberID(data.users[i].user.memberID);
				u.nickname(data.users[i].user.nickname);
				u.name(data.users[i].user.name);
				u.email(data.users[i].user.email);
				u.stats(data.users[i].user.stats);
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
	this._id = null;
	this._holeID = null;
	this._club = null;
	this._shotNumber = null;
	this._aimLatitude = null;
	this._aimLongitude = null;
	this._startLatitude = null;
	this._startLongitude = null;
	this._endLatitude = null;
	this._endLongitude = null;
}

Shot.prototype.ID = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._id = data;
	} else {
		return this._id;
	}
}

Shot.prototype.holeID = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._holeID = data;
	} else {
		return this._holeID;
	}
}

Shot.prototype.club = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._club = data;
	} else {
		return this._club;
	}
}

Shot.prototype.shotNumber = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._shotNumber = data;
	} else {
		return this._shotNumber;
	}
}

Shot.prototype.aimLatitude = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._aimLatitude = data;
	} else {
		return this._aimLatitude;
	}
}

Shot.prototype.aimLongitude = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._aimLongitude = data;
	} else {
		return this._aimLongitude;
	}
}

Shot.prototype.startLatitude = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._startLatitude = data;
	} else {
		return this._startLatitude;
	}
}

Shot.prototype.startLongitude = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._startLongitude = data;
	} else {
		return this._startLongitude;
	}
}

Shot.prototype.endLatitude = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._endLatitude = data;
	} else {
		return this._endLatitude;
	}
}

Shot.prototype.endLongitude = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._endLongitude = data;
	} else {
		return this._endLongitude;
	}
}

Shot.prototype.export = function()
{
	var shotObject = 
	{"shot":
		{
			"id": this.ID(),
			"holeID": this.holeID(),
			"club": this.club(),
			"shotNumber": this.shotNumber(),
			"aimLatitude": this.aimLatitude(),
			"aimLongitude": this.aimLongitude(),
			"startLatitude": this.startLatitude(),
			"startLongitude": this.startLongitude(),
			"endLatitude": this.endLatitude(),
			"endLongitude": this.endLongitude()
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
	this._id = null;
	this._roundID = null;
	this._holeScore = null;
	this._FIR = null;
	this._GIR = null;
	this._putts = null;
	this._distance = null;
	this._par = null;
	this._holeNumber = null;
	this._firstRefLat = null;
	this._firstRefLong = null;
	this._secondRefLat = null;
	this._secondRefLong = null;
	this._thirdRefLat = null;
	this._thirdRefLong = null;
	this._firstRefX = null;
	this._firstRefY = null;
	this._secondRefX = null;
	this._secondRefY = null;
	this._thirdRefX = null;
	this._thirdRefY = null;
	this._shots = new Array();
}

Hole.prototype.ID = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._id = data;
	} else {
		return this._id;
	}
}

Hole.prototype.roundID = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._roundID = data;
	} else {
		return this._roundID;
	}
}

Hole.prototype.holeScore = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._holeScore = data;
	} else {
		return this._holeScore;
	}
}

Hole.prototype.FIR = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._FIR = data;
	} else {
		return this._FIR;
	}
}

Hole.prototype.GIR = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._GIR = data;
	} else {
		return this._GIR;
	}
}

Hole.prototype.putts = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._putts = data;
	} else {
		return this._putts;
	}
}

Hole.prototype.distance = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._distance = data;
	} else {
		return this._distance;
	}
}

Hole.prototype.par = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._par = data;
	} else {
		return this._par;
	}
}

Hole.prototype.holeNumber = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._holeNumber = data;
	} else {
		return this._holeNumber;
	}
}

Hole.prototype.firstRefLat = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._firstRefLat = data;
	} else {
		return this._firstRefLat;
	}
}

Hole.prototype.firstRefLong = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._firstRefLong = data;
	} else {
		return this._firstRefLong;
	}
}

Hole.prototype.secondRefLat = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._secondRefLat = data;
	} else {
		return this._secondRefLat;
	}
}

Hole.prototype.secondRefLong = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._secondRefLong = data;
	} else {
		return this._secondRefLong;
	}
}

Hole.prototype.thirdRefLat = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._thirdRefLat = data;
	} else {
		return this._thirdRefLat;
	}
}

Hole.prototype.thirdRefLong = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._thirdRefLong = data;
	} else {
		return this._thirdRefLong;
	}
}

Hole.prototype.firstRefX = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._firstRefX = data;
	} else {
		return this._firstRefX;
	}
}

Hole.prototype.firstRefY = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._firstRefY = data;
	} else {
		return this._firstRefY;
	}
}

Hole.prototype.secondRefX = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._secondRefX = data;
	} else {
		return this._secondRefX;
	}
}

Hole.prototype.secondRefY = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._secondRefY = data;
	} else {
		return this._secondRefY;
	}
}

Hole.prototype.thirdRefX = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._thirdRefX = data;
	} else {
		return this._thirdRefX;
	}
}

Hole.prototype.thirdRefY = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._thirdRefY = data;
	} else {
		return this._thirdRefY;
	}
}

Hole.prototype.shots = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._shots = data;
	} else {
		return this._shots;
	}
}

Hole.prototype.export = function()
{
	var shots = [];

	s = this.shots();

	for (var i = 0; i < s.length; i++) {
		shots.push(s[i].export());
	}

	var holeObject = 
	{"hole":
		{
			"id": this.ID(),
			"roundID": this.roundID(),
			"holeScore": this.holeScore(),
			"FIR": this.FIR(),
			"GIR": this.GIR(),
			"putts": this.putts(),
			"distance": this.distance(),
			"par": this.par(),
			"holeNumber": this.holeNumber(),
			"firstRefLat": this.firstRefLat(),
			"firstRefLong": this.firstRefLong(),
			"secondRefLat": this.secondRefLat(),
			"secondRefLong": this.secondRefLong(),
			"thirdRefLat": this.thirdRefLat(),
			"thirdRefLong": this.thirdRefLong(),
			"firstRefX": this.firstRefX(),
			"firstRefY": this.firstRefY(),
			"secondRefX": this.secondRefX(),
			"secondRefY": this.secondRefY(),
			"thirdRefX": this.thirdRefX(),
			"thirdRefY": this.thirdRefY(),
			"shots": shots
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

	this._id = null;
	this._user = null;
	this._course = null;
	this._totalScore = null;
	this._teeID = null;
	this._startTime = null;
	this._holes = new Array();

	// constructor
	if (data) this.load(data);
}

Round.prototype.ID = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._id = data;
	} else {
		return this._id;
	}
}

Round.prototype.user = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._user = data;
	} else {
		return this._user;
	}
}

Round.prototype.course = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._course = data;
	} else {
		return this._course;
	}
}

Round.prototype.totalScore = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._totalScore = data;
	} else {
		return this._totalScore;
	}
}

Round.prototype.teeID = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._teeID = data;
	} else {
		return this._teeID;
	}
}

Round.prototype.startTime = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._startTime = data;
	} else {
		return this._startTime;
	}
}

Round.prototype.holes = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		this._holes = data;
	} else {
		return this._holes;
	}
}

Round.prototype.loadByJSON = function(data)
{
	this.ID(data.round.id);
					
	// create a new user for the user attribute
	var u = new User();
	u.ID(data.round.user.user.id);
	u.memberID(data.round.user.user.memberID);
	u.nickname(data.round.user.user.nickname);
	u.name(data.round.user.user.name);
	u.email(data.round.user.user.email);
	u.stats(data.round.user.user.stats);
	this.user(u);

	// create a new course for the course attribute
	var c = new Course();
	c.ID(data.round.course.course.id);
	c.name(data.round.course.course.name);
	c.location(data.round.course.course.location);
	this.course(c);

	this.totalScore(data.round.totalScore);
	this.teeID(data.round.teeID);
	this.startTime(data.round.startTime);

	var holes = new Array();

	// loop through all holes
	for (var i = 0; i < data.round.holes.length; i++) {
		var h = new Hole();
		h.ID(data.round.holes[i].hole.id);
		h.roundID(data.round.holes[i].hole.roundID);
		h.holeScore(data.round.holes[i].hole.holeScore);
		h.FIR(data.round.holes[i].hole.FIR);
		h.GIR(data.round.holes[i].hole.GIR);
		h.putts(data.round.holes[i].hole.putts);
		h.distance(data.round.holes[i].hole.distance);
		h.par(data.round.holes[i].hole.par);
		h.holeNumber(data.round.holes[i].hole.holeNumber);
		h.firstRefLat(data.round.holes[i].hole.firstRefLat);
		h.firstRefLong(data.round.holes[i].hole.firstRefLong);
		h.secondRefLat(data.round.holes[i].hole.secondRefLat);
		h.secondRefLong(data.round.holes[i].hole.secondRefLong);
		h.thirdRefLat(data.round.holes[i].hole.thirdRefLat);
		h.thirdRefLong(data.round.holes[i].hole.thirdRefLong);
		h.firstRefX(data.round.holes[i].hole.firstRefX);
		h.firstRefY(data.round.holes[i].hole.firstRefY);
		h.secondRefX(data.round.holes[i].hole.secondReX);
		h.secondRefY(data.round.holes[i].hole.secondRefY);
		h.thirdRefX(data.round.holes[i].hole.thirdRefX);
		h.thirdRefY(data.round.holes[i].hole.thirdRefY);

		var shots = new Array();

		for (var j = 0; j < data.round.holes[i].hole.shots.length; j++) {
			var s = new Shot();
			s.ID(data.round.holes[i].hole.shots[j].shot.id);
			s.holeID(data.round.holes[i].hole.shots[j].shot.holeID);
			s.club(data.round.holes[i].hole.shots[j].shot.club);
			s.shotNumber(data.round.holes[i].hole.shots[j].shot.shotNumber);
			s.aimLatitude(data.round.holes[i].hole.shots[j].shot.aimLatitude);
			s.aimLongitude(data.round.holes[i].hole.shots[j].shot.aimLongitude);
			s.startLatitude(data.round.holes[i].hole.shots[j].shot.startLatitude);
			s.startLongitude(data.round.holes[i].hole.shots[j].shot.startLongitude);
			s.endLatitude(data.round.holes[i].hole.shots[j].shot.endLatitude);
			s.endLongitude(data.round.holes[i].hole.shots[j].shot.endLongitude);

			shots.push(s);
		}

		h.shots(shots);
		holes.push(h);
	}

	this.holes(holes);
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

	if (this.ID()) {
		// update
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/rounds/" + this.ID(),
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
	if (!this.ID()) return false;

	var thisRound = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "API/rounds/destroy/" + this.ID(),
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
	var holes = [];

	var h = this.holes();

	for (var i = 0; i < h.length; i++) {
		holes.push(h[i].export());
	}

	var roundObject = 
	{"round":
		{
			"id": this.ID(),
			"user": this.user().export(),
			"course": this.course().export(),
			"totalScore": this.totalScore(),
			"teeID": this.teeID(),
			"startTime": this.startTime(),
			"holes": holes
		}
	};

	return roundObject;
}

function RoundGetAllTest(data)
{
	if (typeof(data) === 'undefined') data = null;

	this.rounds = new Array();
	this.nextPage = 1;

	if (data) {
		this.userID = data;
		this.url = "http://shadowrealm.cse.msstate.edu/API-Dev/rounds/user/" + this.userID + "/";
		this.next();
	} else {
		this.userID = null;
		this.url = "http://shadowrealm.cse.msstate.edu/API-Dev/rounds/all/";
		this.next();
	}
}

RoundGetAllTest.prototype.next = function(data)
{
	if (typeof(data) === 'undefined') return false;

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
					r.ID(data.rounds[i].id);
					r.startTime(data.rounds[i].startTime);

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

function RoundGetAll(data)
{
	if (typeof(data) === 'undefined') data = null;

	var rounds = new Array();

	if (data) {
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/rounds/user/" + data,
			type: "GET",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			success: function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					ret = false;
					alert('This user does not exist');
				} else {
					for (var i = 0; i < data.rounds.length; i++) {
						var r = new Round();

						r.loadByJSON(data.rounds[i]);

						rounds.push(r);
					}
				}
			},
			error: function(data, textStatus, xhr) {
				ajaxErrorHandler('roundGetAllByUser', data, textStatus, xhr);
			}
		});
	} else {
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "API/rounds/",
			type: "GET",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			success: function(data, textStatus, xhr) {
				for (var i = 0; i < data.rounds.length; i++) {
					var r = new Round();

					r.loadByJSON(data.rounds[i]);

					rounds.push(r);	
				}
			},
			error: function(data, textStatus, xhr) {
				ajaxErrorHandler('roundGetAll', data, textStatus, xhr);
			}
		});
	}

	return rounds;
}