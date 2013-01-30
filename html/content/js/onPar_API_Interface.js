var defines = {}
defines.API_USERNAME = 'cse3213';
defines.API_PASSWORD = 'test';

function ajaxErrorHandler(data, textStatus)
{
	console.log('API Error - entering ajaxErrorHandler');
	console.log('Returned data: ' + JSON.stringify(data));
	console.log('TextStatus: ' + textStatus);
	console.log('Response Status: ' + JSON.stringify(data.status));

	if (textStatus != "success") {
		switch (data.status) {
			// 1xx codes are informational
			case 100:
				alert('100 Continue');
				break;
			case 101:
				alert('101 Switching Protocols');
				break;

			// the next few 2xx codes will never be recognized as an error
			case 200:
				alert('200 OK');
				break;
			case 201:
				alert('201 Created');
				break;
			case 202:
				alert('202 Accepted');
				break;
			case 203:
				alert('203 Non-Authoritative Information');
				break;
			case 204:
				alert('204 No Content');
				break;
			case 205:
				alert('205 Reset Connection');
				break;
			case 206:
				alert('206 Partial Content');
				break;

			// 3xx Redirection
			case 300:
				alert('300 Multiple Choices');
				break;
			case 301:
				alert('301 Moved Permanently');
				break;
			case 302:
				alert('302 Found');
				break;
			case 303:
				alert('303 See Other');
				break;
			case 304:
				alert('304 Not Modified');
				break;
			case 305:
				alert('305 Use Proxy');
				break;
			case 306:
				alert('306 (Unused)');
				break;
			case 307:
				alert('307 Temporary Redirect')
				break;

			// 4xx Client Errors
			case 400:
				alert('400 Bad Request');
				break;
			case 401:
				alert('401 Unauthorized');
				break;
			case 402:
				alert('402 Payment Required');
				break;
			case 403:
				alert('403 Forbidden');
				break;
			case 404:
				alert('404 Not Found');
				break;
			case 405:
				alert('405 Method Not Allowed');
				break;
			case 406:
				alert('406 Not Acceptable');
				break;
			case 407:
				alert('407 Proxy Authentication Required');
				break;
			case 408:
				alert('408 Request Timeout');
				break;
			case 409:
				alert('409 Conflict');
				break;
			case 410:
				alert('410 Gone');
				break;
			case 411:
				alert('411 Length Required');
				break;
			case 412:
				alert('412 Precondition Failed');
				break;
			case 413:
				alert('413 Request Entity Too Large');
				break;
			case 414:
				alert('414 Request-URI Too Long');
				break;
			case 415:
				alert('415 Unsupported Media Type');
				break;
			case 416:
				alert('416 Requested Range Not Satisfiable');
				break;
			case 417:
				alert('417 Expectation Failed');
				break;
			case 422:
				alert('422 Unproccessable Entity');
				break;
			case 423:
				alert('423 Locked');
				break;

			// Server Errors 5xx
			case 500:
				alert('500 Internal Server Error');
				break;
			case 501:
				alert('501 Not Implemented');
				break;
			case 502:
				alert('502 Bad Gateway');
				break;
			case 503:
				alert('503 Service Unavailable');
				break;
			case 504:
				alert('504 Gateway Timeout');
				break;
			case 505:
				alert('505 HTTP Version Not Supported');
				break;
		}
	}
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

	if (data) {
		console.log('New Course with data: ' + data.toString());
	} else {
		console.log('New Course with no data');
	}

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
	console.log('Course load with data: ' + data.toString());
	if (!data) return true;

	var thisCourse = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "/API/courses/" + data.toString(),
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				console.log('Course Loading - Nonexistent Course');
				ret = false;
				alert('This course does not exist.');
			} else {
				console.log('Course Loading Success');
				thisCourse.ID(data.course.id);
				thisCourse.name(data.course.name);
				thisCourse.location(data.course.location);
				ret = true;
			}
		},
		error: function(data, textStatus, xhr) {
			console.log('Course Loading Error');
			ret = false;
			ajaxErrorHandler(data, textStatus, xhr);
		}
	});

	return ret;
}

