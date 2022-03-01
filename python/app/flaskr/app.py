from flask import Flask
from flask import render_template, request

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
#prism_pass = 'nutanix/4u'
prism_pass = 'nutanix/4u123!'

@app.route('/')
def index():
    # get from Nutanix cluster
    #res_list = ntnx.get_xdata(prism_ip, prism_user, prism_pass)
    #print(res_list)

    return render_template('index.html', \
        title = 'Welcome to UUID X-plorer')

if __name__  == '__main__':
    app.run(host="0.0.0.0", port=777, debug=True)