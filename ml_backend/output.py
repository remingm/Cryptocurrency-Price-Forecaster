import pymongo
import pprint
import json
import pandas as pd
import os


def reverse_transform(scaler, scaled, prediction, target_var):
    # JSON out
    past_close = scaler.inverse_transform(scaled)["close"].pd_dataframe()
    prediction = scaler.inverse_transform(prediction)[target_var].pd_dataframe()

    return past_close, prediction


def format_timestamp_index(past_close, df, prediction):
    # Set index to Unix timestamps
    past_close.set_index(df["UTC timestamp"][: len(past_close)], inplace=True)

    # Write future timestamps to predictions
    timestamp_len_ms = past_close.index[1] - past_close.index[0]
    future_timestamps = []
    for i in range(1, len(prediction) + 1):
        timestamp = past_close.index[-1] + timestamp_len_ms * i
        future_timestamps.append(timestamp)
    prediction.set_index(pd.Series(future_timestamps), inplace=True)
    prediction = prediction.round(2)
    return past_close, prediction


def format_json(symbol, period, past_close, prediction, backtest_mape):
    return_dict = {
        "symbol": symbol,
        "past": json.loads(past_close.to_json()),
        "prediction": json.loads(prediction.to_json()),
        "period": period,
        "MAPE": backtest_mape,
    }

    # json.dump(return_dict, open(f"{symbol}.json",'w'), indent=4)
    # print(json.dumps(return_dict, indent=4))
    return return_dict


def write_to_db(forecasts, DB_NAME):
    # Write forecasts to mongo
    if "MONGO_HOST" not in os.environ.keys():
        os.environ["MONGO_HOST"] = "localhost"
    mongo_host = os.environ["MONGO_HOST"]

    client = pymongo.MongoClient(mongo_host, 27017)
    db = client[DB_NAME]  # todo new db name

    for f in forecasts:
        db.forecasts.delete_many({"symbol": f["symbol"], "period": f["period"]})
        db.forecasts.insert_one(f)

    # Debugging
    if False:
        cursor = db.forecasts.find({})
        for c in cursor:
            print(c["symbol"], "is in db.forecasts")

        cursor = db.forecasts.find()

        # pprint.pprint(cursor)
        for c in cursor:
            pprint.pprint(c.keys())


# todo create coin object to store all these vars as fields
def output_pipeline(DB_NAME, coin):
    past_close, prediction = reverse_transform(
        coin.scaler, coin.scaled, coin.prediction, coin.target_var
    )
    coin.past_close, coin.prediction = format_timestamp_index(
        past_close, coin.df, prediction
    )
    coin.return_dict = format_json(
        coin.symbol, coin.period, coin.past_close, coin.prediction, coin.backtest_mape
    )
    try:
        write_to_db([coin.return_dict], DB_NAME)
        print("Success")
    except:
        print("Error writing to mongo")
    return coin
