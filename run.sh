#!/bin/bash

# --- 1. Start Wall Time Measurement (Observability) ---
START_TIME=$(date +%s.%N)

# Create outputs directory inside the container
mkdir -p outputs

echo "Running scheduler once to generate CSV files..."
python src/scheduler.py

# --- 2. End Wall Time Measurement & Report ---
END_TIME=$(date +%s.%N)
WALL_TIME=$(echo "$END_TIME - $START_TIME" | bc)
echo "--- OBSERVABILITY METRICS ---"
echo "Total Scheduler Wall Time: $WALL_TIME seconds"
echo "---"

# Save metrics to a file for the report generation step
echo "Wall Time: $WALL_TIME seconds" > outputs/metrics.log
echo "Status: SUCCESS" >> outputs/metrics.log

# Check if the CI_TEST variable is set. If so, exit here.
if [ "$CI_TEST" = "true" ]; then
    echo "CI_TEST mode detected. Exiting script after simulation run."
    exit 0
fi

# --- 3. Start API (Only runs when CI_TEST is NOT set) ---
echo "Starting API for local/cloud use..."
python src/api.py
