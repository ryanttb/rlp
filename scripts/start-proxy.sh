#!/bin/bash

# RLP Cloud SQL Proxy Script
# This script starts the Cloud SQL Proxy to connect to the private Cloud SQL instance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔗 Starting Cloud SQL Proxy${NC}"

# Configuration
PROJECT_ID=${PROJECT_ID:-"rlp-online"}
REGION=${REGION:-"us-central1"}
INSTANCE_NAME="${PROJECT_ID}-postgres-dev"
CONNECTION_NAME="${PROJECT_ID}:${REGION}:${INSTANCE_NAME}"

# Check if gcloud is authenticated
check_auth() {
    echo -e "${YELLOW}Checking GCP authentication...${NC}"
    
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        echo -e "${RED}❌ Not authenticated with Google Cloud${NC}"
        echo -e "${YELLOW}Please run: gcloud auth login${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ GCP authentication verified${NC}"
}

# Start the proxy
start_proxy() {
    echo -e "${YELLOW}Starting Cloud SQL Proxy for: $CONNECTION_NAME${NC}"
    echo -e "${YELLOW}Proxy will be available at: localhost:5432${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the proxy${NC}"
    echo ""
    
    # Start the proxy in the background
    ./cloud-sql-proxy $CONNECTION_NAME --port=5432 --private-ip &
    PROXY_PID=$!
    
    # Wait a moment for the proxy to start
    sleep 3
    
    # Check if proxy is running
    if kill -0 $PROXY_PID 2>/dev/null; then
        echo -e "${GREEN}✅ Cloud SQL Proxy started successfully${NC}"
        echo -e "${GREEN}Database connection available at: localhost:5432${NC}"
        echo -e "${YELLOW}Proxy PID: $PROXY_PID${NC}"
        echo ""
        echo -e "${YELLOW}You can now run: npm run db:setup${NC}"
        echo -e "${YELLOW}Or connect directly with: psql postgresql://rlp_user:password@localhost:5432/rlp_database${NC}"
        echo ""
        
        # Wait for user to stop
        echo -e "${YELLOW}Proxy is running. Press Ctrl+C to stop...${NC}"
        wait $PROXY_PID
    else
        echo -e "${RED}❌ Failed to start Cloud SQL Proxy${NC}"
        exit 1
    fi
}

# Stop the proxy
stop_proxy() {
    echo -e "${YELLOW}Stopping Cloud SQL Proxy...${NC}"
    if [ ! -z "$PROXY_PID" ]; then
        kill $PROXY_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ Cloud SQL Proxy stopped${NC}"
}

# Handle script termination
trap stop_proxy EXIT INT TERM

# Main execution
main() {
    check_auth
    start_proxy
}

# Run main function
main "$@"
