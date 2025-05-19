#!/bin/bash


cd "$(dirname "$0")/backend" || exit 1

# Activate Python virtual environment
source ../venv/bin/activate

python3 main.py &
BACKEND_PID=$!
cd ..

trap 'echo "Shutting down servers..."; kill $BACKEND_PID; exit 0' SIGINT SIGTERM EXIT

npm install
echo "The application will be available at http://localhost:5173"
npm run dev
