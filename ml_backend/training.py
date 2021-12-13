from darts.metrics import mape, smape, mase
from darts.models import TCNModel


def split_data(scaled_timeseries):
    split = int(len(scaled_timeseries) * 0.1)  # todo split param.
    train, val = scaled_timeseries[:-split], scaled_timeseries[-split:]
    return train, val


def train_model(target_series, covariates, val=None, val_covar=None):
    pred_len = min(len(target_series) // 10, 72)
    model = TCNModel(
        input_chunk_length=pred_len * 2,
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


def eval_model(model, train, val, train_covar, scaled, target_var, plot=False):
    pred_len = min(len(train) // 10, 72)
    prediction = model.predict(n=pred_len, series=train, past_covariates=train_covar)

    # prediction = align_prediction(
    #     scaled, prediction, target_var="close", idx=len(train)
    # )

    if plot:
        scaled["close"].plot(new_plot=True, label="Actual")
        prediction[target_var].plot(label="Forecast")


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


def predict(model, target_series, covariates, scaled, target_var, plot=False):
    # Predict future
    pred_len = min(len(target_series) // 10, 72)
    # prediction = model.predict(
    #     n=pred_len,
    #     series=scaled,
    # )
    prediction = model.predict(
        series=target_series, past_covariates=[covariates], n=pred_len, verbose=True
    )

    # prediction = align_prediction(scaled, prediction, target_var="close")

    if plot:
        scaled["close"].plot(new_plot=True, label="Past")
        prediction[target_var].plot(label="Forecast")

    return prediction


def align_prediction(scaled, prediction, target_var="close", idx=-1):
    # align without removing other pred columns
    value_at_first_step = float(scaled[target_var][idx].values())
    prediction = prediction.rescale_with_value(value_at_first_step)
    return prediction


def train_pipeline(scaled, target_var="close", validate_model=False):

    # covariates
    covar_cols = list(scaled.columns.values)
    covar_cols.remove(target_var)
    covariates = scaled[covar_cols]
    target_series = scaled[[target_var]]

    if validate_model:
        # split covariates
        train_target, val_target = split_data(scaled_timeseries=target_series)
        train_covar, val_covar = split_data(scaled_timeseries=covariates)
        # train, val = split_data(scaled_timeseries=scaled)

        # Holdout val set and score
        # try:
        model = train_model(train_target, train_covar, val_target, val_covar)
        # backtest_mape = backtest_model(model, train, scaled, target_var, target_var_idx)
        eval_model(
            model, train_target, val_target, train_covar, scaled, target_var, plot=True
        )
        # except:
        #     pass
        backtest_mape = -1

    else:
        backtest_mape = -1

    # Retrain on all data and predict
    model = train_model(target_series, covariates)
    prediction = predict(
        model, target_series, covariates, scaled, target_var, plot=True
    )

    return prediction, backtest_mape
