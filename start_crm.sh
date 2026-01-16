#!/bin/bash

# CRM System Launcher
echo "=========================================="
echo "   Beautiful CRM System - Launcher"
echo "=========================================="
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed."
    echo "Please install Python 3 to run the CRM system."
    exit 1
fi

echo "Python 3 found: $(python3 --version)"
echo ""

# Check if user wants to load sample data
if [ ! -f "crm_data.json" ]; then
    echo "No existing CRM data found."
    echo ""
    read -p "Would you like to load sample data for demonstration? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f "sample_crm_data.json" ]; then
            cp sample_crm_data.json crm_data.json
            echo "Sample data loaded successfully!"
            echo ""
        else
            echo "Sample data file not found. Starting with empty database."
            echo ""
        fi
    fi
fi

echo "Starting CRM System..."
echo ""
echo "Login credentials:"
echo "  Admin: username=admin, password=admin123"
echo "  Sales: username=sales, password=sales123"
echo ""

# Run the CRM application
python3 crm_app.py
