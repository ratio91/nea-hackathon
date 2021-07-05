module.exports = [
  {
    inputs: [
      {
        internalType: "contract ISuperfluid",
        name: "host",
        type: "address",
      },
      {
        internalType: "contract ISuperToken",
        name: "cash_token",
        type: "address",
      },
      {
        internalType: "contract IInstantDistributionAgreementV1",
        name: "ida",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "supply",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "share_price",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "deployNEA",
    outputs: [
      {
        internalType: "address",
        name: "_NEA_address",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
    ],
    name: "getIdentity",
    outputs: [
      {
        internalType: "address",
        name: "_NEA_address",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
