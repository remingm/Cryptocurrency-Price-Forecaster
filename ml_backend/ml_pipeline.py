from get_data import get_usd_markets, get_ohlcv_series, exchange, plot_df
from generate_factors import generate_factors
from training import train_pipeline
from output import output_pipeline
import datetime


class Coin:
    def __init__(self, symbol, period, target_var):
        self.symbol = symbol.replace("/", "-")
        self.original_symbol = symbol
        self.period = period
        self.target_var = target_var
        self.scaler = None
        self.scaled = None
        self.prediction = None
        self.df = None
        self.backtest_mape = None
        self.last_compute = None

    def check_compute_time(self):
        convserion_dict = {
            "1m": 1,
            "5m": 5,
            "15m": 15,
            "30m": 30,
            "1h": 60,
            "4h": 4 * 60,
            "1d": 60 * 24,
            "1w": 7 * 24 * 60,
            "2w": 14 * 24 * 60,
        }
        if self.last_compute == None:
            return True
        delta = datetime.timedelta(minutes=convserion_dict[self.period])
        return datetime.datetime.utcnow() - self.last_compute >= delta

    def __str__(self):
        return self.symbol + "-" + self.period

    def __eq__(self, other):
        if isinstance(other, Coin):
            return self.symbol == other.symbol and self.period == other.period

    def __hash__(self):
        return hash(self.__str__())


def ml_pipeline(coin):
    df = get_ohlcv_series(exchange, coin.original_symbol, coin.period)

    coin.df = df

    # print(coin.symbol, coin.period)

    # volume filter. scaler is failing on coins with low vol 1m
    coin.scaled, coin.scaler = generate_factors(coin.df, ignore_low_volume_coins=True)
    if coin.scaled == False:
        print("fail", coin.symbol, coin.period)
        # plot_df(df, symbol + "-fail", period)
    else:
        # todo logging
        print("Success", coin.symbol, coin.period)
        # plot_df(df, symbol + "-success", period)
        prediction, backtest_mape = train_pipeline(
            coin.scaled, target_var=coin.target_var, validate_model=False
        )
        coin.backtest_mape = backtest_mape
        coin.prediction = prediction
        coin.last_compute = datetime.datetime.utcnow()
        coin = output_pipeline(coin)
    return coin


def make_coins_set():
    coins = set()
    usd_pairs = get_usd_markets(exchange).intersection(
        [
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
    )
    periods = exchange.timeframes.keys()
    for period in set(periods).intersection(["1h", "4h", "1d"]):
        for symbol in usd_pairs:
            coin = Coin(symbol, period, target_var="close")
            coins.add(coin)
    return coins


def main_ml_loop(coins):
    processed = set()
    while len(coins) > 0:
        coin = coins.pop()
        if coin.check_compute_time():
            print(f"Timedelta expired, computing {coin}")
            coin = ml_pipeline(coin)
        else:
            print(f"Timedelta has not yet expired for {coin}")

        processed.add(coin)

    return processed


if __name__ == "__main__":
    coins = make_coins_set()
    while True:
        coins = main_ml_loop(coins)
