#!/bin/bash

# Set your Supabase database password here
export SUPABASE_PASSWORD="ErpPos2024!"

# Run the Spring Boot application with the cloud profile
echo "Starting Spring Boot application with Supabase connection..."
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=cloud
