# HPC Batch Simulation with API and Docker

## Executive Summary

**Problem:**  
High-performance computing (HPC) environments often involve running many batch jobs in parallel, but monitoring those jobs and the overall system health can be challenging without specialized tools. In academic settings, this challenge becomes even more pronounced. Students who are new to HPC concepts frequently struggle to understand how batch queues, resource allocation, and job scheduling work—especially when they do not have access to a full HPC cluster. They may rely on shared university systems with limited availability, steep learning curves, or strict usage policies that make experimentation difficult.

Similarly, developers or researchers working on small projects often need a way to test batch-style workflows locally without the overhead of learning complex cluster management tools or setting up full job schedulers. Traditional HPC monitoring tools can be overwhelming or inaccessible for beginners, leaving users without a clear way to observe how their jobs behave or how the system responds under load.

This project addresses these issues by providing a simple, accessible framework for running and tracking multiple batch jobs on a local machine. It allows users to mimic core aspects of HPC batch processing while offering an easy way to observe job status, resource usage, and system performance in real time. By lowering the barrier to entry, the tool helps students gain hands-on experience with HPC concepts, supports developers in prototyping workflows, and enables researchers to experiment without requiring full-scale HPC infrastructure.

**Solution:**  
This project provides a simple way to mimic how high-performance computing systems run many jobs at once, but without needing access to a real HPC cluster. It offers a lightweight tool that lets users simulate batches of tasks, view basic summaries of how those tasks performed, and check the system’s status through a small web interface. Everything runs inside a Docker container, so the whole setup can be launched with a single command, making it easy for students, developers, or researchers to experiment with HPC-style workflows on any computer.

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
