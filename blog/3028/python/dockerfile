FROM python:3.9.9-slim

RUN apt update -y
RUN apt install -y curl
RUN pip install -U pip
RUN pip install flask
RUN pip install jupyterlab
RUN pip install elasticsearch

#RUN apt install -y netcat
WORKDIR /home

# execute jpyterlab
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--allow-root", "--LabApp.token=''"]