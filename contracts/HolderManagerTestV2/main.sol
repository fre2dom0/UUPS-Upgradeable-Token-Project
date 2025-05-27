// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;



import "./storage.sol";
import "./holder-management.sol";

contract TestTokenV2 is Storage, HolderManagement {

    //             SETUP            //
    // -------------------------------
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    /// @custom:oz-upgrades-validate-as-initializer
    function initializeV2(address initialOwner) public reinitializer(2) {
        __ERC20_init("TestToken", "TT"); 
        __ERC20Burnable_init();           
        __Ownable_init(initialOwner); 
        __UUPSUpgradeable_init();          

        minHoldingTime = 30 days;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    // -------------------------------


    //        TRANSFER LOGIC        //
    // -------------------------------
    function transfer(address _recipient, uint256 _amount) public override returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        addHolder(_recipient);
        
        if(balanceOf(msg.sender) == 0) {
            removeHolder(msg.sender);
        }

        return true;
    }
    // -------------------------------

}