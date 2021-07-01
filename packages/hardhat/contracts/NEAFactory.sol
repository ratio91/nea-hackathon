pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "NEA.sol";
import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract NEAFactory {

  constructor() {}

  function deployNEA (
    uint64 _share_price,
  ) 
  public
  returns (address _NEA_address)
  {
    NEA newArtist = new Artist(
      msg.sender, 
      _share_price
    );
  }

}
