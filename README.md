# UUPS Upgradeable Token Project

This project demonstrates the implementation of an upgradeable ERC20 token using the UUPS (Universal Upgradeable Proxy Standard) pattern. The token includes a holder management system that tracks token holders and their balances.

## Features

- ERC20 token with upgradeable functionality
- Holder management system
- Prize pool mechanism
- UUPS upgrade pattern implementation
- Comprehensive test coverage

## Project Structure

```
├── contracts/
│   ├── HolderManagerTestV1/
│   │   ├── main.sol
│   │   ├── storage.sol
│   │   └── holder-management.sol
│   └── HolderManagerTestV2/
├── test/
│   └── test.js
├── scripts/
├── hardhat.config.js
└── package.json
```

## Technical Details

### Token Specifications
- Name: TestToken
- Symbol: TT
- Decimals: 18
- Initial Supply: 11,000 tokens
- Initial Owner Allocation: 10,000 tokens
- Prize Pool: 1,000 tokens

### Key Features

1. **Holder Management**
   - Tracks all token holders
   - Maintains holder indices
   - Records creation dates
   - Prevents duplicate holder entries

2. **Upgradeable Architecture**
   - Uses UUPS pattern for upgrades
   - Maintains state across upgrades
   - Preserves holder information

3. **Token Operations**
   - Standard ERC20 transfers
   - Burnable functionality
   - Owner-only administrative functions

## Testing

The project includes comprehensive tests covering:
- Basic token transfers
- Holder management
- Upgrade functionality
- State preservation
- Edge cases

To run tests:
```bash
npx hardhat test
```

## Development

### Prerequisites
- Node.js
- npm or yarn
- Hardhat

### Installation
```bash
npm install
```

## Security Considerations

- Only owner can perform upgrades
- Initializer pattern implementation
- State variable protection
- Access control mechanisms

## License

MIT

