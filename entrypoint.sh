#!/bin/sh
set -e

echo "⏳  Waiting for PostgreSQL at $PGHOST:$PGPORT..."
until python - <<'EOF'
import os, sys, time
import psycopg2
url = os.environ["DATABASE_URL"]
try:
    psycopg2.connect(url).close()
    sys.exit(0)
except Exception:
    sys.exit(1)
EOF
do
  sleep 2
done
echo "✅  PostgreSQL is ready."

echo "🔄  Running Alembic migrations..."
alembic upgrade head
echo "✅  Migrations complete."

echo "🚀  Starting uvicorn..."
exec uvicorn server:app --host 0.0.0.0 --port 8000
