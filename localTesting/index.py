import request
import bottle
import json

app = bottle.default_app()

############################
#
# Static linker
#
############################

@app.route('/static/:path#.+#', name='static')
def static(path):
    return bottle.static_file(path, root='html/content/')

############################
#
# Website
#
############################

@app.route('/gsas/')
def index():
    return bottle.template('./html/index.html', get_url=app.get_url)

@app.route('/gsas/rounds')
def rounds():
    return bottle.template('./html/rounds.html', get_url=app.get_url)

@app.route('/gsas/maps')
def maps():
	return bottle.template('./html/maps.html', get_url=app.get_url)

@app.route('/gsas/table')
def table():
	return bottle.template('./html/data_table.html', get_url=app.get_url)

@app.route('/gsas/spread')
def spread():
	return bottle.template('./html/vector_graph.html', get_url=app.get_url)

@app.route('/gsas/distance')
def distance():
	return bottle.template('./html/bar_graph.html', get_url=app.get_url)

@app.route('/gsas/stats')
def stats():
	return bottle.template('./html/stats.html', get_url=app.get_url)

@app.route('/gsas/admin')
def admin():
	return bottle.template('./html/admin.html', get_url=app.get_url)

############################
#
# API
#
############################

base_url = 'http://shadowrealm.cse.msstate.edu/gsas/API/'

@app.get('/gsas/API/users/')
def getAllUsers():
    requestHeaders = {}
    for key, value in bottle.request.headers.iteritems():
        requestHeaders[key] = value

    r = request.get(base_url + 'users/', headers = requestHeaders, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    for key, value in r.headers.iteritems():
        bottle.response.headers[key] = value

    return r.json

@app.get('/gsas/API/users/<id:int>')
def getUser(id):
    requestHeaders = {}
    for key, value in bottle.request.headers.iteritems():
        requestHeaders[key] = value

    r = request.get(base_url + 'users/' + str(id), headers = requestHeaders, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    for key, value in r.headers.iteritems():
        bottle.response.headers[key] = value

    return r.json

@app.get('/gsas/API/rounds/all/<page:int>')
def getAllRounds(page):
    requestHeaders = {}
    for key, value in bottle.request.headers.iteritems():
        requestHeaders[key] = value

    r = request.get(base_url + 'rounds/all/' + page, headers = requestHeaders, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    for key, value in r.headers.iteritems():
        bottle.response.headers[key] = value

    return r.json

@app.get('/gsas/API/rounds/user/<userID:int>/<page:int>')
def getAllRoundsForUser(userID, page):
    requestHeaders = {}
    for key, value in bottle.request.headers.iteritems():
        requestHeaders[key] = value

    r = request.get(base_url + 'rounds/user/' + str(userID) + '/' + str(page), headers = requestHeaders, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    for key, value in r.headers.iteritems():
        bottle.response.headers[key] = value

    return r.json

@app.get('/gsas/API/rounds/<id:int>')
def getRound(id):
    requestHeaders = {}
    for key, value in bottle.request.headers.iteritems():
        requestHeaders[key] = value

    r = request.get(base_url + 'rounds/' + str(id), headers = requestHeaders, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    for key, value in r.headers.iteritems():
        bottle.response.headers[key] = value

    return r.json

@app.post('/gsas/API/users/<id:int>')
def updateUser(id):
    requestHeaders = {}
    for key, value in bottle.request.headers.iteritems():
        requestHeaders[key] = value

    r = request.post(base_url + 'users/' + str(id), bottle.request.json, headers = requestHeaders, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    for key, value in r.headers.iteritems():
        bottle.response.headers[key] = value

    return r.json

@app.post('/gsas/API/users/')
def newUser():
    requestHeaders = {}
    for key, value in bottle.request.headers.iteritems():
        requestHeaders[key] = value
    
    r = request.post(base_url + 'users/', json.JSONEncoder().encode(bottle.request.json), headers = requestHeaders, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    for key, value in r.headers.iteritems():
        bottle.response.headers[key] = value

    return r.json

@app.post('/gsas/API/users/destroy/<id:int>')
def deleteUser(id):
    requestHeaders = {}
    for key, value in bottle.request.headers.iteritems():
        requestHeaders[key] = value
    
    r = request.post(base_url + 'users/destroy/' + str(id), json.JSONEncoder().encode(bottle.request.json), headers = requestHeaders, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    for key, value in r.headers.iteritems():
        bottle.response.headers[key] = value

    return r.json

app.run(host='localhost', port=8080)