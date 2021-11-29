from darts.metrics import mape, smape, mase
from darts.models import TCNModel


def split_data(scaled_timeseries):
    split = int(len(scaled_timeseries) * 0.1)  # todo split param.
    train, val = scaled_timeseries[:-split], scaled_timeseries[-split:]
    return train, val


def train_model(train, val=None):
    model = TCNModel(
        input_chunk_length=48,
        output_chunk_length=24,
        n_epochs=30,
        random_state=0,
        optimizer_kwargs={"lr": 0.001},
    )

    if val == None:
        model.fit(series=train, verbose=True)
    else:
        model.fit(series=train, val_series=val, verbose=True)
    return model


def eval_model(model, train, val, scaled, target_var, plot=False):
    prediction = model.predict(
        n=len(val),
        series=train,
    )
    # scaled[target_var].plot(new_plot=True,label="actual")
    # prediction[target_var].plot(label="forecast", low_quantile=0.05, high_quantile=0.95)
    # print("MAPE = {:.2f}%".format(mape(scaled[target_var], prediction[target_var])))
    # print("sMAPE = {:.2f}%".format(smape(scaled[target_var], prediction[target_var])))
    # print(
    #     "MASE = {:.2f}%".format(
    #         mase(scaled[target_var], pred[target_var], insample=train[target_var])
    #     )
    # )

    prediction = align_prediction(
        scaled, prediction, target_var="close", idx=len(train)
    )

    if plot:
        scaled["close"].plot(new_plot=True, label="Actual")
        prediction["trend_sma_slow"].plot(label="Forecast")


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


def predict(model, scaled, target_var, plot=False):
    # Predict future
    pred_len = min(len(scaled) // 10, 72)
    prediction = model.predict(
        n=pred_len,
        # series=scaled,
    )

    prediction = align_prediction(scaled, prediction, target_var="close")

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
    target_var_idx = scaled.columns.get_loc(target_var)
    train, val = split_data(scaled_timeseries=scaled)

    if validate_model:
        # Holdout val set and score
        try:
            model = train_model(train, val)
            # backtest_mape = backtest_model(model, train, scaled, target_var, target_var_idx)
            eval_model(model, train, val, scaled, target_var, plot=True)
        except:
            pass
        backtest_mape = -1

    else:
        backtest_mape = -1

    # Retrain on all data and predict
    model = train_model(scaled)
    prediction = predict(model, scaled, target_var, plot=False)

    return prediction, backtest_mape
