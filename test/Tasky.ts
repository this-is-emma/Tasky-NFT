import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Tasky} from "../typechain-types";

describe("Tasky", () => {
  let tasky: Tasky;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async () => {
    tasky = await ethers.deployContract("Tasky");
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await tasky.owner()).to.equal(owner.address);
    });

    it("Should assign the contract name and symbol correctly", async () => {
      expect(await tasky.name()).to.equal("Tasky");
      expect(await tasky.symbol()).to.equal("TKY");
    });
  });

  describe("Minting", () => {
    it("Should mint a new token and assign it to owner", async () => {
      await tasky.safeMint(owner.address);
      expect(await tasky.ownerOf(0)).to.equal(owner.address);
    });

    it("Should fail if non-owner tries to mint", async () => {
      await expect(tasky.connect(addr1).safeMint(addr1.address))
      .to.be.revertedWithCustomError(tasky, "OwnableUnauthorizedAccount");
    });

    it("Should auto increment tokenId with each new minted token", async () => {
        await tasky.safeMint(await owner.getAddress());
        expect(await tasky.ownerOf(0)).to.equal(await owner.getAddress());

        await tasky.safeMint(await owner.getAddress());
        expect(await tasky.ownerOf(1)).to.equal(await owner.getAddress());
    });

    it("Should not mint more than TOKEN_CAP tokens", async () => {
      const TOKEN_CAP = 5;
      for (let i = 0; i <= TOKEN_CAP; i++) {
        await tasky.safeMint(owner.address);
      }
      await expect(tasky.safeMint(owner.address)).to.be.revertedWith("Token cap exceeded");
    });

    it("Should return the right tokenURI", async () => {
      const BASE_URI: String = "ipfs://QmPJiPyhCMCtELm2Hh5Hy4d7HoiyE6sdHURZMLzngybfbS/"
      await tasky.safeMint(owner.address);
      expect(await tasky.tokenURI(0)).to.equal(BASE_URI + "0.json");
    });
  });

  describe("Token transferring", () => {
    it("Should transfer a token from one address to another", async () => {
        await tasky.safeMint(await owner.getAddress());
        await tasky["safeTransferFrom(address,address,uint256)"](owner, addr1, 0);
        expect(await tasky.ownerOf(0)).to.equal(await addr1.getAddress());
    });

    it("Should revert when trying to transfer a token that is not owned", async () => {
      await tasky.safeMint(await owner.getAddress());
      await expect(
        tasky.connect(addr1)["safeTransferFrom(address,address,uint256)"] (addr1, addr2, 0)
      ).to.be.revertedWithCustomError(tasky, "ERC721InsufficientApproval");
    });

    it("Should not send tokens to the 0 address", async () => {
      await tasky.safeMint(await owner.getAddress());
      await expect(
        tasky["safeTransferFrom(address,address,uint256)"] (owner, ethers.ZeroAddress, 0)
      ).to.be.revertedWithCustomError(tasky, "ERC721InvalidReceiver");
    });
  });

  // Add more tests for other functionalities of your contract.
});
