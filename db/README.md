# Test Database 
db.forecasts contains BTC and ETH forecasts written by the ML backend. Intended use is for testing with the Javascript front/backend.

### 1. Start Mongo
`docker run -p 27017:27017 -v $(pwd):/out --name db -d mongo`

### 2. Start shell in container
`docker exec -it db bash`  
### 3. Load the db 
`cd /out && mongorestore dump`  

Mongo is now accessible at the default `localhost:2017`.

## Abbreviated example of each document in db.forecasts
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