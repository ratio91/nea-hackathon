pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {
    ISuperfluid,
    ISuperToken,
    SuperAppBase,
    SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {
    IInstantDistributionAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";

contract NEA is Ownable, ERC20, SuperAppBase {

  uint32 public constant INDEX_ID = 0;
  ISuperToken private _cashToken;
  ISuperfluid private _host;
  //allows sending tokens to multiple recipients in a single transaction
  IInstantDistributionAgreementV1 private _ida;
  uint64 _share_price;
  uint256 _supply;
  address _nea;
  address _platform;

  constructor(
    string memory name, 
    string memory symbol, 
    uint256 supply,
    uint64 share_price,
    address platform,
    ISuperToken cashToken,
    ISuperfluid host,
    IInstantDistributionAgreementV1 ida
  ) public ERC20(name, symbol) {

    transferOwnership(platform);
    _platform = platform;
    _nea = msg.sender;
    _supply = supply;
    _share_price = share_price;
    _cashToken = cashToken;
    _host = host;
    _ida = ida;

    _host.callAgreement(
      _ida,
      abi.encodeWithSelector(
        _ida.createIndex.selector,
        _cashToken,
        INDEX_ID,
        new bytes(0) // placeholder ctx
      ),
      new bytes(0) // user data
    );

    _setupDecimals(0); // no decimals

    uint total = 100;
    uint platform_share = 90;
    _mint(_nea, _supply * (platform_share/total));
    _mint(_platform, _supply * ((total - platform_share)/total));
  }

  //is a function to MINT rarible NFTs neccessary?

  function _issue(address beneficiary, uint256 amount) internal {
    uint256 currentAmount = balanceOf(beneficiary);

    // first try to do ERC20 mint
    ERC20._mint(beneficiary, amount);

    _host.callAgreement(
        _ida,
        abi.encodeWithSelector(
            _ida.updateSubscription.selector,
            _cashToken,
            INDEX_ID,
            beneficiary,
            uint128(currentAmount) + uint128(amount),
            new bytes(0) // placeholder ctx
        ),
        new bytes(0) // user data
    );
  }

  function _distribute(uint256 cashAmount) internal {
    (uint256 actualCashAmount,) = _ida.calculateDistribution(
        _cashToken,
        address(this), INDEX_ID,
        cashAmount
    );

    _cashToken.transferFrom(owner(), address(this), actualCashAmount);

    _host.callAgreement(
        _ida,
        abi.encodeWithSelector(
            _ida.distribute.selector,
            _cashToken,
            INDEX_ID,
            actualCashAmount,
            new bytes(0) // placeholder ctx
        ),
        new bytes(0) // user data
    );
  }

  function supportNEA(uint64 _amount) external payable {
    require(uint64(_amount) >= _share_price,"Amount must be higher than minumum bid");
    //stream ERC777 to NEA
    _issue(msg.sender, msg.value);
  }

  fallback() external payable {
    // convert ETH to ETHx

    //distribute ETHx to the shareholders
    _distribute(msg.value);
  }

}
