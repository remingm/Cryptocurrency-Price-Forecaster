# ML Backend Server


1. Get data: `get_data.py`
2. Generate factors/features: `generate_factors.py`
3. Train models: `training.py`
4. Forecast: `training.py`
5. Format and write to mongo:`output.py`

#### To do: 
- config.yml for coins and periods

There are two options for installing: Docker or Conda.

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
####Start shell in container
`docker exec -it ml_backend-mongo-1 bash`  

####Show the DB
Run `mongo` to enter the mongo shell. Then, from within the mongo shell, run:

`use db_name`

then to print db results similar to as shown below, run:

`db.forecasts.find({"symbol": "ETH-USD", "period": "1h"}).pretty()`

### DB Schema
```
{
    "symbol": "ETH-USD",
    "past": {
        "close": {
            "1633870800000": 3549.58,
            "1633874400000": 3554.7,
            "1633878000000": 3558.1,
            "1633881600000": 3547.79,
            "1633885200000": 3522.21,
            "1633888800000": 3527.66,
            "1633892400000": 3533.44,
            "1633896000000": 3513.87,
            "1633899600000": 3456.59,
            "1633903200000": 3467.77,
            "1633906800000": 3415.68,
            "1633910400000": 3443.27,
            "1633914000000": 3456.98
        }
    },
    "prediction": {
        "close": {
            "1633917600000": 3515.58,
            "1633921200000": 3476.88,
            "1633924800000": 3492.24,
            "1633928400000": 3473.95,
            "1633932000000": 3511.97,
            "1633935600000": 3506.59,
            "1633939200000": 3517.43,
            "1633942800000": 3507.28,
            "1633946400000": 3500.86,
        }
    },
    "period": "1h",
    "MAPE": 4.084071411815125
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
