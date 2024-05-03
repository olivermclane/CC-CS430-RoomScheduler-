# CSSeniorProject-RoomScheduler

This project is designed for Carroll College to facilitate room scheduling and optimization. It utilizes Django for the backend to carry out basic crud operations and React for the frontend to dynamically load and visualize the data.

## Prerequisites

Before you begin, ensure you have installed the following:

-   [Python](https://www.python.org/downloads/) (version as per the requirement of the project, ideally 3.8 or newer)

-   [Docker](https://docs.docker.com/get-docker/) for containerization of the application

-   [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) for managing frontend dependencies

## Setup

To get this project running locally, follow these steps.

### Cloning the Repository

Start by cloning the repository to your local machine:

```         
git clone https://github.com/olivermclane/CC-CS430-RoomScheduler
cd CC-CS430-RoomScheduler
```
### Using docker-compose.yaml - Option 1
The docker-compose.yml, is a dockerfile containing most of the requirements for the project. It allows us to use services such as Nginix to reverse proxy, serve static and cache request.
To get started with docker compose:

Copy the `.env.template` file to create a `.env` file and fill in the required environment variables:

```         
cp .env.template .env
```
These values should be set as such:
 - DB_NAME: `Name of database`
 - DB_USER: `Username for database`
 - DB_PASSWORD: `Password for database`
 - DB_HOST: `Host for the database` suggested db
 - DEBUG: 'True'
 - SECRET_KEY: `Any string` but do not share


Once these values have been filled in we are ready to build the frontend.

Verify that the file in `djangofrontend/build/static/js/main.<hash>.js` and `djangofrontend/build/static/css/main.<hash>.js`
match the file names described in templates/index.html.

Once that is done, we are read to our docker-compose.yml. Make sure docker is open and running then run the following to start the all the containers:

```bash
docker-compose up -d --build
```
Now visit [here](http://localhost), enjoy the room_scheduler app. 

#### Notes
- Allows all the services a second to start up otherwise you will be redirected to a NGINX error.
- Validate the hash from the build directory in the djangofrontend for both css and js are in our templates/index.html.

### Using the local environment - Option 2

Create a virtual environment and activate it:

### For Mac/Linux Users

```         
python -m venv .venv
source .venv/bin/activate  
```

#### For Windows Users

``` bash
python -m venv .venv
.venv\Scripts\activate
```

### Installing Dependencies

Install the required Python packages:

```         
pip install -r requirements.txt
```

For the React frontend, navigate to the `djangofrontend` directory and install the required npm packages:

```         
cd djangofrontend
npm install
npm run build
```

- Validate the hash from the build directory in the djangofrontend for both css and js are in our templates/index.html.

### Setting Up Environment Variables

Copy the `.env.template` file to create a `.env` file and fill in the required environment variables:

```         
cp .env.template .env
```

Edit the `.env` file to include your database credentials and other necessary configurations.

These values should be set as such:
 - DB_NAME: `Name of database`
 - DB_USER: `Username for database`
 - DB_PASSWORD: `Password for database`
 - DB_HOST: `Host for the database` suggested localhost
 - DEBUG: 'False'
 - SECRET_KEY: `Any string` but do not share

Once these values have been filled in we are ready to start our docker-compose.yml. Run the following to start the all the containers:

### Running the Docker Container for local database

To set up the PostgreSQL database using Docker, build the Docker container with the following command:

```         
docker build -f dockerfile.yaml -t roomscheduler-db .
```

Then, run the Docker container:

```         
docker run -d -p 5432:5432 roomscheduler-db
```

This will start a PostgreSQL instance running as specified in the `dockerfile.yaml`.

### Running the Application

Navigate to the back to `django_react_roomscheduler`.

##### Following readme?:

``` bash
cd ..
```

To run the Django backend, navigate back to the root directory and execute:

``` bash
python manage.py migrate
python manage.py runserver
```

You can additionally run the React server independently using npm start
``` bash
npm start
```
## Deployment & Requirements
### Requirements 
#### CPU:
- Minimum: 1 CPU core
- Recommended: 2 CPU cores
- Explanation: A single CPU core should be sufficient for handling the expected load of 10-20 users, but having two CPU cores can provide better performance and scalability, especially if the application experiences occasional spikes in traffic or concurrent requests.
#### Memory (RAM):
- Minimum: 2 GB RAM
- Recommended: 4 GB RAM
- Explanation: Allocate sufficient memory to ensure smooth operation of both the Django backend and the PostgreSQL database. 2 GB should be adequate for basic usage, but 4 GB is recommended for better performance, especially if the application grows or handles more concurrent users.
#### Storage:
- Minimum: 20 GB SSD
- Recommended: 50-100 GB SSD
- Explanation: Allocate enough storage space for the Django application code, database files, and any additional files or static files. SSD storage is preferred for better performance compared to HDD.
#### Operating System:
- Linux-based operating system (e.g., Ubuntu Server)
 - Explanation: Linux is a common choice for hosting web applications due to its stability, security, and compatibility with Django and PostgreSQL.
#### Database:
- PostgreSQL database server
#### Web Server:
- Gunicorn or uWSGI as the Django application server
- Explanation: Gunicorn or uWSGI can serve as the interface between Django and the web server (e.g., Nginx) and handle incoming HTTP requests efficiently.
#### Web Server +:
- Nginx as the reverse proxy server
- Explanation: Nginx can serve static files, cache requests, and act as a reverse proxy for handling incoming requests to the Django application. It improves performance and security.
### Deployment
This application will need to be deployed. Here is our suggestion:

-   **Docker Compose**: For simplifying multi-container Docker applications. You can define and run multi-container Docker applications with a single file.

## Additional Information

-   **Frontend Development**: The React frontend is located in the `djangofrontend` directory. For development, use `npm start` to run the React development server.

-   **Backend Development**: The Django backend codebase is located under `roomschedulerapi`. You can add new apps, models, or views as needed for project expansion.
