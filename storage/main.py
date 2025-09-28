# import flask module
from flask import Flask, Response
from flask import request

log_file = "/vstorage/log.txt"

# instance of flask application
app = Flask(__name__)

@app.route("/log", methods=["GET"])
def get_log():
    with open(log_file, "r") as f:
        return Response(f.read(), mimetype='text/plain')

@app.route("/log", methods=["POST"])
def post_log():
    with open(log_file, "a") as f:
        data = request.get_data(as_text=True)
        f.write(data + "\n")
        return Response("OK", mimetype='text/plain')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)