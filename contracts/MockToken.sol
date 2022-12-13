pragma solidity ^0.8.6;

contract MockToken {
  event FallbackTriggered(address indexed a);

  bool public ini;
  uint public state;
  function init(address _governance, address _liquidityManager, address _treasury, address _foundingEvent) public {
    require(ini==false);ini=true;
  }
  
  fallback() external {
    emit FallbackTriggered(msg.sender);
  }

  function changeState(uint _state) public {
    state = _state;
  }
}
