import great_expectations as ge
import sys
from config import GX_ROOT
from plugins.expect_end_date_after_start_date import ExpectEndDateAfterStartDate

context = ge.get_context(context_root_dir=GX_ROOT)

def run_validation():
    result = context.run_checkpoint(checkpoint_name="fincore_checkpoint")

    if not result.success:
        context.build_data_docs(site_names=["dq_bad_site"])
        print("validation Failed - report saved in to dq_bad")
        sys.exit(1)
    else:
        context.build_data_docs(site_names=["dq_good_site"])
        print("validation Passed - report saved in to dq_good")
        sys.exit(0)

run_validation()
