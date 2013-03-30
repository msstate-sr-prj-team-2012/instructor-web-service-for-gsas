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

@app.route('/gsas/help')
def admin():
    return bottle.template('./html/help.html', get_url=app.get_url)

@app.route('/gsas/about')
def admin():
    return bottle.template('./html/about.html', get_url=app.get_url)

############################
#
# API
#
############################

base_url = 'http://shadowrealm.cse.msstate.edu/gsas/API/'

@app.get('/gsas/API/users/')
def getAllUsers():
    r = request.get(base_url + 'users/', auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    return r.json

@app.get('/gsas/API/users/<id>')
def getUser(id):
    r = request.get(base_url + 'users/' + str(id), auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    return r.json

@app.get('/gsas/API/rounds/all/<page:int>')
def getAllRounds(page):
    r = request.get(base_url + 'rounds/all/' + page, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    return r.json

@app.get('/gsas/API/rounds/user/<userID:int>/<page:int>')
def getAllRoundsForUser(userID, page):
    r = request.get(base_url + 'rounds/user/' + str(userID) + '/' + str(page), auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    return r.json

@app.get('/gsas/API/rounds/<id:int>')
def getRound(id):
    r = request.get(base_url + 'rounds/' + str(id), auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    return r.json

@app.post('/gsas/API/users/<id>')
def updateUser(id):
    r = request.post(base_url + 'users/' + str(id), bottle.request.json, auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    return r.json

@app.post('/gsas/API/users/')
def newUser():
    r = request.post(base_url + 'users/', json.JSONEncoder().encode(bottle.request.json), auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    return r.json

@app.post('/gsas/API/users/destroy/<id:int>')
def deleteUser(id):
    r = request.post(base_url + 'users/destroy/' + str(id), json.JSONEncoder().encode(bottle.request.json), auth = ('cse3213', 'test'))
    bottle.response.status = r.status_code

    return r.json

app.run(host='localhost', port=8080)