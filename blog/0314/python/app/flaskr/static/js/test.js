const element =
  <div className="container">
    <h1>Welcome to UUID X-plorer</h1>
    <div className="content">
      <form submit="/" method="post" className="float_l" >
        <input type="text" name="prism_ip" placeholder="Cluster IP" size="12" />
        <input type="text" name="prism_user" placeholder="Uesrname" size="10" />
        <input type="password" name="prism_pass" placeholder="Password" size="10" />
        <input type="hidden" name="connect" value="true" />
        <input type="submit" value="データ収集" />
      </form>
      <form submit="/" method="post">
        <input type="text" name="cluster_name" placeholder="Cluster name" size="10" ></input>
        <input type="hidden" name="display" value="true" />
        <input type="submit" value="表示" />
      </form>
      <div className="list">
      </div>
    </div>
  </div>

ReactDOM.render(
  element,
  document.getElementById('root')
);