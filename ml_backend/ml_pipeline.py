from get_data import get_usd_markets, get_ohlcv_series, exchange, plot_df
from generate_factors import generate_factors

if __name__ == "__main__":
    # todo schedule each timeframe pred for timeframe len. Spawn thread? sleep?
    usd_pairs = get_usd_markets(exchange)
    timeframes = exchange.timeframes.keys()
    for timeframe in timeframes:
        if "w" not in timeframe:
            for symbol in usd_pairs:
                df = get_ohlcv_series(exchange, symbol, timeframe)
                symbol = symbol.replace("/", "-")

                print(symbol, timeframe)

                # volume filter. scaler is failing on coins with low vol 1m
                scaled, scaler = generate_factors(df, ignore_low_volume_coins=True)
                if scaled == False:
                    print("fail", symbol, timeframe)
                    # plot_df(df, symbol + "-fail", timeframe)
                    continue
                else:
                    print("Success", symbol, timeframe)
                    # plot_df(df, symbol + "-success", timeframe)
