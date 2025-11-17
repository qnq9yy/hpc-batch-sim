# HPC Batch Simulation with API and Docker

## Executive Summary

**Problem:**  
High-performance computing (HPC) environments often require running multiple batch jobs efficiently, but users need a simple way to monitor system health and job progress without complex infrastructure. This project addresses that gap for developers, students, or researchers who want to simulate HPC-style batch processing on a local machine.

**Solution:**  
This project provides a Python-based batch job scheduler that simulates multiple jobs, generates CSV outputs with basic statistics, and exposes a minimal Flask API for checking system health and job configuration. The entire environment is containerized with Docker, allowing anyone to run the simulation reproducibly with a single command, without needing access to an actual HPC cluster.
## System Overview

**Course Concepts:**  
- HPC job orchestration using Python multiprocessing: Simulates multiple batch jobs efficiently on a local machine
- Flask API: Provides a minimal health check endpoint and job configuration endpoint
- Docker containerization: Ensures reproducible and portable execution of the application

**Architecture Diagram:**  
<img width="511" height="424" alt="Screenshot 2025-11-17 at 10 53 42 AM" src="https://github.com/user-attachments/assets/9392d823-99c8-4e14-a286-105fbf4bd652" />

**Data/Models/Services:**  
- Job outputs: CSV files with simulated numbers, sum, and mean  
- Flask API: `/health` endpoint returning job directory status and `/jobs/count` for configuration
- Docker container ensures reproducible environment  

---

## How to Run (Local)

**Build the Docker image:**

```bash
docker build -t hpc-batch-sim:latest .
```

## One-Commmand Launch
You can run the HPC batch simulation and start the API in a single command:
```bash
docker run --rm -p 8080:8080 \
    -v $(pwd)/outputs:/app/outputs \
    -e NUM_JOBS=5 \
    -e API_PORT=8080 \
    hpc-batch-sim:latest
```

What this does:
- Runs the batch simulation with NUM_JOBS=5 jobs
- Saves output CSVs to your local outputs/ folder
- Starts the Flask API accessible at http://localhost:8080
- Automatically cleans up the container when you stop it (--rm)


## How to Test the API

### Environment Variables
Use a .env file to configure runtime options (see .env.example):
```bash
NUM_JOBS=5
API_PORT=8080
```

### Smoke Test
Run a minimal test to verify that the Docker container and API are running correctly:
```bash
python tests/smoke_test.py
```

This script will:
- Generate a temporary Docker container running your batch simulation
- Check that the Flask API /health endpoint is reachable
- Confirm that the API reports the correct job configuration.

Note:
- The smoke test does not require any additional input; it uses default environment variables defined in .env.example.
- It is designed to run on a clean system to ensure reproducibility.
- If port 8080 is in use, stop the conflicting container:
```bash
docker ps
docker stop <CONTAINER_ID>
```

Sample Output:
✅ Smoke test passed: API running and health OK.


### Check the Flask health endpoint:
```bash
curl http://localhost:8080/health
```

### Sample Output
```json
{"jobs_dir":true,"status":"ok"}
```

### Check the number of configured jobs:
```bash
curl http://localhost:8080/jobs/count
```


### Sample Output
```json
{"num_jobs":5}
```

### Generated Output Files
```csv 
job_1.csv  job_2.csv  job_3.csv  job_4.csv  job_5.csv
```

### Contents of job_1.csv (first 5 lines)
```bash
numbers,sum,mean
"[84, 62, 95, 76, 74, 93, 33, 2, 69, 20]",608,60.8
```

### Assets Layout
- assets/full_batch_log.txt : full batch run log
- assets/job_1_snippet.txt : snippet showing contents of one CSV file
- assets/health_endpoints.txt : sample output of health endpoint
- assets/jobs_count_endpoint.txt : sample output of jobs count endpoint
- all images that end in .png show what the file name states
 
### Design Decisions
- Python multiprocessing: Simulates HPC batch jobs efficiently on a local machine
- Flask API: Provides a minimal health check endpoint; easy to extend in future
- Docker containerization: Ensures reproducible environment and portability

### Tradeoffs:
- Performance is limited by local machine resources
- Single container only; not distributed across multiple nodes

### What’s Next
- Extend simulation to multiple containers to mimic a cluster
- Add more detailed logging, metrics, and job status reporting
- Optional deployment to cloud environments

### Links
GitHub Repo: https://github.com/natalie-s11/hpc-batch-sim
