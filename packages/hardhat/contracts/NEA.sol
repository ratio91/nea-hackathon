pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

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
import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {
  ISETHCustom
} from  "@superfluid-finance/ethereum-contracts/contracts/tokens/SETH.sol";

contract NEA is Ownable, ERC20, SuperAppBase {

  uint32 public constant INDEX_ID = 0;
  ISuperToken private _ethx;
  ISuperfluid private _host;
  IInstantDistributionAgreementV1 private _ida;
  IConstantFlowAgreementV1 private _cfa;

  uint64 _share_price;
  uint256 _supply;
  address _nea;
  address _platform;

  constructor(
    address nea,
    string memory name, 
    string memory symbol, 
    uint256 supply,
    uint64 share_price,
    address platform,
    ISuperToken ethx,
    ISuperfluid host,
    IInstantDistributionAgreementV1 ida,
    IConstantFlowAgreementV1 cfa
  ) public ERC20(name, symbol) {

    transferOwnership(platform);
    _platform = platform;
    _nea = nea;
    _supply = supply;
    _share_price = share_price;
    _ethx = ethx;
    _host = host;
    _ida = ida;
    _cfa = cfa;

    // create pool
    _host.callAgreement(
      _ida,
      abi.encodeWithSelector(
        _ida.createIndex.selector,
        _ethx,
        INDEX_ID,
        new bytes(0)
      ),
      new bytes(0)
    );

    _setupDecimals(0); // no decimals

    uint total = 100;
    uint platform_share = 90;
    _mint(_nea, _supply * (platform_share/total));
    _mint(_platform, _supply * ((total - platform_share)/total));
  }

  /**
  @dev issue shares
  @param beneficiary investor address
  @param amount amount invested
  */
  function _issue(address beneficiary, uint256 amount) internal {
    uint256 currentAmount = balanceOf(beneficiary);
    ERC20._mint(beneficiary, amount);

    //update # shares
    _host.callAgreement(
        _ida,
        abi.encodeWithSelector(
            _ida.updateSubscription.selector,
            _ethx,
            INDEX_ID,
            beneficiary,
            uint128(currentAmount) + uint128(amount),
            new bytes(0)
        ),
        new bytes(0)
    );
  }

  /**
  @dev investor sends ETH and it gets streamed to the artist; he receives shares in return
  */
  function supportNEA() external payable {
    
    //upgrade ETH to ETHx [TODO]
    ISETHCustom(address(_ethx)).upgradeByETH{value: msg.value}();

    //check if flow exists
    (,int96 outFlowRate,,) = _cfa.getFlow(_ethx, address(this), _nea); 
    
    //stream over 30 days
    if (outFlowRate == 0) {
       _host.callAgreement(
          _cfa,
          abi.encodeWithSelector(
              _cfa.createFlow.selector,
              _ethx,
              _nea,
              int96(int256(msg.value/2592000)), 
              new bytes(0)
          ),
          "0x"
      );
    }
    else if (outFlowRate > 0) {
      _host.callAgreement(
          _cfa,
          abi.encodeWithSelector(
              _cfa.updateFlow.selector,
              _ethx,
              _nea,
              int96(int256(address(this).balance/2592000)), 
              new bytes(0)
          ),
          "0x"
      );
    }

    _issue(msg.sender, msg.value);
  }

  /**
  @dev distribute ETHx tokens to all shareholders in a single transaction
  @param cashAmount amount to distribute
  */
  function _distribute(uint256 cashAmount) internal {
    //divides amount to be distributed by # of outstanding shares (& removes excess - do NOT test with low # of wei!)
    (uint256 actualCashAmount,) = _ida.calculateDistribution(
        _ethx,
        address(this), INDEX_ID,
        cashAmount
    );

    _host.callAgreement(
        _ida,
        abi.encodeWithSelector(
            _ida.distribute.selector,
            _ethx,
            INDEX_ID,
            actualCashAmount,
            new bytes(0) // placeholder ctx
        ),
        new bytes(0) // user data
    );
  }

  fallback() external payable {
    //upgrade ETH to ETHx
    ISETHCustom(address(_ethx)).upgradeByETH{value: msg.value}();

    _distribute(msg.value);
  }

}
