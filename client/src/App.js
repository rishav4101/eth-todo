import React, { Component } from "react";
import TodoListContract from "./contracts/TodoList.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, taskContract:null, tasks: [], inputTask: "" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TodoListContract.networks[networkId];

      const instance = new web3.eth.Contract(
        TodoListContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, taskContract: instance }, this.runInitialState);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runInitialState = async () => {
    await this.updateState();
    console.log(this.state.tasks);
  };

  handleChange = ({ target }) => {
    this.setState({
      inputTask: target.value
    });
  }

  updateState = async () => {
    const { taskContract } = this.state;
    const tsk = await taskContract.methods.getTaskCount().call();

    const ar = [];

    for(var i = 0; i<tsk; i++){
      const task = await taskContract.methods.getTask(i).call();
      if(task[3] === false)
        ar.push({"id": task[0], "task": task[1], "status": task[2], "deleted":task[3]});
    }

    // Update state with the result.
    this.setState({ tasks: ar });
  }

  createtask = async () => {
    const { accounts, taskContract, inputTask } = this.state;
    await taskContract.methods.createTask(inputTask).send({ from: accounts[0], gas:100000 });

    await this.updateState();
    this.setState({inputTask: "" });
  }

  deleteAll = async () => {
    const { accounts, taskContract, inputTask } = this.state;
    const tsk = await taskContract.methods.getTaskCount().call();

    for(var i = 0; i<tsk; i++){
     var a = await taskContract.methods.deleteTask(i).send({ from: accounts[0], gas:100000 });
    }

    await this.updateState();
  }

  deleteOne = async id => {
    const { accounts, taskContract, inputTask } = this.state;
    var a = await taskContract.methods.deleteTask(id).send({ from: accounts[0], gas:100000 });
    await this.updateState();
  }

  toggleComp = async id => {
    const { accounts, taskContract } = this.state;
    await taskContract.methods.toggleComplete(id).send({ from: accounts[0], gas:100000 });
    await this.updateState();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>TODO DAPP</h1>
        <h2>Smart Contract Example</h2>
        <div>Your account: {this.state.accounts[0]}</div>
        <br/>
        <input
        placeholder="Enter todo task..."
        type="text" 
        name="inputTask"
        value={ this.state.inputTask }
        onChange={ this.handleChange }  
        />
        <button onClick={this.createtask}> create </button>
        <button onClick={this.deleteAll}> Delete all </button>
        <br/>
        <h2>All Tasks</h2>
        {this.state.tasks.map((val) => (
          <div key={val.id}><input type="checkbox" defaultChecked={val.status} onChange={() => this.toggleComp(val.id)}/> {val.task} 
          <button onClick={() => this.deleteOne(val.id)}>Delete</button>
          </div>
        ))}
        
      </div>
    );
  }
}

export default App;
