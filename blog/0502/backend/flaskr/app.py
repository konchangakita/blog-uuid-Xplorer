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
            info = "データ取得完了"
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
    print(data)
    return make_response(jsonify(data))

if __name__  == '__main__':
    app.run(host="0.0.0.0", port=7777, debug=True)
















