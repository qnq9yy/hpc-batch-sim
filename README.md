# HPC Batch Simulation with API and Docker

## Executive Summary

**Problem:**  
Simulate multiple batch jobs in a high-performance computing (HPC) style environment, while providing a simple API to check system health.  

**Solution:**  
A Python-based batch job scheduler that runs multiple simulated jobs, generates CSV outputs, and exposes a Flask API health endpoint. The project is fully containerized using Docker for reproducibility.

---

## System Overview

**Course Concepts:**  
- HPC job orchestration using Python multiprocessing  
- Flask API for health check and job configuration endpoint  
- Docker containerization  

**Architecture Diagram:**  
![Architecture](assets/architecture.png)

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

**Run the container with 5 jobs and mount outputs folder:**

```bash
docker run --rm -v $(pwd)/outputs:/app/outputs -e NUM_JOBS=5 -e API_PORT=8080 hpc-batch-sim:latest
```
## How to Test the API

### Environment Variables
Use a .env file to configure runtime options (see .env.example):
```bash
NUM_JOBS=5
API_PORT=8080
```

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
```cvs 
job_1.csv  job_2.csv  job_3.csv  job_4.csv  job_5.csv
```

### Contents of job_1.csv (first 5 lines)
```bash
numbers,sum,mean
"[84, 62, 95, 76, 74, 93, 33, 2, 69, 20]",608,60.8
```



### Additional Assets
assets/full_batch_log.txt – full batch run log
assets/job_1_snippet.txt – snippet showing contents of one CSV file
assets/architecture.png – architecture diagram
 
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