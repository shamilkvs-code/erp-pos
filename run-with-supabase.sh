#!/bin/bash

# Set your Supabase database password here
export SUPABASE_PASSWORD="ErpPos2024!"

# Run the Node.js server
echo "Starting Node.js server with Supabase connection..."
cd frontend
node --experimental-modules server-cloud.js
