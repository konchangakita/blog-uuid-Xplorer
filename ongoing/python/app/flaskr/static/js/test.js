class List extends React.Component {
  render () {
    return (
      <div className="list">
        {this.props.info} {this.props.cluster_name}
      </div>
    );
  }
}

class FormDisplay extends React.Component {
  render () {
    return (
      <form submit="/" method="post">
        <input type="text" name="clusterName" placeholder="Cluster name" size="10" value={this.props.clusterName} onChange={this.props.handleChangePrism} />
        <input type="hidden" name="display" value="true" />
        <input type="submit" value="表示" />
      </form>
    );
  }
}

class FormConnect extends React.Component {
  render () {
    return (
      <form className="float_l" onSubmit={this.props.handleConnectPrism} >
        <input type="text" name="prismIp" placeholder="Cluster IP" size="12" value={this.props.prismIp} onChange={this.props.handleChangePrism} />
        <input type="text" name="prismUser" placeholder="Uesrname" size="10" value={this.props.prismUser} onChange={this.props.handleChangePrism} />
        <input type="password" name="prismPass" placeholder="Password" size="10" value={this.props.prismPass} onChange={this.props.handleChangePrism} />
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
        <FormConnect
          handleChangePrism = {this.props.handleChangePrism}
          prismIp={this.props.prismIp}
          prismUser={this.props.prismUser}
          prismPass={this.props.prismPass}
          handleConnectPrism = {this.props.handleConnectPrism}
        />
        <FormDisplay
          handleChangePrism = {this.props.handleChangePrism}
          clusterName = {this.props.clusterName}
        />
      </div>
    );
  }
}

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prismIp: '',
      prismUser: '',
      prismPass: '',
      clusterName: '',
      info: ''
    };
    this.handleChangePrism = this.handleChangePrism.bind(this);
    this.handleConnectPrism = this.handleConnectPrism.bind(this);
  }

  handleChangePrism(event) {
    console.log(event.target.name, event.target.value)
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleConnectPrism = async(event) => {
    event.preventDefault();
    console.log(this.state);

    const requestOptions = {
      method: "POST",
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        prism_ip: this.state.prismIp,
        prism_user: this.state.prismUser,
        prism_pass: this.state.prismPass,
      })
    }
    const response = await fetch("/api/connect", requestOptions);
    if (response.ok) {
      let res = await response.json();
      console.log(res)
      this.setState({
        info: res.info
      });
    }
    else {
      alert("HTTP-Error: " + response.status);
    }
  }

  render () {
    return (
      <div className="content ">
        <Form
          handleChangePrism = {this.handleChangePrism}
          prismIp={this.state.prismIp}
          prismUser={this.state.prismUser}
          prismPass={this.state.prismPass}
          handleConnectPrism = {this.handleConnectPrism}
          clusterName = {this.state.clusterName}
        />
        <List
          info = {this.state.info}
          clusterName = {this.state.clusterName}
        />
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