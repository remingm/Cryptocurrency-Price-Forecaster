# ML Backend Server

Temporal convolutional network that uses 90+ features and technical indicators to forecast smoothed price.

1. Get data: `get_data.py`
2. Generate factors/features: `generate_factors.py`
3. Train models: `training.py`
4. Forecast: `training.py`
5. Format and write to mongo:`output.py`

There are two installation options: Docker or Conda.

## Required environment variables
```
MONGODB_URI
DB_USERNAME
DB_PASSWORD
```
See `docker-compose.yml` for examples. If these are not provided `MONGODB_URI` will default to `localhost`.

## Docker Compose
This starts the ML backend and Mongo at port 27017. The ML backend will continuously populate the Mongo DB with forecasts. Run all commands from this directory.

Start with verbose output:  
`docker-compose up`  
Or run in background:  
`docker-compose up -d`  

When done, stop and remove containers:   
`docker-compose down`

**Extra commands:**

Stop but keep containers (saves build time):  
`docker-compose stop`  
Stop and remove containers and db data:  
`docker-compose down --volumes` 

Optional:  
- Change database name in `config.py`.
- Customize the Mongo port and db data directory in `docker-compose.yml`
- If you don't need a Mongo container then comment out the entire mongo block in `docker-compose.yml` and update `MONGO_HOST` (probably to an AWS host).
- Customize coins and timeperiods in `config.py`.

## MongoDB Info

After running `docker-compose up`, Mongo will be accessible at the default `localhost:2017`.

Change database name in `config.py`.

Here's how to inspect the database:
###Start shell in container
`docker exec -it ml_backend_mongo_1 bash`  

###Show the DB
Run `mongo` to enter the mongo shell. Then, from within the mongo shell, run:

`use db_name`

then to print db results similar to as shown below, run:

`db.forecasts.find({"symbol": "BCH-USD", "period": "1d"}).pretty()`

### DB Schema
```
{{
    "symbol": "BCH-USD",
    "past": [
        {
            "timestamp": 1638748800000,
            "close": 475.66
        },
        {
            "timestamp": 1638835200000,
            "close": 474.29
        },
        {
            "timestamp": 1638921600000,
            "close": 480.12
        },
        {
            "timestamp": 1639008000000,
            "close": 466.08
        }
    ],
    "prediction": [
        {
            "timestamp": 1639094400000,
            "close": 466.08
        },
        {
            "timestamp": 1639180800000,
            "close": 466.97
        },
        {
            "timestamp": 1639267200000,
            "close": 448.7
        },
        {
            "timestamp": 1639353600000,
            "close": 460.62
        }
    ],
    "period": "1d",
    "MAPE": -1
}
```



## Conda

### Install 
```
# Download and install miniconda locally (Linux)
wget --prefer-family=IPv4 https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
bash miniconda.sh

# For Windows or Mac get the installer here: https://docs.conda.io/en/latest/miniconda.html

# Create conda environment
conda env create --file ml_backend_conda.yml
```

### Run
`python3 ml_pipeline.py`

R&D notebook contains factor and model research and development. 
