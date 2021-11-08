# ML Backend Server

1. Get data: `get_data.py`
2. Generate factors/features: `generate_factors.py`
3. Train models: `training.py`
4. Predict `training.py`
5. Format and write to mongo:`output.py`

## Install
```
# Download and install miniconda locally
wget --prefer-family=IPv4 https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
bash miniconda.sh

# Create conda environment
conda env create --file ml_backend_conda.yml
```

## Run
`python3 ml_pipeline.py`

R&D notebook contains factor and model research and development. 