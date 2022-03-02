from elasticsearch import Elasticsearch
from elasticsearch import helpers

import urllib3
import requests
import json
from base64 import b64encode
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from datetime import datetime



class NutanixAPI():
    def get_vms(self, prism_ip, headers):
        request_url = 'https://' + prism_ip + ':9440/api/nutanix/v3/vms/list'

        payload = '{"kind":"vm", "length":256}'

        try:
            response = requests.request('post', request_url, data=payload, headers=headers, verify=False, timeout=4)
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

    # check index and create alias
    def check_indices(self, index_name):
        es = self.es
        indices = es.cat.indices(index='*', h='index').splitlines()
        if index_name not in indices:
            es.indices.create(index=index_name)

            alias = 'search_uuid'
            es.indices.update_aliases(body={
                'actions' : [{ 'add':
                    { 'index': index_name, 'alias': alias }
            }]
        })

    # put the data from Prism(Element) API to Elasticsearch
    def put_rest_pe(self, r_json, timestamp, cluster_name, cluster_uuid, index_name):
        es = self.es
        index_name = index_name
        self.check_indices(index_name)

        actions = []
        if index_name != 'share_details':
            for entity in r_json['entities']:
                entity['timestamp'] = timestamp
                entity['cluster_name'] = cluster_name
                entity['cluster_uuid'] = cluster_uuid
                actions.append({'_index':index_name, '_source':entity})
        else:
            for entity in r_json:
                entity['timestamp'] = timestamp
                entity['cluster_name'] = cluster_name
                entity['cluster_uuid'] = cluster_uuid
                actions.append({'_index':index_name, '_source':entity})

        reaction = helpers.bulk(es, actions)
        return reaction[0]

    def input_data(self, res_list):
        timestamp = datetime.utcnow()
        input_size = {}

        # vms
        vms_json = res_list['vms'].json()
        cluster_name = vms_json['entities'][0]['spec']['cluster_reference']['name']
        cluster_uuid = vms_json['entities'][0]['spec']['cluster_reference']['uuid']
        input_size['vms'] = self.put_rest_pe(vms_json, timestamp, cluster_name, cluster_uuid, index_name='vms')

        # volume_group
        volume_groups_json = res_list['volume_groups'].json()
        input_size['volume_groups'] = self.put_rest_pe(volume_groups_json, timestamp, cluster_name, cluster_uuid, index_name='volume_groups')

        return cluster_name, input_size
