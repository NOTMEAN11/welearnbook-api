# Start the Docker Compose services in detached mode
docker-compose up -d

# Wait for a moment to ensure services are up and running (adjust the sleep duration as needed)
Start-Sleep -Seconds 10

# Run 'yarn dev' in the appropriate directory
# Replace 'C:\path\to\your\project' with the actual path to your project
# Set-Location -Path 'C:\path\to\your\project'
yarn dev
