#!/bin/bash
# Make sure outputs folder exists
mkdir -p outputs

# Run batch jobs
python src/scheduler.py

# Run API
python src/api.py
