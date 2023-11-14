import * as fs from 'fs';
import {ethers} from "hardhat";
import CommunityAdminImplementation from "../../artifacts-external/community/CommunityAdminImplementation.json";
import CommunityImplementation from "../../artifacts-external/community/CommunityImplementation.json";
import ERC20 from "../../artifacts-external/token/ERC20.json";
import {fromEther} from "../../utils/helpers";

const jsonFilePath = './scripts/community/beneficiaries.json';

// mainnet
const communityAdminAddress = "0xd61c407c3A00dFD8C355973f7a14c55ebaFDf6F9";
const pactAddress = "0x46c9757C5497c5B1f2eb73aE79b6B67D119B0B58";
const spactAddress = "0xFC39D3f2cBE4D5efc21CE48047bB2511ACa5cAF3";

let communityAdmin;
let pact;
let spact;


// Function to write data to a JSON file
const writeToJSON = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Function to read data from a JSON file
const readFromJSON = (filePath: string) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
};

async function getBeneficiariesFromCommunity(communityId: number, communityAddress: string) {
  const community = await ethers.getContractAt(
    CommunityImplementation.abi,
    communityAddress
  );

  const beneficiariesNumber = Number(await community.beneficiaryListLength());

  console.log(`Community: ${communityId}, address: ${communityAddress}, number of beneficiaries: ${beneficiariesNumber}`)

  const communityBeneficiaries: any[] = readFromJSON(jsonFilePath);

  // communityBeneficiaries[0] = {'aaa': 'bbb'}
  for(let beneficiaryId = 0; beneficiaryId < beneficiariesNumber; beneficiaryId ++) {
    if (beneficiaryId % 10 == 0) console.log(beneficiaryId);
    const beneficiaryAddress = await community.beneficiaryListAt(beneficiaryId);

    communityBeneficiaries.push({
      address: beneficiaryAddress,
      communityId: communityId,
      communityAddress: communityAddress,
      status: Number((await community.beneficiaries(beneficiaryAddress))[0]),
      pactBalance: fromEther(await pact.balanceOf(beneficiaryAddress)),
      spactBalance: fromEther(await spact.balanceOf(beneficiaryAddress))
    })
  }

  writeToJSON(jsonFilePath, communityBeneficiaries);
}

async function main() {
  communityAdmin = await ethers.getContractAt(CommunityAdminImplementation.abi, communityAdminAddress);
  pact = await ethers.getContractAt(ERC20.abi, pactAddress);
  spact = await ethers.getContractAt(ERC20.abi, spactAddress);

  for(let communityId = 157; communityId < 311; communityId ++) {//communityListLength = 311
    await new Promise((resolve) => setTimeout(resolve, 6000));

    const communityAddress: string = await communityAdmin.communityListAt(communityId);

    await getBeneficiariesFromCommunity(communityId, communityAddress);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
