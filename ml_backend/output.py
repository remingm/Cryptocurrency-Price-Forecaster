import pymongo
import pprint
import json
import pandas as pd
import os


def reverse_transform(coin):
    # JSON out
    # past_close = coin.scaler.inverse_transform(coin.scaled)["close"].pd_dataframe()
    past_close = coin.df["close"]
    prediction = coin.scaler.inverse_transform(coin.prediction).pd_dataframe()
    if hasattr(coin, "val_prediction"):
        coin.val_prediction = coin.scaler.inverse_transform(
            coin.val_prediction
        ).pd_dataframe()

    return past_close, prediction


def format_timestamp_index(past_close, df, prediction):
    # Set index to Unix timestamps
    # past_close.set_index(df["UTC timestamp"][: len(past_close)], inplace=True)
    past_close = pd.Series(past_close.values, index=df["UTC timestamp"])

    # Write future timestamps to predictions
    timestamp_len_ms = past_close.index[1] - past_close.index[0]
    future_timestamps = []
    for i in range(1, len(prediction) + 1):
        timestamp = past_close.index[-1] + timestamp_len_ms * i
        future_timestamps.append(timestamp)
    prediction.set_index(pd.Series(future_timestamps), inplace=True)
    return past_close, prediction


def format_json(
    symbol,
    period,
    past_close,
    prediction,
    backtest_mape,
    target_var,
    coin,
    validate=False,
):
    return_dict = {
        "symbol": symbol,
        "past": json.loads(past_close.to_json()),
        "prediction": json.loads(prediction.to_json()),
        "period": period,
        "MAPE": backtest_mape,
    }

    if validate:
        return_dict["val_prediction"] = json.loads(coin.val_prediction.to_json())

    # [{
    #     "time": 12345,
    #     "price": 0.17
    # }, ...]

    reformatted_past = []
    reformatted_pred = []
    past_dict = json.loads(past_close.to_json())
    # Changed from coin.target_var to '0' after kalman smoothing prediction.
    pred_dict = json.loads(prediction.to_json())["0"]
    for key in past_dict.keys():
        reformatted_past.append({"timestamp": int(key), "close": past_dict[key]})
    for key in pred_dict.keys():
        reformatted_pred.append({"timestamp": int(key), "close": pred_dict[key]})

    return_dict["past"] = reformatted_past
    return_dict["prediction"] = reformatted_pred

    # Debugging
    # json.dump(return_dict, open(f"{symbol}.json", "w"), indent=4)
    # print(json.dumps(return_dict, indent=4))

    return return_dict


def write_to_db(forecasts, DB_NAME):
    # Write forecasts to mongo
    if "MONGODB_URI" not in os.environ.keys():
        os.environ["MONGODB_URI"] = "localhost"
    mongo_host = os.environ["MONGODB_URI"]

    if "DB_PASSWORD" in os.environ.keys() and "DB_USERNAME" in os.environ.keys():
        pw = os.environ["DB_PASSWORD"]
        username = os.environ["DB_USERNAME"]
        client = pymongo.MongoClient(mongo_host, username=username, password=pw)
    else:
        print("WARNING: DB_PASSWORD or DB_USERNAME env vars missing.")
        client = pymongo.MongoClient(mongo_host)

    db = client[DB_NAME]

    for f in forecasts:
        db.coins.delete_many({"symbol": f["symbol"], "period": f["period"]})
        db.coins.insert_one(f)
        print(f"Wrote {f['symbol']}-{f['period']} to database at {mongo_host}.")

    # Debugging
    if False:
        cursor = db.coins.find({})
        for c in cursor:
            print(c["symbol"], "is in db.coins")

        cursor = db.coins.find()

        # pprint.pprint(cursor)
        for c in cursor:
            pprint.pprint(c.keys())


# todo write past prediction from validation
def output_pipeline(DB_NAME, coin, validate=False):
    past_close, prediction = reverse_transform(coin)
    coin.past_close, coin.prediction = format_timestamp_index(
        past_close, coin.df, prediction
    )
    if hasattr(coin, "val_prediction"):
        _, coin.val_prediction = format_timestamp_index(
            coin.df["close"][: -len(coin.val_prediction)],
            coin.df[: -len(coin.val_prediction)],
            coin.val_prediction,
        )
    coin.return_dict = format_json(
        coin.symbol,
        coin.period,
        coin.past_close,
        coin.prediction,
        coin.backtest_mape,
        coin.target_var,
        coin,
        validate,
    )
    try:
        write_to_db([coin.return_dict], DB_NAME)
        print("Success")
    except Exception as e:
        print("Error writing to mongo")
        print(e)
    return coin
