import ccxt
import time
import pandas as pd

exchange = ccxt.kraken()


def get_usd_markets(exchange):
    exchange.load_markets()
    usd_pairs = set()
    for s in exchange.symbols:
        if s.split("/")[1] == "USD":
            usd_pairs.add(s)
    print(len(usd_pairs), "USD pairs available.")
    return usd_pairs


def get_ohlcv_series(exchange, symbol, candle_len="1h"):
    if exchange.has["fetchOHLCV"]:
        time.sleep(exchange.rateLimit / 1000)  # time.sleep wants seconds
        bars = exchange.fetch_ohlcv(symbol, candle_len)
        df = pd.DataFrame(
            bars, columns=["UTC timestamp", "open", "high", "low", "close", "volume"]
        )

        print(df.head())

        return df


# todo store data in dask, tinydb, or sqlite

if __name__ == "__main__":
    print(exchange.timeframes)
    symbol = "BTC/USD"
    usd_pairs = get_usd_markets(exchange)
    print(usd_pairs)
    df = get_ohlcv_series(exchange, symbol)
    print(df.describe())
    df.to_csv(f"{symbol.replace('/', '-')}.csv")
