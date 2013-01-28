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
	this.id = null;
	this.name = null;
	this.location = null;

	// constructor
	if (data) this.load(data);
}

Course.prototype.load = function(data)
{
	if (!data) return true;

	$.ajax({
		accepts: "application/json",
		async: false,
		dataType: "json",
		url: "http://shadowrealm.cse.msstate.edu/gsas/API/courses/" + data.toString(),
		type: "GET",
		username: "cse3213",
		password: "test",
		success: function(data, textStatus, xhr) {
			if (data.status = 204) {
				alert('This course does not exist.');
			} else {
				alert(JSON.stringify(data));
			}
		},
		error: function(data, textStatus, xhr) {
			ajaxErrorHandler(data, textStatus, xhr);
		}
	});
}

Course.prototype.save = function()
{
	if (this.id) {
		// update
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "http://shadowrealm.cse.msstate.edu/gsas/API/courses/" + this.id.toString(),
			type: "POST",
			username: "cse3213",
			password: "test",
			contentType: "application/json",
			data: this.export(),
			success: function(data, textStatus, xhr) {
				alert(JSON.stringify(data));
			},
			error: function(data, textStatus, xhr) {
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	} else {
		// insert
		$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "http://shadowrealm.cse.msstate.edu/gsas/API/courses/",
			type: "POST",
			username: "cse3213",
			password: "test",
			contentType: "application/json",
			data: this.export(),
			success: function(data, textStatus, xhr) {
				alert(JSON.stringify(data));
			},
			error: function(data, textStatus, xhr) {
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
	}
}

Course.prototype.delete() = function()
{
	if (!this.id) return false;

	$.ajax({
			accepts: "application/json",
			async: false,
			dataType: "json",
			url: "http://shadowrealm.cse.msstate.edu/gsas/API/courses/" + this.id.toString(),
			type: "POST",
			username: "cse3213",
			password: "test",
			success: function(data, textStatus, xhr) {
				alert(JSON.stringify(data));
			},
			error: function(data, textStatus, xhr) {
				ajaxErrorHandler(data, textStatus, xhr);
			}
		});
}

Course.prototype.export() = function()
{
	var courseObject = 
	{"course":
		{
			"id": this.id,
			"name": this.name,
			"location": this.location
		}
	};

	return courseObject;
}