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
        prism_ip: this.state.prism_ip,
        prism_user: this.state.prism_user,
        prism_pass: this.state.prism_pass
      })
    }
    const response = await fetch("/api/get_dataset_sample", requestOptions);
    if (response.ok) { 
      let res = await response.json();
      console.log(res)
      this.setState({
        info: res,
        title: res.title,
        timeslot: res.timeslot,
        showing : !this.state.showing
      });
    }
    else {
      alert("HTTP-Error: " + response.status);
    }

  }


  render () {
    return (
      <form className="float_l" onSubmit={this.handleConnectPrism} >
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