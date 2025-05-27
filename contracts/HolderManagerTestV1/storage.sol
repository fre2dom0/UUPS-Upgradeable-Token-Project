// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

abstract contract Storage is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    //        [V1 VARIABLES]
    //        PRIZE VARIABLES       //
    // -------------------------------
    uint8 internal prizeRate;
    uint256 internal prizePool;
    // -------------------------------


    //       HOLDER VARIABLES       //
    // -------------------------------
    struct Holder {
        address _holderAddress;
        uint256 _holderIndex;
        uint256 _creationDate;
    }
    mapping(uint256 => Holder) internal HolderStruct;
    mapping(address => uint256) internal userIndex;
    uint256 internal holderLenght;
    // -------------------------------


    //       SETTER FUNCTIONS       //
    // -------------------------------
    function setPrizeRate(uint8 _rate) public onlyOwner { prizeRate = _rate; }
    // -------------------------------


    //       GETTER FUNCTIONS       //
    // -------------------------------
    function getPrizeRate() public view returns (uint8) { return prizeRate; }
    function getPrizePool() public view returns (uint256) { return prizePool; }
    function getHolderByIndex(uint256 _index) public view  returns (Holder memory) { 
        require(_index != 0, "Index can't be zero"); 
        return HolderStruct[_index]; 
    }
    function getHolderByAddress(address _address) public view returns (Holder memory) {
        uint256 index = userIndex[_address];
        require(index != 0, "Address not found"); 
        return HolderStruct[index];
    }
    function getHolderIndex(address _address) public view returns (uint256) {
        return userIndex[_address];
    }

    function getHolderAmount() public view returns (uint256) { return holderLenght; }
    // -------------------------------
    
}
