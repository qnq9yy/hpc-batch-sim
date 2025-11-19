#!/bin/bash

# Create outputs directory inside the container
mkdir -p outputs

echo "Running scheduler once to generate CSV files..."
python src/scheduler.py

echo "Starting API..."
python src/api.py