Course.prototype.save = function()
{
	console.log('Course save');

	var thisCourse = this;
	var ret = true;

	if (this.ID()) {
		// update
		console.log('Course update for id: ' + this.ID());
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "/API/courses/" + this.ID(),
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					console.log('Course Update - Nonexistent Course');
					ret = false;
					alert('This course does not exist.');
				} else {
					console.log('Course Update Succeess');
					thisCourse.ID(data.course.id);
					thisCourse.name(data.course.name);
					thisCourse.location(data.course.location);
					ret = true;
				}
			},
			error: function(data, textStatus, xhr) {
				console.log('Course Update Error');
				ret = false;
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	} else {
		// insert
		console.log('Course insert');
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "/API/courses/",
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				console.log('Course Insert Success');
				thisCourse.ID(data.course.id);
				thisCourse.name(data.course.name);
				thisCourse.location(data.course.location);
				ret = true;
			},
			error: function(data, textStatus, xhr) {
				console.log('Course Insert Error');
				ret = false;
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	}

	return ret;
}

Course.prototype.delete = function()
{
	console.log('Course delete for id: ' + this.ID());
	
	if (!this.ID()) return false;

	var thisCourse = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "/API/courses/destroy/" + this.ID(),
		type: "POST",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				console.log('Course Delete - Nonexistent Course');
				ret = false;
				alert('This Course does not exist');
			}
			console.log('Course delete success');
			thisCourse.ID(data.course.id);
			thisCourse.name(data.course.name);
			thisCourse.location(data.course.location);

			ret = true;
		},
		error: function(data, textStatus, xhr) {
			console.log('Course delete failure');
			ret = false;
			ajaxErrorHandler(data, textStatus, xhr);
		}
	});

	return ret;
}

Course.prototype.export = function()
{
	console.log('Course Export');
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
	console.log('Getting all Courses');

	var courses = new Array();

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "/API/courses/",
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			console.log('Course Get All Success');
			for (var i = 0; i < data.courses.length; i++) {
				var c = new Course();
				c.ID(data.courses[i].course.id);
				c.name(data.courses[i].course.name);
				c.location(data.courses[i].course.location);
				courses.push(c);
			}
		},
		error: function(data, textStatus, xhr) {
			console.log('Course Get All Error');
			ajaxErrorHandler(data, textStatus, xhr);
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

	if (data) {
		console.log('New User with data: ' + data.toString());
	} else {
		console.log('New User with no data');
	}

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
	console.log('User load with data: ' + data.toString());
	if (!data) return true;

	var thisUser = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "/API/users/" + data.toString(),
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				console.log('User Loading - Nonexistent User');
				ret = false;
				alert('This user does not exist.');
			} else {
				console.log('User Loading Success');
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
			console.log('User Loading Error');
			ret = false;
			ajaxErrorHandler(data, textStatus, xhr);
		}
	});

	return ret;
}

User.prototype.save = function()
{
	console.log('User save');

	var thisUser = this;
	var ret = true;

	if (this.ID()) {
		// update
		console.log('User update for id: ' + this.ID());
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "/API/users/" + this.ID(),
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					console.log('User Update - Nonexistent User');
					ret = false;
					alert('This user does not exist.');
				} else {
					console.log('User Update Succeess');
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
				console.log('User Update Error');
				ret = false;
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	} else {
		// insert
		console.log('User insert');
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "/API/users/",
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				console.log('User Insert Success');
				thisUser.ID(data.user.id);
				thisUser.memberID(data.user.memberID);
				thisUser.nickname(data.user.nickname);
				thisUser.name(data.user.name);
				thisUser.email(data.user.email);
				thisUser.stats(data.user.stats);
				ret = true;
			},
			error: function(data, textStatus, xhr) {
				console.log('User Insert Error');
				ret = false;
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	}

	return ret;
}

User.prototype.delete = function()
{
	console.log('User delete for id: ' + this.ID());
	
	if (!this.ID()) return false;

	var thisUser = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "/API/users/destroy/" + this.ID(),
		type: "POST",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				console.log('User Delete - Nonexistent User');
				ret = false;
				alert('This user does not exist');
			}
			console.log('User delete success');
			thisUser.ID(data.user.id);
			thisUser.memberID(data.user.memberID);
			thisUser.nickname(data.user.nickname);
			thisUser.name(data.user.name);
			thisUser.email(data.user.email);
			thisUser.stats(data.user.stats);

			ret = true;
		},
		error: function(data, textStatus, xhr) {
			console.log('User delete failure');
			ret = false;
			ajaxErrorHandler(data, textStatus, xhr);
		}
	});

	return ret;
}

