from great_expectations.expectations.expectation import QueryExpectation

class ExpectEndDateAfterStartDate(QueryExpectation):
    "startdate should be less than enddate"

    query = """
            select
                  count(case when end_date <= start_date then 1 end) as unexpected_count,
                  count(*) as total_count
            from {active_batch}
            where end_date is not null and start_date is not null"""
    
    metric_dependencies = ("query.template_values",)
    success_keys = ("query", "template_dict")

    default_kwarg_values = {
        "query" : query,
        "template_dict": {},
        "result_format" : "BASIC",
        "catch_exceptions" : True

    }

    def _validate(self, configuration, metrics, runtime_configuration=None, execution_engine=None):
        query_result = list(metrics.get("query.template_values"))
        unexpected_count = query_result[0].get("unexpected_count", 0)
        total_count = query_result[0].get("total_count", 1) or 1
        sucess = unexpected_count == 0
        unexpected_percent = ((unexpected_count/total_count *100 ) if total_count > 0 else 0)

        return{
            "sucess" : sucess,
            "result" :{
                "unexpected_count" : unexpected_count,
                "unexpected_percent" : round(unexpected_percent, 4),
                "element_count" : total_count

            }
        }
    
    @classmethod
    def _prescriptive_renderer(cls, configuration = None, result = None, **kwargs):
        return []
    
    @classmethod
    def _diagnostic_unexpected_statement_renderer(cls,  result = None, **kwargs):
        return []