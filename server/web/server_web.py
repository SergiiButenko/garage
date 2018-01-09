from flask import Flask
from flask import jsonify
import logging

app = Flask(__name__)

logging.basicConfig(format='%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.DEBUG)


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/status")
def status():    
    return jsonify(branches=[
                    {'id': 1, 'status': 1},
                    {'id': 2, 'status': 0},
                    {'id': 3, 'status': 1},
                    {'id': 4, 'status': 1}])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7642)
