import json
import great_expectations as ge
from great_expectations.core.batch import BatchRequest
from datetime import date
from config import GX_ROOT
from great_expectations.expectations.registry import register_expectation
from plugins.expect_end_date_after_start_date import ExpectEndDateAfterStartDate

#register explicitly
register_expectation(ExpectEndDateAfterStartDate)


config_path = '/workspaces/Test_Automation_Fincore_Backup/tests/dq/great_expectations/gx/config_rules.json'

with open(config_path) as f:
    config = json.load(f)

context = ge.get_context(context_root_dir=GX_ROOT)

for table in config['tables']:
    suite_name = table['suite_name']
    table_name = table['table_name']

    context.add_or_update_expectation_suite(expectation_suite_name=suite_name)

    batch_request = BatchRequest(
        datasource_name= config['datasource_name'],
        data_connector_name=config['data_connector_name'],
        data_asset_name= table_name
    )

    validator = context.get_validator(
        batch_request= batch_request,
        expectation_suite_name= suite_name
    )

    print("Available methods:")
    print([m for m in dir(validator) if "end_date" in m])

    for rule in table['expectations']:
        #adding custome expectations
        if rule['type'] == "CUSTOM_EXPECTATION":

            method_name = rule["name"]
            params = rule.get("params",{})

            try:
                custom_fn = getattr(validator, method_name)
                custom_fn(**params)
                print(f"executed custom expectation :{method_name}")
            except Exception as e:
                print(f"❌ custom expectation error: {method_name} → {str(e)}")
        
            continue

        if rule.get('max_value') == 'now':
            rule['max_value'] = str(date.today())
        
        #build params - everything except "type"

        params = {k:v for k,v in rule.items() if k != "type"}

        # call expectations dynamically
        expectation_fn = getattr(validator, rule["type"])
        expectation_fn(**params)
    
    validator.save_expectation_suite(discard_failed_expectations=False)
    print(f"Suite saved : {suite_name}")

    