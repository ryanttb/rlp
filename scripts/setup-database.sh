#!/bin/bash

# RLP Database Setup Script
# This script sets up the PostgreSQL database schema using Prisma

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🗄️  Starting RLP Database Setup${NC}"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local file not found${NC}"
    echo -e "${YELLOW}Please copy env.example to .env.local and configure your database URL${NC}"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env.local; then
    echo -e "${RED}❌ DATABASE_URL not found in .env.local${NC}"
    echo -e "${YELLOW}Please add your PostgreSQL connection string to .env.local${NC}"
    exit 1
fi

# Check if required tools are installed
check_requirements() {
    echo -e "${YELLOW}Checking requirements...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    if ! command -v npx &> /dev/null; then
        echo -e "${RED}❌ npx is not available. Please install Node.js with npm.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All requirements met${NC}"
}

# Install dependencies if needed
install_dependencies() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    
    if [ ! -d "node_modules" ]; then
        npm ci
    else
        npm install
    fi
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Generate Prisma client
generate_prisma_client() {
    echo -e "${YELLOW}Generating Prisma client...${NC}"
    
    npx prisma generate
    
    echo -e "${GREEN}✅ Prisma client generated${NC}"
}

# Push database schema
push_database_schema() {
    echo -e "${YELLOW}Pushing database schema...${NC}"
    
    # Test database connection first
    echo -e "${YELLOW}Testing database connection...${NC}"
    npx prisma db pull --print
    
    # Push the schema
    npx prisma db push
    
    echo -e "${GREEN}✅ Database schema pushed successfully${NC}"
}

# Seed database with initial data (optional)
seed_database() {
    echo -e "${YELLOW}Seeding database with initial data...${NC}"
    
    if [ -f "src/lib/databaseSeeder.ts" ]; then
        npx tsx src/lib/databaseSeeder.ts
        echo -e "${GREEN}✅ Database seeded successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  No database seeder found, skipping seeding${NC}"
    fi
}

# Show database status
show_database_status() {
    echo -e "${YELLOW}Database status:${NC}"
    
    npx prisma studio --port 5555 &
    STUDIO_PID=$!
    
    echo -e "${GREEN}✅ Prisma Studio started on http://localhost:5555${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop Prisma Studio${NC}"
    
    # Wait for user to stop
    wait $STUDIO_PID
}

# Main setup flow
main() {
    check_requirements
    install_dependencies
    generate_prisma_client
    push_database_schema
    seed_database
    
    echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
    echo -e "${GREEN}Your PostgreSQL database is now ready for use${NC}"
    
    # Ask if user wants to open Prisma Studio
    read -p "Do you want to open Prisma Studio to view your database? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        show_database_status
    fi
}

# Run main function
main "$@"
