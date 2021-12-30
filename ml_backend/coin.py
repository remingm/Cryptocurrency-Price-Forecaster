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
        self.timeseries = None

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

    def split_covariates(self):
        # covariates
        covar_cols = list(self.timeseries.columns.values)
        covar_cols.remove(self.target_var)
        self.covariates = self.timeseries[covar_cols]
        self.target_series = self.timeseries[[self.target_var]]

    def __str__(self):
        return self.symbol + "-" + self.period

    def __eq__(self, other):
        if isinstance(other, Coin):
            return self.symbol == other.symbol and self.period == other.period

    def __hash__(self):
        return hash(self.__str__())
