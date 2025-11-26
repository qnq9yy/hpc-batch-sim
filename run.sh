#!/bin/bash

# --- 1. Start Wall Time Measurement (Observability) ---
# Record the current time with high precision
START_TIME=$(date +%s.%N)

# Create outputs directory inside the container
mkdir -p outputs

echo "Running scheduler once to generate CSV files..."
# Run the core simulation/data generation component
python src/scheduler.py

# --- 2. End Wall Time Measurement ---
# Record the time immediately after the critical component finishes
END_TIME=$(date +%s.%N)
# Calculate the difference (bc is used for floating point math in Bash)
WALL_TIME=$(echo "$END_TIME - $START_TIME" | bc)

# Report the metric
echo "--- OBSERVABILITY METRICS ---"
echo "Total Scheduler Wall Time: $WALL_TIME seconds"
echo "---"

# --- 3. Start API (If successful) ---
echo "Starting API..."
# Note: This command will keep the container running indefinitely
python src/api.py
