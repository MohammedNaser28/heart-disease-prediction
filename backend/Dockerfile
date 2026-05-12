# Use a Python base image that matches common Colab environments
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install dependencies[cite: 2]
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
# This includes api.py, the core/ logic, and the assets/ folder with .pkl files
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8000

# Command to run the API using Uvicorn
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]