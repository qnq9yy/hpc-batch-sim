#!/bin/bash

# --- Start Wall Time Measurement (Observability) ---
START_TIME=$(date +%s.%N)

# Create outputs directory inside the container
mkdir -p outputs

echo "Running scheduler once to generate CSV files..."
python src/scheduler.py
# Note: For CI, we often skip the API that runs forever. 
# We just let the scheduler run, and then exit.
# If your scheduler finishes and the script stops, this is perfect for CI.

# --- End Wall Time Measurement ---
END_TIME=$(date +%s.%N)
WALL_TIME=$(echo "$END_TIME - $START_TIME" | bc)

# Report the metric—this is your Observability Output!
echo "--- OBSERVABILITY METRICS ---"
echo "Total Simulation Wall Time: $WALL_TIME seconds"
echo "---"
