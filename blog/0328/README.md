## 環境準備
Docker(desktop)  
Nutanixクラスタに接続できること  
Google Chrome（Firefoxは表示が崩れることがあります）  
  

## 起動方法
コンテナ起動  
`docker-compose -f "docker-compose.yml" up -d --build`  
  
pythonコンテナに接続し  
`cd /home/app/flaskr`  
`python app.py`  
  
ブラウザからアクセス  
`http://localhost:777/`  
  
<image src="https://user-images.githubusercontent.com/64240365/159132032-d33f259d-f80c-45ec-8595-922e399808df.png" width="700px"> 
  
  
## 使い方
接続できるNutanixクラスタのPrism IP、ユーザー、パスワードで情報取得  
  
  
  
  
  
