## ブログエントリ
<a href="https://konchangakita.hatenablog.com/entry/2022/04/25/210000">【Nutanix UUIDエクスプローラーを作ってみよう】Next.js特訓 ログインページをデザイン</a>


## 環境準備
Docker(desktop)  
Nutanixクラスタに接続できること  
Google Chrome（Firefoxは表示が崩れることがあります）  
  

## 起動方法
コンテナ起動  
`docker-compose -f "docker-compose.yml" up -d --build`  
  
frontendコンテナに接続し  
`cd /usr/src/next-app/uuid-xplorer`  
`npm run dev`  
  
backendコンテナに接続し  
`cd /usr/src/flaskr`  
`python app.py`  
  
ブラウザからアクセス  
`http://localhost:7778/`  
  
<image src="https://user-images.githubusercontent.com/64240365/165986762-8bdee38f-c61f-4f73-91be-d39747004b56.png" width="700px">  
