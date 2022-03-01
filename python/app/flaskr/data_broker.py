from elasticsearch import Elasticsearch
from elasticsearch import helpers

import urllib3
import requests
import json
from base64 import b64encode
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)



class NutanixAPI():
    def get_vms(self, prism_ip, headers):
        request_url = 'https://' + prism_ip + ':9440/api/nutanix/v3/vms/list'

        payload = '{"kind":"vm", "length":256}'

        try:
            response = requests.request('post', request_url, data=payload, headers=headers, verify=False, timeout=3.5)
        except requests.exceptions.ConnectTimeout:
            response = "Timeout shimasita"

        return response

    def get_volume_groups(self, prism_ip, headers):
        request_url = 'https://' + prism_ip + ':9440/PrismGateway/services/rest/v2.0/volume_groups/'

        try:
            response = requests.request('get', request_url, headers=headers, verify=False, timeout=3.5)
        except requests.exceptions.ConnectTimeout:
            response = "Timeout shimasita"

        return response

    def get_xdata(self, prism_ip, prism_user, prism_pass, volume_group=True, vfilers=True, shares=True, share_details=True, storage_containers=True):
        res_list = {}
        encoded_credentials = b64encode(bytes(f'{prism_user}:{prism_pass}', encoding='ascii')).decode('ascii')
        auth_header = f'Basic {encoded_credentials}'
        headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': f'{auth_header}', 'cache-control': 'no-cache'}

        # Volume Group がなかった場合の分岐はあとで、vFilerも一旦このif文にいれると良いのでは
        res_list['vms'] = self.get_vms(prism_ip, headers)
        if volume_group:
            res_list['volume_groups'] = self.get_volume_groups(prism_ip, headers)

        return res_list

class ElasticAPI():
    def __init__(self, es_server):
        self.es = Elasticsearch(es_server)
