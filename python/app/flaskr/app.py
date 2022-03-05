from flask import Flask
from flask import render_template, request
import time
import json


import data_broker

app = Flask(__name__)

# set data_broker class
ntnx = data_broker.NutanixAPI()
ELASTIC_SERVER = 'http://elasticsearch:9200'
es = data_broker.ElasticAPI(es_server=ELASTIC_SERVER)


#########################
# Cluster情報を入力
#########################
#prism_ip = '10.xxx.xx.xxx'
prism_ip = '10.149.20.41'
prism_user = 'admin'
prism_pass = 'Nutanix/4u123!'
#prism_pass = 'nutanix/4u'
cluster_name = 'POC20'

title =  'Welcome to UUID X-plorer'

def eswrite_smplejson(res_list):
    print(res_list)
    for _data in res_list:
        data = res_list[_data].json()
        print(data.keys())
        path = 'sample/' + _data + '.json'
        with open(path, 'w') as f:
            f.write(json.dumps(data))


def connect_cluster():
    # get from Nutanix cluster
    res_list = ntnx.get_xdata(prism_ip, prism_user, prism_pass)
    #eswrite_smplejson(res_list)

    if hasattr(res_list['vms'], 'status_code'):
        if res_list['vms'].status_code == 200:
            # input to Elasticsearch
            cluster_name, input_size = es.input_data(res_list)
            time.sleep(1)
            content = "データ取得完了"
        else:
            r_json = res_list['vms'].json()
            content = r_json['message_list'][0]['message']
    else: # timeout
        content = 'timeout (wrong IP?)'

    return content

def get_dataset():
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

@app.route('/', methods=['POST'])
def index_post():
    content = ''
    if request.form.get('connect'):
        content = connect_cluster()
    elif request.form.get('correct'):
        content = get_dataset()

    return render_template('index.html', \
        content = content, \
        title = title)


if __name__  == '__main__':
    app.run(host="0.0.0.0", port=777, debug=True)
















