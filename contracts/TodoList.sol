// SPDX-License-Identifier: MIT
pragma solidity >0.5.2;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
    bool deleted;
  }

  mapping(uint => Task) public tasksMap;
  // Task[] public tasksMap;

  function createTask(string memory _content) public {
    tasksMap[taskCount] = Task(taskCount, _content, false, false);
    // tasksMap.push(task);
    taskCount ++;
  }
  
  function getTaskCount() public view returns (uint) {
    return taskCount;
  }

  function getTask(uint _i) public view returns (uint, string memory, bool, bool) {
    uint id = _i;
    string memory cont = tasksMap[_i].content;
    bool state = tasksMap[_i].completed;
    bool dele = tasksMap[_i].deleted;
    return (id, cont, state, dele);
  }

  function deleteTask(uint _id) public returns (string memory) {
    // tasksMap[id] = Task(id, "", false, true);
    // Task storage task = tasksMap[id];
    // task.deleted = true;
    tasksMap[_id].deleted = true; 

    return tasksMap[_id].content;
  }

  function toggleComplete(uint _id) public {
    tasksMap[_id].completed = !tasksMap[_id].completed;
  }

}
