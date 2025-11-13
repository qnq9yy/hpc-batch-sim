from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route("/health")
def health():
    return jsonify({"status": "ok", "jobs_dir": os.path.exists("outputs")})

@app.route("/jobs/count")
def jobs_count():
    job_files = [f for f in os.listdir("outputs") if f.startswith("job_") and f.endswith(".csv")]
    return jsonify({"num_jobs": len(job_files)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
