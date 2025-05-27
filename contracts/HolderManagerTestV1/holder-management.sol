// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import "./storage.sol";

abstract contract HolderManagement is Storage {
    //       HOLDER FUNCTIONS       //
    // -------------------------------
    function addHolder(address _holder) internal {
        if(userIndex[_holder] == 0) {
            holderLenght++;

            uint256 index = holderLenght;
            HolderStruct[index] = Holder(_holder, index, block.timestamp);
            userIndex[_holder] = index;
        }
    }
    // -------------------------------
    
}
