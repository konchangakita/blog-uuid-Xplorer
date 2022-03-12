class List extends React.Component {
  render () {
    return (
      <div className="list">
      </div>
    );
  }
}

class FormDisplay extends React.Component {
  render () {
    return (
      <form submit="/" method="post">
        <input type="text" name="cluster_name" placeholder="Cluster name" size="10" ></input>
        <input type="hidden" name="display" value="true" />
        <input type="submit" value="表示" />
      </form>
    );
  }
}

class FormConnect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prism_ip: '',
      prism_user: '',
      prism_pass: '' 
    };
    this.handleChangePrism = this.handleChangePrism.bind(this);
  }

  handleChangePrism(event) {
    console.log(event.target.name, event.target.value)
  }

  render () {
    return (
      <form className="float_l" >
        <input type="text" name="prism_ip" placeholder="Cluster IP" size="12" value={this.state.prism_ip} onChange={this.handleChangePrism} />
        <input type="text" name="prism_user" placeholder="Uesrname" size="10" value={this.state.prism_user} onChange={this.handleChangePrism} />
        <input type="password" name="prism_pass" placeholder="Password" size="10" value={this.state.prism_pass} onChange={this.handleChangePrism} />
        <input type="hidden" name="connect" value="true" />
        <input type="submit" value="データ収集" />
      </form>
    );
  }
}

class Form extends React.Component {
  render () {
    return (
      <div>
        <FormConnect />
        <FormDisplay />
      </div>
    );
  }
}

class Content extends React.Component {
  render () {
    return (
      <div className="content ">
        <Form />
        <List />
      </div>
    );
  }
}

class Container extends React.Component {
  render () {
    return (
      <div className="container">
        <h1>Welcome to UUID X-plorer</h1>
        <Content />
      </div>
    );
  }
}


ReactDOM.render(
  <Container />,
  document.getElementById('root')
);