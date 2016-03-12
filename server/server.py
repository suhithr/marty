import falcon
import redis
import random
import string
import json


def randomword(length):
    return ''.join(random.choice(string.lowercase) for i in range(length))

r = redis.Redis(
    host='127.0.0.1',
    port=6379)


class URIMapper:

    def on_post(self, req, resp):
        hash_url = randomword(5)
        uri = req.get_param('uri')
        print uri + " --> " + hash_url
        r.set(hash_url, uri)
        data = {'hash': hash_url}
        resp.body = json.dumps(data)
        resp.content_type = 'application/json'
        resp.status = falcon.HTTP_200
        resp.set_header('Access-Control-Allow-Origin', '*')


class GetMagnet:

    def on_post(self, req, resp):
        hash_url = req.get_param('hash')
        magnet = r.get(hash_url)
        print hash_url + " --> " + magnet
        data = {'magnet': magnet}
        resp.body = json.dumps(data)
        resp.content_type = 'application/json'
        resp.status = falcon.HTTP_200
        resp.set_header('Access-Control-Allow-Origin', '*')

app = application = falcon.API()
url = URIMapper()
magnet = GetMagnet()

app.add_route('/url', url)
app.add_route('/magnet', magnet)
