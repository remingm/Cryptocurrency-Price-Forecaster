from get_data import get_usd_markets, get_ohlcv_series, exchange
from generate_factors import generate_factors

if __name__ == '__main__':
    # todo schedule each timeframe pred for timeframe len. Spawn thread? sleep?
    usd_pairs = get_usd_markets(exchange)
    timeframes = exchange.timeframes.keys()
    ss = []
    f = []
    for timeframe in timeframes:
        if "w" not in timeframe:
            for symbol in usd_pairs:
                df = get_ohlcv_series(exchange, symbol, timeframe)
                symbol = symbol.replace('/', '-')
                print(symbol, timeframe)

                # todo volume filter. scaler is failing on coins with low vol 1m
                try:
                    scaled, scaler = generate_factors(df)
                    ss.append(symbol+timeframe)
                    print("Success",symbol+timeframe)
                except:
                    f.append(symbol+timeframe)
                    print("Fail",symbol+timeframe)


    print("Success",len(ss),ss)
    print("fail",len(f),f)
