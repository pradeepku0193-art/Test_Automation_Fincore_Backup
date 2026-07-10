import requests

class APIClient:

    def __init__(self,base_url, token=None):
        self.base_url = base_url
        self.token = token
    
    def get(self, endpoint, token=None):

        headers = {}

        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        return requests.get(
            f"{self.base_url}{endpoint}", headers=headers
        )
    

    def post(self, endpoint, payload=None, token=None):

        headers = {}

        if token:
            headers["Authorization"] = f"Bearer {token}"

        return requests.post(
            f"{self.base_url}{endpoint}",
            json=payload,
            headers=headers
        )