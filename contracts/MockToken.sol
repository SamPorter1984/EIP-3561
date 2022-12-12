pragma solidity ^0.8.6;

contract MockToken {

  bool public ini;
  function init(address _governance, address _liquidityManager, address _treasury, address _foundingEvent) public {
    require(ini==false);ini=true;
  }
  
  fallback() external {}
}
