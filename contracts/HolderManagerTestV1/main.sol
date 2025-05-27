// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;



import "./storage.sol";
import "./holder-management.sol";

contract TestToken is Storage, HolderManagement {

    //             SETUP            //
    // -------------------------------
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner)
        public initializer
    {
        __ERC20_init("TestToken", "TT");
        __ERC20Burnable_init();
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();

        _mint(address(this), 11000 * 10 ** decimals());
        _transfer(address(this), initialOwner, 10000 * 10 ** decimals());
        addHolder(initialOwner);
        prizePool = 1000 * 10 ** decimals();
        prizeRate = 1;
    }   

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    // -------------------------------


    //        TRANSFER LOGIC        //
    // -------------------------------
    function transfer(address _recipient, uint256 _amount) public override returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        addHolder(_recipient);

        return true;
    }
    // -------------------------------

}