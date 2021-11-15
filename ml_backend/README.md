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
- Customize the Mongo port and db data directory in `docker-compose.yml`
- If you don't need a Mongo container then comment out the entire mongo block in `docker-compose.yml` and update `MONGO_HOST` (probably to an AWS host).


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
