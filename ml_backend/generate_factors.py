import numpy as np
from ta import add_all_ta_features
from darts import TimeSeries
from darts.dataprocessing.transformers import Scaler, BoxCox
from darts.dataprocessing.transformers.missing_values_filler import MissingValuesFiller


def get_ta(df):
    # Add all ta features
    df_ta = add_all_ta_features(df, open="open", high="high", low="low", close="close", volume="volume")
    df_ta = df_ta.drop('UTC timestamp', 'columns')

    # Scale feats
    ts_ta = TimeSeries.from_dataframe(df_ta, fill_missing_dates=True)  # time_col="UTC timestamp")
    print(df_ta.columns)

    return ts_ta


def get_return_lags(df):
    # Create the lagged percentage returns columns
    lag_names = []
    for i in [1, 2, 3, 5, 8, 13, 21, 42]:
        col_name = f"lag_return_{i}"
        lag_names.append(col_name)
        df[col_name] = df["close"].pct_change(periods=i)
        # df[col_name] = df["close"].shift(periods=i)

    covars = TimeSeries.from_dataframe(df, value_cols=lag_names, fill_missing_dates=True)  # ,time_col="UTC timestamp")
    return covars


def generate_factors(df):
    scaled_covars = get_return_lags(df)
    scaled_covars = get_ta(df)

    # Scale target
    mvf = MissingValuesFiller()
    scaled_covars = mvf.transform(scaled_covars)
    scaler = Scaler()
    scaled = scaler.fit_transform(scaled_covars) # todo np.float64 error here. Prob low volume coins
    scaled.describe()
    return scaled, scaler

# target_var = 'close'
# target_var_idx = scaled.columns.get_loc(target_var)
#
# split = int(len(scaled) * .1)  # todo split param.
# train, val = scaled[:-split], scaled[-split:]
# train_covar, val_covar = scaled_covars[:-split], scaled_covars[-split:]
# train[target_var].plot(label='training')
# val[target_var].plot(label='validation')
