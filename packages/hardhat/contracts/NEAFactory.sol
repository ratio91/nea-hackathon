pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "./NEA.sol";
import {
    ISuperfluid,
    ISuperToken
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {
    IInstantDistributionAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";

contract NEAFactory {

  mapping(address => address) _identity;
  address _platform;
  uint256 _supply;
  uint64 _share_price;
  ISuperToken private _cash_token;
  ISuperfluid private _host;
  IInstantDistributionAgreementV1 _ida;

  constructor(
    ISuperfluid host,
    ISuperToken cash_token,
    IInstantDistributionAgreementV1 ida,
    uint256 supply,
    uint64 share_price
  ) {
    _platform = msg.sender;
    _supply = supply;
    _share_price = share_price;
    _cash_token = cash_token;
    _host = host;
    _ida = ida;
  }

  function getIdentity(
    address id
  )
  public
  view
  returns (address _NEA_address)
  {
    return (_identity[id]);
  }

  function deployNEA(
    string memory name, 
    string memory symbol
  ) 
  public
  returns (address _NEA_address)
  {
    require(
      _identity[msg.sender] == address(0), 
      "NEA must not have more than 1 contract instance"
    );
    NEA newArtist = new NEA(
      name, 
      symbol, 
      _supply,
      _share_price,
      _platform,
      _cash_token,
      _host,
      _ida
    );
    _identity[msg.sender] = address(newArtist);
    return(address(newArtist));
  }

}
