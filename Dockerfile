# Use an official Python runtime as a parent image
FROM python:alpine AS base

# Set up a non-root user and working directory
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app

# Copy only the necessary files for dependency installation
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt --no-cache-dir

# Use multistage build to create a separate build stage
FROM base AS builder

# Copy the rest of the application code
COPY --chown=appuser:appgroup . .

# New stage for building the web assets
FROM node:lts-alpine AS web_builder

# Initialize pnpm globally
RUN corepack enable

# Set up a non-root user and working directory for the web project
RUN addgroup -S webgroup && adduser -S webuser -G webgroup
USER webuser
WORKDIR /web

# Copy the package.json and pnpm-lock.yaml files for dependency installation
COPY --chown=webuser:webgroup web/package.json web/pnpm-lock.yaml ./

# Install the web project dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the web project files
COPY --chown=webuser:webgroup web/ .

# Build the web project
RUN pnpm build

# Switch back to the base image
FROM base

# Copy the compiled application from the builder stage
COPY --from=builder --chown=appuser:appgroup /app /app

# Copy the built web assets to /website
COPY --from=web_builder --chown=appuser:appgroup /web/dist /app/website

# Set the environment variables
ENV PORT=${PORT}
ENV HOST=${HOST:-0.0.0.0}

# Make the container executable and run the application
ENTRYPOINT ["python3"]
CMD ["serve.py"]
