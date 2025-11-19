import os
from flask import Flask, jsonify, send_from_directory

# Absolute paths relative to THIS file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")
OUTPUTS_DIR = os.path.join(BASE_DIR, "..", "outputs")

app = Flask(__name__)

@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "jobs_dir": os.path.exists(OUTPUTS_DIR)
    })

@app.route("/jobs/count")
def jobs_count():
    if not os.path.exists(OUTPUTS_DIR):
        return jsonify({"num_jobs": 0})

    job_files = [
        f for f in os.listdir(OUTPUTS_DIR)
        if f.startswith("job_") and f.endswith(".csv")
    ]
    return jsonify({"num_jobs": len(job_files)})

@app.route("/outputs/<filename>")
def serve_output(filename):
    return send_from_directory(OUTPUTS_DIR, filename)

@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def frontend_files(path):
    return send_from_directory(FRONTEND_DIR, path)

@app.route("/rerun", methods=["POST"])
def rerun():
    # You can later re-enable this if needed
    # from scheduler import run_jobs
    # run_jobs()
    return jsonify({"status": "rerunning"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)