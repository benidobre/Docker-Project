from flask import Flask, render_template, request, make_response, g
from redis import Redis
import os
import socket
import random
import json

option_a = [os.getenv('OPTION_A', "1"),os.getenv('OPTION_A', "0"),os.getenv('OPTION_A', "0")]
option_b = [os.getenv('OPTION_B', "2"),os.getenv('OPTION_B', "1"),os.getenv('OPTION_B', "e")]
question = [os.getenv('QUESTION', "1+1=?"),os.getenv('QUESTION', "0^0=?"),os.getenv('QUESTION', "ln1=?")]
hostname = socket.gethostname()
index = 0

app = Flask(__name__)

def get_redis():
    if not hasattr(g, 'redis'):
        g.redis = Redis(host="redis", db=0, socket_timeout=5)
    return g.redis

@app.route("/", methods=['POST','GET'])
def hello():
    voter_id = request.cookies.get('voter_id')
    if not voter_id:
        voter_id = hex(random.getrandbits(64))[2:-1]

    vote = None

    global index
    if request.method == 'POST':
        redis = get_redis()
        vote = request.form['vote']
        question_vote = str(index)+":"+vote
        data = json.dumps({'voter_id': voter_id, 'vote': question_vote})
        redis.rpush('votes', data)
        if index < 2:
			index = index + 1

    resp = make_response(render_template(
        'index.html',
        option_a=option_a[index],
        option_b=option_b[index],
		question=question[index],
        hostname=hostname,
        vote=vote,
    ))
    resp.set_cookie('voter_id', voter_id)
    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
