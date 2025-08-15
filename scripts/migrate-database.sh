#!/bin/bash

# RLP Database Migration Script
# This script handles database migrations using Prisma

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Starting RLP Database Migration${NC}"

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

# Create migration
create_migration() {
    echo -e "${YELLOW}Creating new migration...${NC}"
    
    read -p "Enter migration name: " migration_name
    
    if [ -z "$migration_name" ]; then
        echo -e "${RED}❌ Migration name is required${NC}"
        exit 1
    fi
    
    npx prisma migrate dev --name "$migration_name"
    
    echo -e "${GREEN}✅ Migration created successfully${NC}"
}

# Apply pending migrations
apply_migrations() {
    echo -e "${YELLOW}Applying pending migrations...${NC}"
    
    npx prisma migrate deploy
    
    echo -e "${GREEN}✅ Migrations applied successfully${NC}"
}

# Reset database (WARNING: This will delete all data)
reset_database() {
    echo -e "${RED}⚠️  WARNING: This will delete all data in your database!${NC}"
    read -p "Are you sure you want to reset the database? (yes/no): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${YELLOW}Resetting database...${NC}"
        npx prisma migrate reset --force
        echo -e "${GREEN}✅ Database reset successfully${NC}"
    else
        echo -e "${YELLOW}Database reset cancelled${NC}"
    fi
}

# Show migration status
show_status() {
    echo -e "${YELLOW}Migration status:${NC}"
    
    npx prisma migrate status
}

# Generate Prisma client
generate_client() {
    echo -e "${YELLOW}Generating Prisma client...${NC}"
    
    npx prisma generate
    
    echo -e "${GREEN}✅ Prisma client generated${NC}"
}

# Show help
show_help() {
    echo -e "${GREEN}RLP Database Migration Script${NC}"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  create    - Create a new migration"
    echo "  apply     - Apply pending migrations"
    echo "  reset     - Reset database (WARNING: deletes all data)"
    echo "  status    - Show migration status"
    echo "  generate  - Generate Prisma client"
    echo "  help      - Show this help message"
    echo ""
}

# Main function
main() {
    case "${1:-help}" in
        "create")
            create_migration
            ;;
        "apply")
            apply_migrations
            ;;
        "reset")
            reset_database
            ;;
        "status")
            show_status
            ;;
        "generate")
            generate_client
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function
main "$@"
