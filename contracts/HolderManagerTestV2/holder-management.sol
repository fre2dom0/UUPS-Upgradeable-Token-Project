// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import "./storage.sol";

abstract contract HolderManagement is Storage {
    //       HOLDER FUNCTIONS       //
    // -------------------------------
    function addHolder(address _holder) public {
        if(userIndex[_holder] == 0) {
            holderLenght++;
            if(freeIndices.length > 0) {
                uint256 index = freeIndices[0];
                HolderStruct[index] = Holder(_holder, index, block.timestamp);
                userIndex[_holder] = index;
                freeIndices[0] = freeIndices[freeIndices.length - 1];
                freeIndices.pop(); 
            }
            else {
                uint256 index = holderLenght;
                HolderStruct[index] = Holder(_holder, index, block.timestamp);
                userIndex[_holder] = index;
            }
        }
    }

    function removeHolder(address _holder) public {
        uint256 index = userIndex[_holder];
        require(index != 0, "User is not a holder!");
        
        freeIndices.push(index);
        delete userIndex[_holder];

        holderLenght--;
    }
    // -------------------------------
    
}
