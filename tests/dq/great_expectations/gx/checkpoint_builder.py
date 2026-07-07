from config import GX_ROOT
import great_expectations as ge
import json
from plugins.expect_end_date_after_start_date import ExpectEndDateAfterStartDate

config_path = "/workspaces/Test_Automation_Fincore_Backup/tests/dq/great_expectations/gx/config_rules.json"

with open(config_path) as f:
    config = json.load(f)

context = ge.get_context(context_root_dir=GX_ROOT)
validations = []

for table in config['tables']:
    validations.append({
        "batch_request" : {
            "datasource_name" : config["datasource_name"],
            "data_connector_name" : config["data_connector_name"],
            "data_asset_name" : table["table_name"]
        },
        "expectation_suite_name" : table["suite_name"]
    })

context.add_or_update_checkpoint(
    name = "fincore_checkpoint",
    validations= validations
)
