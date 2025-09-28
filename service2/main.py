# import flask module
from flask import Flask, Response
import shutil
import time
from datetime import datetime
import requests

# instance of flask application
app = Flask(__name__)
start_time = time.time()

def make_record():
    time_now = time.time()
    timestamp = datetime.fromtimestamp(time_now).isoformat()   
    uptime = (time_now-start_time)/3600

    total, used, free = shutil.disk_usage("/")
    mb = 1024*1024

    record = f"{timestamp}: uptime {uptime:.2f} hours, free disk in root: {free/mb:.2f} Mbytes"
    return record

# A route to return status
@app.route("/status", methods=["GET"])
def status():
    # Make record2
    record = make_record()

    # Send to storage
    requests.post("http://storage:5001/log", data=record)
    # vstorage?

    # Return record2
    return Response(record, mimetype='text/plain')
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)