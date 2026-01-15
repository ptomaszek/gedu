#!/bin/zsh

# ===== CONFIG =====
NPM_SERVICE="app"   # <-- change this to your Node service name
# ==================

# Check if Docker is running, if not start it
if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. Starting Docker..."
    sudo systemctl start docker
    sleep 3
fi

ALL_DESTRUCTION=false
RUN_NPM=false

# Parse flags
for arg in "$@"; do
    case "$arg" in
        --all)
            ALL_DESTRUCTION=true
            ;;
        --npm)
            RUN_NPM=true
            ;;
    esac
done

if $ALL_DESTRUCTION; then
    echo "Performing all Docker environment destruction..."
    docker-compose down --rmi all --volumes --remove-orphans
    echo "All destruction complete. Rebuilding and starting containers..."
else
    echo "Restarting Docker containers..."
    docker-compose down
fi

# Build and start containers
docker-compose up --build -d

# Run npm install if requested
if $RUN_NPM; then
    echo "Running npm install inside container..."
    docker-compose exec "$NPM_SERVICE" npm install
    echo "npm install completed."
fi
