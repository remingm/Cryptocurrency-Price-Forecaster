import numpy as np
from ta import add_all_ta_features
from darts import TimeSeries
from darts.dataprocessing.transformers import Scaler, BoxCox
from darts.dataprocessing.transformers.missing_values_filler import MissingValuesFiller
from darts.models import KalmanFilter


def get_ta(df, target_var=None):
    # Add all ta features
    df_ta = add_all_ta_features(
        df, open="open", high="high", low="low", close="close", volume="volume"
    )
    df_ta = df_ta.drop("UTC timestamp", "columns")
    if target_var:
        df_ta = df_ta[[target_var]]

    ts_ta = TimeSeries.from_dataframe(
        df_ta, fill_missing_dates=True
    )  # time_col="UTC timestamp")

    return ts_ta, df


def get_return_lags(df, target_var="close"):
    # Create the lagged percentage returns columns
    lag_names = [target_var]
    for i in [1, 2, 3, 5, 8, 13, 21, 42]:
        col_name = f"lag_return_{i}"
        lag_names.append(col_name)
        df[col_name] = df[target_var].pct_change(periods=i)
        # df[col_name] = df["close"].shift(periods=i)

    covars = TimeSeries.from_dataframe(
        df, value_cols=lag_names, fill_missing_dates=True
    )  # ,time_col="UTC timestamp")
    return covars, df


def generate_factors(df, target_var, ignore_low_volume_coins=True):
    ts, df = get_return_lags(df, target_var="close")
    ts, df = get_ta(df)

    ts, df = kalman_filter(ts, 'close', df)

    mvf = MissingValuesFiller()
    ts = mvf.transform(ts)

    if not ignore_low_volume_coins:
        # Convert to DF to remove inf and NaN. Will only happen for coins with periods of 0 volume.
        df = ts.pd_dataframe().replace([np.inf, -np.inf], np.nan)
        df = df.interpolate(imit_direction="both")
        ts = TimeSeries.from_dataframe(df)
    elif np.isinf(df).values.sum() > 0:
        # If coin has a candle with no volume, don't spend compute on it.
        return False, False

    return ts, df


def kalman_filter(data, target_var, df):
    # Kalman Smoothing
    filtered_timeseries = KalmanFilter(P=1000.0, R=50, Q=1).filter(data[target_var])
    df['kalman'] = filtered_timeseries.pd_series()

    # Optional plot
    # data[target_var].plot(label='actual')
    # filtered_timeseries.plot(label="Filtered")

    ts = TimeSeries.from_dataframe(
        df, fill_missing_dates=True
    )  # time_col="UTC timestamp")

    return ts, df


def scale_data(coin):
    # Scale target
    coin.scaler = Scaler()
    coin.scaled_target = coin.scaler.fit_transform(coin.target_series)

    # scale covars
    coin.scaler_covars = Scaler()
    coin.scaled_covars = coin.scaler_covars.fit_transform(coin.covariates)

    # coin.scaled = coin.scaler.transform(coin.timeseries)

    return coin

