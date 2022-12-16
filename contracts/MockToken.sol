pragma solidity ^0.8.6;

contract MockToken {
    event FallbackTriggered(address indexed a);

    address governance;
    bool public ini;
    uint public state;

    function init(address _governance) public {
        require(ini == false);
        ini = true;
        governance = _governance;
    }

    fallback() external {
        emit FallbackTriggered(msg.sender);
    }

    function changeState(uint _state) public {
        state = _state;
    }
}
