import streamlit as st
import pymongo
import pandas as pd
import os


@st.cache(ttl=60 * 60)
def read_db(DB_NAME="db_name"):
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

    cursor = db.coins.find({})
    for c in cursor:
        print(c["symbol"], "is in db.coins")

    cursor = db.coins.find()
    return pd.DataFrame(list(cursor))

    return cursor


if __name__ == "__main__":
    with st.spinner("Querying DB..."):
        df = read_db()
    df = df.drop(columns="_id")
    symbol = st.selectbox("Coin", df["symbol"].values, index=1)
    period = st.selectbox("Period", set(df["period"].values))
    coin_df = df.query(f'symbol=="{symbol}" and period=="{period}"')
    past = pd.DataFrame.from_dict(coin_df.past.values[0]).set_index("timestamp")
    past = past.set_index(pd.to_datetime(past.index))
    st.write(coin_df)
    st.line_chart(past)
    pred = pd.DataFrame.from_dict(coin_df.prediction.values[0]).set_index("timestamp")
    pred = pred.set_index(pd.to_datetime(pred.index))
    st.line_chart(pred)
