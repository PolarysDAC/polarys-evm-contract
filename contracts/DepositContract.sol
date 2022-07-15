// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

contract DepositContract is Initializable, AccessControlUpgradeable, OwnableUpgradeable, EIP712Upgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    
    event DepositedToken(address indexed tokenAddress, address indexed sender, uint256 quantity, uint256 amount, uint256 nonce);
    event WithdrawedToken(address indexed tokenAddress, address indexed receipient, uint256 amount);
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant DEPOSIT_ROLE = keccak256("DEPOSIT_ROLE");
    
    bytes32 constant public DEPOSIT_TYPEHASH = keccak256("DepositToken(address account,uint256 quantity,uint256 amount,uint256 deadline)");

    address public acceptToken;
    uint256 private _nonce;

    function initialize(
        address _acceptToken
    ) public initializer {
        __AccessControl_init();
        __Ownable_init();
        __EIP712_init("DepositContract", "1.0.0");
        acceptToken = _acceptToken;
    }
    
    /**
    @dev Setup multisig admin role
     */
    function setupAdminRole(address admin) public onlyOwner {
        _grantRole(ADMIN_ROLE, admin);
    }

    /**
    @dev Setup deposit role
     */
    function setupDepositRole(address account) public onlyOwner {
        _grantRole(DEPOSIT_ROLE, account);
    }
    
    /**
    @dev Deposit Token
    @param quantity NFT items quantity
    @param amount deposit token amount
    @param deadline deposit deadline
    @param signature hashed signature
    * Contract can not execute this function
    */
    function depositToken(uint256 quantity, uint256 amount, uint256 deadline, bytes calldata signature) external {
        require(msg.sender == tx.origin, "Contract address is not allowed");
        require(block.timestamp <= deadline, "Invalid expiration in deposit");
        require(_verify(_hash(msg.sender, quantity, amount, deadline), signature), "Invalid signature");
        unchecked {
            ++_nonce;
        }
        IERC20Upgradeable(acceptToken).safeTransferFrom(msg.sender, address(this), amount);
        emit DepositedToken(acceptToken, msg.sender, quantity, amount, _nonce);
    }
    
    function _hash(address account, uint256 quantity, uint256 amount, uint256 deadline)
    internal view returns (bytes32)
    {
        return _hashTypedDataV4(keccak256(abi.encode(
            DEPOSIT_TYPEHASH,
            account,
            quantity,
            amount,
            deadline
        )));
    }

    function _verify(bytes32 digest, bytes memory signature)
    internal view returns (bool)
    {
        return hasRole(DEPOSIT_ROLE, ECDSAUpgradeable.recover(digest, signature));
    }

    /**
    @dev Withdraw Token
    * only Admin can execute this function
     */
    function withdrawToken(address receipient, uint256 amount) external onlyRole(ADMIN_ROLE) {
        IERC20Upgradeable(acceptToken).safeTransfer(receipient, amount);
        emit WithdrawedToken(acceptToken, receipient, amount);
    }
}