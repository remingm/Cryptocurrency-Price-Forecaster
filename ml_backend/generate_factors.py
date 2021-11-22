import numpy as np
from ta import add_all_ta_features
from darts import TimeSeries
from darts.dataprocessing.transformers import Scaler, BoxCox
from darts.dataprocessing.transformers.missing_values_filler import MissingValuesFiller


def get_ta(df):
    # Add all ta features
    df_ta = add_all_ta_features(
        df, open="open", high="high", low="low", close="close", volume="volume"
    )
    df_ta = df_ta.drop("UTC timestamp", "columns")

    ts_ta = TimeSeries.from_dataframe(
        df_ta, fill_missing_dates=True
    )  # time_col="UTC timestamp")
    print(df_ta.columns)

    return ts_ta, df


def get_return_lags(df):
    # Create the lagged percentage returns columns
    lag_names = []
    for i in [1, 2, 3, 5, 8, 13, 21, 42]:
        col_name = f"lag_return_{i}"
        lag_names.append(col_name)
        df[col_name] = df["close"].pct_change(periods=i)
        # df[col_name] = df["close"].shift(periods=i)

    covars = TimeSeries.from_dataframe(
        df, value_cols=lag_names, fill_missing_dates=True
    )  # ,time_col="UTC timestamp")
    return covars, df


def generate_factors(df, ignore_low_volume_coins=True):
    covars, df = get_return_lags(df)
    covars, df = get_ta(df)

    mvf = MissingValuesFiller()
    covars = mvf.transform(covars)

    if not ignore_low_volume_coins:
        # Convert to DF to remove inf and NaN. Will only happen for coins with periods of 0 volume.
        df = covars.pd_dataframe().replace([np.inf, -np.inf], np.nan)
        df = df.interpolate(imit_direction="both")
        covars = TimeSeries.from_dataframe(df)
    elif np.isinf(df).values.sum() > 0:
        # If coin has a candle with no volume, don't spend compute on it.
        return False, False

    # Scale target
    scaler = Scaler()
    # np.float64 error here. Prob low volume coins. ValueError: Input contains infinity or a value too large for dtype('float64').
    scaled = scaler.fit_transform(covars)
    scaled.describe()
    return scaled, scaler