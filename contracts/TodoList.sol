pragma solidity >=0.4.21 <0.7.0;

contract TodoList {
  uint public taskCount = 0;

  constructor() public {
        createTask("");
      }

  struct Task {
    uint id;
    string content;
    bool completed;
    bool deleted;
  }

  mapping(uint => Task) public tasksMap;

  function createTask(string memory _content) public {
    taskCount ++;
    tasksMap[taskCount] = Task(taskCount, _content, false, false);
  }
  
  function getTaskCount() public view returns (uint) {
    return taskCount;
  }

  function getTask(uint id) public view returns (string memory, bool, bool) {
    string memory cont = tasksMap[id].content;
    bool state = tasksMap[id].completed;
    bool del = tasksMap[id].deleted;
    return (cont, state, del);
  }

  function del(uint id) public {
    tasksMap[id].deleted = true;
  }

}
