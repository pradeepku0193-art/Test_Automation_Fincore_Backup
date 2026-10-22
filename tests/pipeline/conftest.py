import os
import sys

import pytest

# Use the active interpreter instead of PySpark's Unix-oriented python3 default.
os.environ.setdefault("PYSPARK_PYTHON", sys.executable)
os.environ.setdefault("PYSPARK_DRIVER_PYTHON", sys.executable)

from pyspark.sql import SparkSession


@pytest.fixture(scope="session")
def spark():
    spark = (
        SparkSession.builder
        .master("local[2]")
        .appName("UC4 Pipeline Tests")
        .getOrCreate()
    )

    yield spark

    spark.stop()