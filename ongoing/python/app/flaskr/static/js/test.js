class List extends React.Component {
  render () {
    const data = this.props.data;
    const vms = data.vms;
    const volumeGroups = data.volume_groups;
    const filterText = this.props.filterText

    const listVms = vms ?
      vms.map((vm, key) => {
        if ( vm.spec.name.indexOf(filterText) !== -1 ) {
          return (
            <li key={key}>
              {vm.spec.name} : {vm.metadata.uuid}
            </li>
          );
        }
        return;
      })
      : null;

    return (
      <div className="list">
        <div><input type="text" placeholder="filter..." name="filterText" onChange={this.props.handleChangePrism} /></div>
        {this.props.info}
        <ol>
          {listVms}
        </ol>
      </div>
    );
  }
}

class FormDisplay extends React.Component {
  render () {
    return (
      <form submit="/" onSubmit={this.props.handleGetDataset} >
        <input type="text" name="clusterName" placeholder="Cluster name" size="10" value={this.props.clusterName} onChange={this.props.handleChangePrism} />
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
          handleGetDataset = {this.props.handleGetDataset}
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
      info: '',
      data: '',
      filterText: ''
    };
    this.handleChangePrism = this.handleChangePrism.bind(this);
    this.handleConnectPrism = this.handleConnectPrism.bind(this);
    this.handleGetDataset = this.handleGetDataset.bind(this);
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
        info: res.info,
        clusterName: res.cluster_name,
      });
    }
    else {
      alert("HTTP-Error: " + response.status);
    }
  }

  handleGetDataset = async(event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        cluster_name: this.state.clusterName
      })
    }
    const response = await fetch("/api/latestdataset", requestOptions);
    if (response.ok) {
      let res = await response.json();
      console.log(res)
      this.setState({
        data: res,
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
          handleGetDataset = {this.handleGetDataset}
          clusterName = {this.state.clusterName}
        />
        <List
          handleChangePrism = {this.handleChangePrism}
          info = {this.state.info}
          clusterName = {this.state.clusterName}
          data = {this.state.data}
          filterText = {this.state.filterText}
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