User.prototype.export = function()
{
	console.log('User Export');
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
	console.log('Getting all Users');

	var users = new Array();

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "/API/users/",
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			console.log('User Get All Success');
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
			console.log('User Get All Error');
			ajaxErrorHandler(data, textStatus, xhr);
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

	console.log('New Shot');

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
	console.log('Shot Export');
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
	console.log('New Hole');

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
	this._shots = null;
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
	console.log('Hole Export');

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

	if (data) {
		console.log('New Round with data: ' + data.toString());
	} else {
		console.log('New Round with no data');
	}

	this._id = null;
	this._user = null;
	this._course = null;
	this._totalScore = null;
	this._teeID = null;
	this._startTime = null;
	this._holes = null;

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
	console.log('Round load with data: ' + data.toString());
	if (!data) return true;

	var thisRound = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "/API/rounds/" + data.toString(),
		type: "GET",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				console.log('Round Loading - Nonexistent Round');
				ret = false;
				alert('This round does not exist.');
			} else {
				console.log('Round Loading Success');

				thisRound.loadByJSON(data);

				ret = true;
			}
		},
		error: function(data, textStatus, xhr) {
			console.log('Round Loading Error');
			ret = false;
			ajaxErrorHandler(data, textStatus, xhr);
		}
	});

	return ret;
}

Round.prototype.save = function()
{
	console.log('Round save');

	var thisRound = this;
	var ret = true;

	if (this.ID()) {
		// update
		console.log('Round update for id: ' + this.ID());
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "/API/rounds/" + this.ID(),
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					console.log('Round Update - Nonexistent Round');
					ret = false;
					alert('This round does not exist.');
				} else {
					console.log('Round Update Succeess');
					
					thisRound.loadByJSON(data);

					ret = true;
				}
			},
			error: function(data, textStatus, xhr) {
				console.log('Round Update Error');
				ret = false;
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	} else {
		// insert
		console.log('Round insert');
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "/API/rounds/",
			type: "POST",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			contentType: "application/json",
			data: JSON.stringify(this.export()),
			success: function(data, textStatus, xhr) {
				console.log('User Insert Success');
				
				thisRound.loadByJSON(data);

				ret = true;
			},
			error: function(data, textStatus, xhr) {
				console.log('Round Insert Error');
				ret = false;
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	}

	return ret;
}

Round.prototype.delete = function()
{
	console.log('Round delete for id: ' + this.ID());
	
	if (!this.ID()) return false;

	var thisUser = this;
	var ret = true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "/API/rounds/destroy/" + this.ID(),
		type: "POST",
		username: defines.API_USERNAME,
		password: defines.API_PASSWORD,
		success: function(data, textStatus, xhr) {
			if (xhr.status == 204) {
				console.log('Round Delete - Nonexistent Round');
				ret = false;
				alert('This round does not exist');
			} else {
				console.log('Round delete success');
				
				thisRound.loadByJSON(data);

				ret = true;
			}
		},
		error: function(data, textStatus, xhr) {
			console.log('Round delete failure');
			ret = false;
			ajaxErrorHandler(data, textStatus, xhr);
		}
	});

	return ret;
}

Round.prototype.export = function()
{
	console.log('Round Export');

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

	console.log(JSON.stringify(roundObject));

	return roundObject;
}

function RoundGetAll(data)
{
	if (typeof(data) === 'undefined') data = null;

	var rounds = new Array();

	if (data) {
		console.log('Get All Rounds By User');

		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "/API/rounds/user/" + data.toString(),
			type: "GET",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			success: function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					console.log('Round Get All By User - Nonexistent User');
					ret = false;
					alert('This user does not exist');
				} else {
					console.log('Round Get All By User Success');
					for (var i = 0; i < data.rounds.length; i++) {
						var r = new Round();

						r.loadByJSON(data.rounds[i]);

						rounds.push(r);
					}
				}
			},
			error: function(data, textStatus, xhr) {
				console.log('User Get All Error');
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	} else {
		console.log('Get All Rounds');

		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "/API/rounds/",
			type: "GET",
			username: defines.API_USERNAME,
			password: defines.API_PASSWORD,
			success: function(data, textStatus, xhr) {
				console.log('Round Get All Success');
				for (var i = 0; i < data.rounds.length; i++) {
					var r = new Round();

					r.loadByJSON(data.rounds[i]);

					rounds.push(r);	
				}
			},
			error: function(data, textStatus, xhr) {
				console.log('User Get All Error');
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	}

	return rounds;
}