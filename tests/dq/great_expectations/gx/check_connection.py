import great_expectations as ge
from config import GX_ROOT

context = ge.get_context(context_root_dir=GX_ROOT)

datasource = context.get_datasource('fincore_pg')

print(datasource.get_available_data_asset_names())
