from darts.metrics import mape, ope
from darts.models import TCNModel


def split_data(scaled_timeseries, forecast_len):
    split = int(len(scaled_timeseries) * forecast_len)
    train, val = scaled_timeseries[:-split], scaled_timeseries[-split:]
    return train, val


def train_model(target_series, covariates, val=None, val_covar=None, forecast_len=0.1):
    if val != None:
        pred_len = len(val)
    else:
        pred_len = min(len(target_series) // forecast_len, 72)

    model = TCNModel(
        input_chunk_length=pred_len + 1,
        output_chunk_length=pred_len,
        n_epochs=30,
        random_state=0,
        optimizer_kwargs={"lr": 0.001},
    )

    if val == None:
        model.fit(series=target_series, past_covariates=[covariates], verbose=True)
    else:
        # model.fit(series=target_series, val_series=val, verbose=True)
        model.fit(series=target_series, past_covariates=[covariates], verbose=True)
        # model.fit(series=target_series, val_series=val, past_covariates=covariates,val_past_covariates=val_covar,verbose=True)
    return model


def eval_model(
    model,
    train_target,
    val_target,
    train_covar,
    val_covar,
    scaled,
    target_var,
    coin,
    plot=False,
):

    """
    Models relying on past covariates require the last input_chunk_length of the past_covariates
    points to be known at prediction time. For horizon values n > output_chunk_length, these models
    require at least the next n - output_chunk_length future values to be known as well.
    https://unit8co.github.io/darts/generated_api/darts.models.forecasting.tcn_model.html#darts.models.forecasting.tcn_model.TCNModel.predict

    """
    # pred_len = len(val_covar)
    pred_len = model.output_chunk_length
    prediction = model.predict(
        n=pred_len, series=train_target, past_covariates=train_covar
    )

    prediction = align_prediction(
        coin.scaled_covars, prediction, align_with="close", idx=len(train_target)
    )
    coin.prediction = prediction

    coin.mape = mape(actual_series=val_target, pred_series=prediction)
    coin.ope = ope(val_target, prediction)

    if plot:
        coin.scaled_covars["close"].plot(new_plot=True, label="Past")
        prediction[coin.target_var].plot(label="Forecast")
    return coin.mape


def backtest_model(model, train, scaled, target_var, target_var_idx):
    # historical_forecasts
    backtest_cov = model.historical_forecasts(
        scaled,
        start=len(train),
        forecast_horizon=12,
        stride=1,
        retrain=False,
        verbose=True,
    )

    # scaled[target_var].plot(label='actual')
    backtest_cov.univariate_component(target_var_idx).plot(label="forecast")
    backtest_mape = mape(
        scaled[target_var], backtest_cov.univariate_component(target_var_idx)
    )
    print("Backtest MAPE  = {:.2f}%".format(backtest_mape))
    return backtest_mape


def predict(model, coin, plot=False):
    # Predict future
    pred_len = min(len(coin.scaled_target) // 10, 72)
    # prediction = model.predict(
    #     n=pred_len,
    #     series=scaled,
    # )
    prediction = model.predict(
        series=coin.scaled_target,
        past_covariates=[coin.scaled_covars],
        n=pred_len,
        verbose=True,
    )

    prediction = align_prediction(coin.scaled_covars, prediction, align_with="close")
    coin.prediction = prediction

    plot = True
    if plot:
        coin.scaled_covars["close"].plot(new_plot=True, label="Past")
        prediction[coin.target_var].plot(label="Forecast")

    return prediction


def align_prediction(scaled, prediction, align_with="close", idx=-1):
    # align without removing other pred columns
    value_at_first_step = float(scaled[align_with][idx].values())
    prediction = prediction.rescale_with_value(value_at_first_step)
    return prediction


def train_pipeline(coin, validate_model=False, plot=False, forecast_len=0.1):

    if validate_model:
        # split covariates
        train_target, val_target = split_data(
            scaled_timeseries=coin.scaled_target, forecast_len=forecast_len
        )
        train_covar, val_covar = split_data(
            scaled_timeseries=coin.scaled_covars, forecast_len=forecast_len
        )

        # Holdout val set and score
        model = train_model(
            train_target, train_covar, val_target, val_covar, forecast_len=forecast_len
        )
        mape = eval_model(
            model,
            train_target,
            val_target,
            train_covar,
            val_covar,
            coin.scaled_target,
            coin.target_var,
            coin,
            plot=False,
        )

    else:
        mape = -1

    # Retrain on all data and predict
    model = train_model(
        coin.scaled_target, coin.scaled_covars, forecast_len=forecast_len
    )
    prediction = predict(model, coin, plot=plot)

    return prediction, mape
