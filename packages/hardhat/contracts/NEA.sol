pragma solidity >=0.6.0 <0.7.0;
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

  constructor(
    string name, 
    string symbol, 
    uint256 supply,
    address platform,
    ISuperToken cashToken,
    ISuperfluid host,
    IInstantDistributionAgreementV1 ida
  ) ERC20(_name, symbol) {

    transferOwnership(platform);

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

    _mint(msg.sender, _supply*0.9);
    _mint(_platform, _supply*0.1)
  }

  //is a function to MINT rarible NFTs neccessary?

  function supportNEA() public payable {
    //stream ERC777 to NEA
    _issue()
  }

  function _issue(address beneficiary) internal {
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
        cashAmount);

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

  function buySharesOfNEA(uint64 _amount) external {
      require(uint64(_amount) > minimumBid,"Amount must be higher than minumum bid");
      require(seller != msg.sender,"You can not bid on your own auction");
      require(highestBidder != msg.sender,"You are already the highest bidder");
      require(stablecoinContract.transferFrom(msg.sender, address(this), _amount),"Transfer of bid amount in stablecoins failed");
      require(status == auctionStatus.ACTIVE,"Auction not active"); 
  }

  fallback() external payable {
    // convert ETH to ETHx

    //distribute ETHx to the shareholders
    _distribute()
  }

}
