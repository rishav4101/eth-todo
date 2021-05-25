import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import TodoListContract from "./contracts/TodoList.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, taskContract:null, tasks: [], inputTask: "" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const deployedNetwork2 = TodoListContract.networks[networkId];

      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const instance2 = new web3.eth.Contract(
        TodoListContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, taskContract: instance2 }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, taskContract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });
    // await taskContract.methods.createTask("hi babe!").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    const tsk = await taskContract.methods.getTaskCount().call();

    const ar = [];

    for(var i = 0; i<tsk; i++){
      const task = await taskContract.methods.getTask(i).call();
      console.log(task[0]);
      if(task[2] === false)
        ar.push({"task": task[0], "status": task[1]});
    }

    console.log(ar);

    // Update state with the result.
    this.setState({ storageValue: response, tasks: ar });
    console.log(this.state.tasks);
  };

  handleChange = ({ target }) => {
    this.setState({
      inputTask: target.value
    });
  }

  createtask = async () => {
    const { accounts, taskContract, inputTask } = this.state;
    await taskContract.methods.createTask(inputTask).send({ from: accounts[0] });

    const ar = [];

    const tsk = await taskContract.methods.getTaskCount().call();

    for(var i = 0; i<tsk; i++){
      const task = await taskContract.methods.getTask(i).call();
      if(task[2] === false)
        ar.push({"task": task[0], "status": task[1]});
    }

    // Update state with the result.
    this.setState({tasks: ar, inputTask: "" });
  }

  deleteAll = async () => {
    const { accounts, taskContract, inputTask } = this.state;
    const tsk = await taskContract.methods.getTaskCount().call();
    console.log(tsk);

    for(var i = 0; i<tsk; i++){
      var a = await taskContract.methods.del(i).call();
    }

    console.log(a)

    const tskc = await taskContract.methods.getTaskCount().call();
    console.log(tskc);
    // Update state with the result.
    this.setState({tasks: [] });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>Your account: {this.state.accounts[0]}</div>
        {this.state.tasks.map((val) => (
          <div>{val.task}</div>
        ))}
        <input
        placeholder="Enter todo task..."
        type="text" 
        name="inputTask"
        value={ this.state.inputTask }
        onChange={ this.handleChange }  
        />
        <button onClick={this.createtask}> create </button>
        <button onClick={this.deleteAll}> Delete all </button>
      </div>
    );
  }
}

export default App;
