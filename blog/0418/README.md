## ブログエントリ
<a href="https://konchangakita.hatenablog.com/entry/2022/04/11/210000">【Nutanix UUIDエクスプローラーを作ってみよう】Next.js環境に tailwindcss/ DaisyUI/ Font Awesomeを導入</a>


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
  
ブラウザからアクセス  
`http://localhost:7778/`  
  
<image src="https://user-images.githubusercontent.com/64240365/162610455-d1a2d36d-99a5-47c3-8cd0-636489b0d3c2.png" width="700px">  
