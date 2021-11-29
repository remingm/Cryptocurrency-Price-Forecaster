import time
import datetime
from get_data import get_usd_markets, get_ohlcv_series, exchange, plot_df
from generate_factors import generate_factors
from training import train_pipeline
from output import output_pipeline
from coin import Coin

# todo config.yml
COINS = [
    "BTC/USD",
    "ETH/USD",
    "ADA/USD",
    "DOGE/USD",
    "LTC/USD",
    "DOT/USD",
    "MANA/USD",
    "SOL/USD",
    "DOGE/USD",
    "ALGO/USD",
    "XMR/USD",
    "XRP/USD",
    "BCH/USD",
]

TIMEPERIODS = ["1d"]
SLEEP_TIME = 60 * 15


def ml_pipeline(coin):
    print("Getting data for", coin)
    df = get_ohlcv_series(exchange, coin.original_symbol, coin.period)

    coin.df = df

    # print(coin.symbol, coin.period)

    # volume filter. scaler is failing on coins with low vol 1m
    print("Generating factors for", coin)
    coin.scaled, coin.scaler = generate_factors(
        coin.df, coin.target_var, ignore_low_volume_coins=True
    )
    if coin.scaled == False:
        print("fail", coin.symbol, coin.period)
    else:
        # todo logging
        print("Success", coin.symbol, coin.period)
        print("Training model for", coin)
        prediction, backtest_mape = train_pipeline(
            coin.scaled, target_var=coin.target_var, validate_model=False
        )
        coin.backtest_mape = backtest_mape
        coin.prediction = prediction
        coin.last_compute = datetime.datetime.utcnow()
        print("Running output pipeline for", coin)
        coin = output_pipeline(coin)
    return coin


def make_coins_set(COINS, TIMEPERIODS, target_var="close"):
    coins = set()
    usd_pairs = get_usd_markets(exchange).intersection(COINS)
    periods = exchange.timeframes.keys()
    for period in set(periods).intersection(TIMEPERIODS):
        for symbol in usd_pairs:
            coin = Coin(symbol, period, target_var=target_var)
            coins.add(coin)
    return coins


def main_ml_loop(coins, sleep_time):
    processed = set()
    while len(coins) > 0:
        coin = coins.pop()
        if coin.check_compute_time():
            print(f"Timedelta expired, computing {coin}")
            coin = ml_pipeline(coin)
        else:
            print(f"Timedelta has not yet expired for {coin}")

        processed.add(coin)

        # Sleep if all coins have been predicted
        if len(coins) == 0:
            print("Sleeping")
            time.sleep(SLEEP_TIME)

    return processed


if __name__ == "__main__":
    coins = make_coins_set(COINS, TIMEPERIODS, target_var="close")
    while True:
        coins = main_ml_loop(coins, SLEEP_TIME)
