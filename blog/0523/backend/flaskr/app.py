from flask import Flask
from flask import render_template, request
from flask import make_response, jsonify
import time
import json

import data_broker

app = Flask(__name__)

# set data_broker class
ntnx = data_broker.NutanixAPI()
ELASTIC_SERVER = 'http://elasticsearch:9200'
es = data_broker.ElasticAPI(es_server=ELASTIC_SERVER)

title =  'Welcome to UUID X-plorer'

# Common from Elastic and local Sample data
def format_rdata(data, main_flag=False):
    r_data = {}

    if ('vms' in data):
        vmlist = []
        for vm in data['vms']:
            _data = {}
            _data['name'] = vm['spec']['name']
            _data['uuid'] = vm['metadata']['uuid']
            _data['cluster_uuid'] = vm['cluster_uuid']


            if ( main_flag == 'vmlist' ):
                #print(vm['spec']['resources']['nic_list'])
                if ( 'nic_list' in vm['spec']['resources'] ):
                    _data['niclist_uuid'] = [niclist['uuid'] for niclist in vm['spec']['resources']['nic_list']]
                if ( 'disk_list' in vm['spec']['resources'] ):
                    _data['disklist_uuid'] = [niclist['uuid'] for niclist in vm['spec']['resources']['disk_list']]

            vmlist.append(_data)
        r_data['vmlist'] = vmlist

    if ('volume_groups' in data):
        vglist = []
        for vg in data['volume_groups']:
            _data = {}
            _data['name'] = vg['name']
            _data['uuid'] = vg['uuid']
            _data['cluster_uuid'] = vg['cluster_uuid']

            if ( main_flag == 'vglist' ):
                _data['disklist']  = vg['disk_list']
                if ( 'attachment_list' in vg):
                    _data['attachment_list'] = vg['attachment_list']

            vglist.append(_data)
        r_data['vglist'] = vglist

    return r_data


def connect_cluster(request_form):
    cluster_name = ''
    # Formから受け取り
    prism_ip = request_form['prism_ip']
    prism_user = request_form['prism_user']
    prism_pass = request_form['prism_pass']

    # get from Nutanix cluster
    res_list = ntnx.get_xdata(prism_ip, prism_user, prism_pass)

    if hasattr(res_list['vms'], 'status_code'):
        if res_list['vms'].status_code == 200:
            # input to Elasticsearch
            cluster_name, input_size = es.input_data(res_list)
            time.sleep(1)
            info = "success"
        else:
            r_json = res_list['vms'].json()
            info = r_json['message_list'][0]['message']
    else: # timeout
        info = 'timeout (wrong IP?)'

    return info, cluster_name

def get_dataset(cluster_name):
    timeslot = es.get_timeslot(cluster_name)
    timestamp_utcstr = timeslot[0]['utc_time']
    hits = es.get_document_all(timestamp_utcstr, cluster_name)

    doc = {}
    for _hit in hits:
        index_name = _hit['_index']
        if not index_name in doc:
            doc[index_name] = []

        doc[index_name].append(_hit['_source'])

    return doc

@app.route('/')
def index():
    return render_template('index.html', \
        title = title)

@app.route('/api/connect', methods=['POST'])
def connect():
    data = {}
    print(request.json)
    data['info'], data['cluster_name'] = connect_cluster(request.json)
    print(data)

    return make_response(jsonify(data))

@app.route('/api/latestdataset', methods=['POST'])
def latestdataset():
    cluster_name = request.json['cluster_name']
    data = get_dataset(cluster_name)

    r_data = {}
    r_data['list'] = format_rdata(data)
    print(r_data)
    return make_response(jsonify(r_data))

@app.route('/api/get_dataset_sample', methods=['POST', 'GET'])
def get_dataset_sample():
    data = {}
    r_data = {}
    with open('sample/vms.json') as h:
        data['vms'] = json.load(h)
    with open('sample/volume_groups.json') as f:
        data['volume_groupss'] = json.load(f)

    r_data = format_rdata(data)
    r_data['cluster_name'] = 'Sample-Cluster'
    r_data['title'] = 'success'
    return make_response(jsonify(r_data))







if __name__  == '__main__':
    app.run(host="0.0.0.0", port=7777, debug=True)