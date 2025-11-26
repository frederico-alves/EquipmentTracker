# Equipment Tracker

- backend
- frontend

## Run project from Docker

1. Build container:

```
docker-compose build --no-cache
```

2. Run container:

```
docker-compose up -d
```

3. Stop container:

```
docker-compose down
```

## Backend

http://localhost:5284/swagger
http://localhost:5284/api/equipment

### Connect to the database

```
# Connect to PostgreSQL
docker exec -it equipment-db psql -U postgres -d equipment_tracker

# List tables
\dt

# Query equipment
SELECT * FROM equipment;

# Query state changes
SELECT * FROM state_changes;

# Exit
\q
```

## Frontend

```
cd frontend
npm i && npm run dev
```
