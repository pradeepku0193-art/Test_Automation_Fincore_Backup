import psycopg2

class DBClient:

    def __init__(self, config):
        self.config = config
        

    def get_connection(self):

        return psycopg2.connect(**self.config)
    
    def execute_query(self, query, params=None):

        conn = self.get_connection()

        try:

            cur = conn.cursor()

            cur.execute(query, params)

            if cur.description:
                columns = [i[0] for i in cur.description]

                records = [
                    dict(zip(columns, row))
                    for row in cur.fetchall()
                ]

                return records
            
            return []
        finally:

            cur.close()
            conn.close()