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
		console.log('Setting Course id');
		this._id = data;
	} else {
		console.log('Getting Course id');
		return this._id;
	}
}

Course.prototype.name = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		console.log('Setting Course name');
		this._name = data;
	} else {
		console.log('Getting Course name');
		return this._name;
	}
}

Course.prototype.location = function(data)
{
	if (typeof(data) === 'undefined') data = null;

	if (data) {
		console.log('Setting Course location');
		this._location = data;
	} else {
		console.log('Getting Course location');
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
		url: "http://shadowrealm.cse.msstate.edu/gsas/API/courses/" + data.toString(),
		type: "GET",
		username: "cse3213",
		password: "test",
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
			url: "http://shadowrealm.cse.msstate.edu/gsas/API/courses/" + this.ID(),
			type: "POST",
			username: "cse3213",
			password: "test",
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
			url: "http://shadowrealm.cse.msstate.edu/gsas/API/courses/",
			type: "POST",
			username: "cse3213",
			password: "test",
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
		url: "http://shadowrealm.cse.msstate.edu/gsas/API/courses/destroy/" + this.ID(),
		type: "POST",
		username: "cse3213",
		password: "test",
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

	console.log(JSON.stringify(courseObject));

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
		url: "http://shadowrealm.cse.msstate.edu/gsas/API/courses/",
		type: "GET",
		username: "cse3213",
		password: "test",
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