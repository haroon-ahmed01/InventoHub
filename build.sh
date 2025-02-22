#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current directory:"
pwd
echo "Directory contents:"
ls -la

echo "Installing dependencies..."
pip install -r requirements.txt

# Create the Python path if it doesn't exist
export PYTHONPATH="/opt/render/project/src:${PYTHONPATH:-}"

echo "Python path:"
echo $PYTHONPATH

echo "Collecting static files..."
python manage.py collectstatic --no-input --verbosity 2

echo "Running migrations..."
python manage.py migrate --verbosity 2 