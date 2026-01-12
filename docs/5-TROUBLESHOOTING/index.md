# 5. Troubleshooting Common Issues

This section lists common errors encountered during local development and provides solutions. If your issue is not listed here, please consult the **DevOps repository's issue tracker** for environment-related problems, or the respective component's tracker for code bugs.

## 5.1 Docker and Environment Issues

These issues usually occur during the initial setup phase (when running `docker compose up`).

### A. Error: Port Already in Use

**Symptom:** Docker Compose fails to start the NGINX or a frontend service, showing an error like `bind: address already in use`.

**Cause:** The port required by the NGINX container (e.g. `80` or `443`, or a local development port like `3000`) is currently being used by another application on your host machine.

**Solution:**

1.  **Identify the culprit:** Run a command to see what process is listening on the port (e.g., `lsof -i :80` on macOS/Linux or `netstat -ano | findstr :80` on Windows).
2.  **Stop the process** or **change the port** mapping in your **DevOps repository's `docker-compose.yml`** file to an unused port (e.g. map `80` to `8080`).

### B. Error: Cannot Resolve Hostname

**Symptom:** One container (e.g., the Backend) cannot communicate with another (e.g., the Database), resulting in errors like `connection refused` or `Unknown host 'db'`.

**Cause:** This usually means the containers are not on the same Docker network, or the service name in the configuration is incorrect.

**Solution:**

1.  Verify the internal service names (`db`, `backend`, etc.) in the `docker-compose.yml` file in the **DevOps repository**.
2.  Ensure the configuration in the **Backend** uses the correct service name (`db`) and not `localhost` for connecting to the database.

## 5.2 Application Connectivity (NGINX Routing)

These issues relate to the Reverse Proxy failing to correctly direct traffic.

### A. Error: Frontend Displays "404 Not Found" for API Calls

**Symptom:** The Frontend loads correctly, but all API calls (e.g., to `/api/v1/admins`) fail with a `404 Not Found` error.

**Cause:** The NGINX Reverse Proxy is receiving the request but doesn't have a configured `location` block to forward the `/api/v1/` path to the `backend` container.

**Solution:**

1.  Check the **DevOps repository's NGINX config file**.
2.  Ensure you have a `location /api/v1/` block that correctly proxies the request to the internal Docker service name of the backend (e.g., `proxy_pass http://backend:3000;`).

### B. Error: Frontend Fails to Load Static Assets

**Symptom:** The Main Frontend or Admin Panel loads without CSS or images, and the console shows errors retrieving static files.

**Cause:** The NGINX configuration of (Main or Admin) Frontend Service is not correctly set up to serve the static content from the built frontend application.

**Solution:**

1.  Verify the **`location /`** or similar blocks in the NGINX config that are responsible for serving the frontend static files.
2.  Ensure that the build process for the specific frontend is generating the static files in the location expected by the NGINX configuration.

## 5.3 Backend and API Errors

These are typical issues when the Backend is running but the logic is flawed.

### A. Error: "401 Unauthorized" with a Valid Token

**Symptom:** You are sending a JWT, but the API rejects it with a `401 Unauthorized` error.

**Cause:** This often means the Backend service is failing to read the token correctly, or the signing key is mismatched.

**Solution:**

1.  Check the **`JWT_ACCESS_SECRET`**, **`JWT_REFRESH_SECRET`** or **`HASH_SECRET`** environment variable in your local environment file (used by the Backend). It must exactly match the key used to sign the token.
2.  Verify the token format. The token must be preceded by the `Bearer` scheme: `Authorization: Bearer <token>`.

### B. Error: Backend Internal Server Error (500)

**Symptom:** The API returns a generic `500 Internal Server Error` message.

**Cause:** A runtime exception occurred in the backend application (e.g., a database connection failure, a null pointer, or unhandled exception).

**Solution:**

1.  **Check the logs:** Use `docker compose logs backend` to view the Node.js application output. The full stack trace will be there.
2.  **Set Debug Mode:** Ensure the `DEBUG=true` (or equivalent) environment variable is set for the backend locally. This may reveal more informative errors in the logs.
