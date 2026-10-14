import os
import sys

import pytest
import pandas as pd

# Use the active interpreter instead of PySpark's Unix-oriented python3 default.
os.environ.setdefault("PYSPARK_PYTHON", sys.executable)
os.environ.setdefault("PYSPARK_DRIVER_PYTHON", sys.executable)

from pyspark.sql import SparkSession

from pipeline.transformations import(
    standardise_name,
    standardise_date,
    compute_loan_duration,
    compute_emi,
    map_status_code,
    fill_default_currency,
    filter_zero_amounts
)

@pytest.fixture(scope="session")
def spark():
    spark = (
        SparkSession.builder
        .master("local[*]")
        .appName("UC4 Pipeline Tests")
        .getOrCreate()
    )

    yield spark

    spark.stop()

#laod test data from CSV files into pandas DataFrames
def load_csv(file_path):
    return pd.read_csv(file_path).to_dict("records")


#validate the standardise_name transformation
name_test_data = load_csv(
    "tests/test_data/standardise_name.csv"
)



@pytest.mark.parametrize("row", name_test_data)
def test_standardise_name(spark, row):
    df = spark.createDataFrame(
        [(row["input_name"],)],["name"])

    result = standardise_name(df, "name")
    print(result)

    assert (result.collect()[0]["name"] == row["expected_name"])


#validate the standardise_date transformation
date_test_data = load_csv(
    "tests/test_data/standardise_date.csv"
)

@pytest.mark.parametrize("row", date_test_data)
def test_standardise_date(spark,row):

    df = spark.createDataFrame([(row["input_date"],)],["transaction_date"])

    result = standardise_date(df,"transaction_date")

    actual = str(
        result.collect()[0]
        ["transaction_date"]
    )

    assert (actual==row["expected_date"])


#validate the compute_loan_duration transformation
duration_test_data = load_csv(
    "tests/test_data/compute_loan_duration.csv"
)


@pytest.mark.parametrize( "row",duration_test_data)
def test_compute_loan_duration(spark,row):

    df = spark.createDataFrame([(row["start_date"],row["end_date"])],["start_date","end_date"])

    result = compute_loan_duration(df)

    assert (result.collect()[0]["loan_duration_days"]==row["expected_duration"])


#validate the emi transformation
emi_test_data = load_csv("tests/test_data/compute_emi.csv")


@pytest.mark.parametrize("row",emi_test_data)
def test_compute_emi(spark,row):

    df = spark.createDataFrame([(
                row["principal_amount"],
                row["interest_rate"],
                row["loan_duration_days"]
            )
        ],
        [
            "principal_amount",
            "interest_rate",
            "loan_duration_days"
        ]
    )

    result = compute_emi(df)

    emi = (result.collect()[0]["emi_amount"])

    assert emi > 0


#validate the map_status_code transformation
status_test_data = load_csv("tests/test_data/map_status_code.csv")


@pytest.mark.parametrize("row",status_test_data)
def test_map_status_code(spark,row):

    mapping = {
        1: "active",
        2: "inactive",
        3: "blocked"
    }

    df = spark.createDataFrame([(row["status_code"],)],["status_code"])

    result = map_status_code(df,"status_code",mapping)

    assert (result.collect()[0]["status_code"]==row["expected_status"])


#valdate the default currency transformation
currency_test_data = load_csv("tests/test_data/default_currency.csv")


@pytest.mark.parametrize("row",currency_test_data)
def test_fill_default_currency(spark,row):

    value = (None
        if pd.isna(
            row["currency_input"]
        )
        else row["currency_input"]
    )

    df = spark.createDataFrame([(value,)],["currency"])

    result = fill_default_currency(df)

    assert (result.collect()[0]["currency"]==row["expected_currency"])


#validate the filter_zero_amounts transformation
def test_filter_zero_amounts(spark):

    data = pd.read_csv("tests/test_data/zero_amounts.csv")

    rows = [(x,)for x in data["amount"]]

    df = spark.createDataFrame(rows,["amount"])

    result = filter_zero_amounts(df)

    assert result.count() == 3    