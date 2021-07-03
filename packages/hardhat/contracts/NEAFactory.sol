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

  function deployNEA(
    string memory name, 
    string memory symbol
  ) 
  public
  returns (address _NEA_address)
  {
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
  }

}
