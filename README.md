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
git clone https://github.com/olivermclane/CSSeniorProject-RoomScheduler
cd CSSeniorProject-RoomScheduler
```

### Setting Up the Virtual Environment

Create a virtual environment and activate it:

### For Mac Users

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
```

### Setting Up Environment Variables

Copy the `.env.template` file to create a `.env` file and fill in the required environment variables:

```         
cp .env.template .env
```

Edit the `.env` file to include your database credentials and other necessary configurations.

### Running the Docker Container

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

For the React frontend, ensure you're in the `djangofrontend` directory, then start the development server:

``` bash
cd djangofrontend      
npm start
```

## Deployment

This application can be deployed using various methods. Here are a few suggestions:

-   **Docker Compose**: For simplifying multi-container Docker applications. You can define and run multi-container Docker applications with a single file.

## Additional Information

-   **Frontend Development**: The React frontend is located in the `djangofrontend` directory. For development, use `npm start` to run the React development server.

-   **Backend Development**: The Django backend codebase is located under `roomschedulerapi`. You can add new apps, models, or views as needed for project expansion.
