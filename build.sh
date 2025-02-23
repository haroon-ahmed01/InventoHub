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

# Ensure Django settings module is set
export DJANGO_SETTINGS_MODULE="inventory_project.settings"

echo "Environment variables (safe to display):"
echo "PYTHONPATH: $PYTHONPATH"
echo "DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"
echo "ALLOWED_HOSTS: $ALLOWED_HOSTS"
echo "DEBUG: $DEBUG"
echo "DATABASE_URL exists: $(if [ -n "$DATABASE_URL" ]; then echo "yes"; else echo "no"; fi)"

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
while ! python -c "import psycopg2; psycopg2.connect()" 2>/dev/null; do
  sleep 1
done

echo "Making migrations..."
python manage.py makemigrations --noinput

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --no-input --verbosity 2 