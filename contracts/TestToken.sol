// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TestToken is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    event MintedToken(address indexed to, uint256 amount);

    uint8 public _decimals;

    function initialize(
        string memory _name,
        string memory _symbol,
        uint8 _ddecimals
    ) public initializer {
        __ERC20_init(_name, _symbol);
        __Ownable_init();
        _decimals = _ddecimals;
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function setupDecimals(uint8 _ddecimals) public {
        _decimals = _ddecimals;
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        require(_amount > 0, "amount is 0");
        _mint(_to, _amount);
        
        emit MintedToken(_to, _amount);
    }
}