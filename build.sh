#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current directory:"
pwd
echo "Directory contents:"
ls -la

# Install system dependencies
if [ -f /etc/debian_version ]; then
    echo "Installing PostgreSQL client..."
    apt-get update
    apt-get install -y postgresql-client
fi

echo "Installing dependencies..."
pip install -r requirements.txt

# Create the Python path if it doesn't exist
export PYTHONPATH="/opt/render/project/src:${PYTHONPATH:-}"

echo "Python path:"
echo $PYTHONPATH

echo "Environment variables (safe to display):"
echo "PYTHONPATH: $PYTHONPATH"
echo "DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"
echo "ALLOWED_HOSTS: $ALLOWED_HOSTS"
echo "DEBUG: $DEBUG"
echo "DATABASE_URL exists: $(if [ -n "$DATABASE_URL" ]; then echo "yes"; else echo "no"; fi)"

echo "Making migrations..."
python manage.py makemigrations

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --no-input --verbosity 2 