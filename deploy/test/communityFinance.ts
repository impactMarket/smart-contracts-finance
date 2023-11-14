import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import {appConfig} from "../../utils/env";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, ethers } = hre;
	const { deploy } = deployments;

	const accounts: HardhatEthersSigner[] = await ethers.getSigners();
	const deployer = accounts[0];
	const owner = accounts[1];

	// deploy communityFinance
	const communityFinanceImplementation = await deploy(
		"CommunityFinanceImplementation",
		{
			from: deployer.address,
			args: [],
			log: true,
			// gasLimit: 13000000,
		}
	);

	const communityFinanceProxyContract = await ethers.getContractAt(
		"CommunityFinanceImplementation",
		communityFinanceImplementation.address
	);

	const communityFinanceProxy = await deploy("CommunityFinanceProxy", {
		from: deployer.address,
		args: [
			communityFinanceImplementation.address,
			appConfig.IMPACT_MULTISIG_PROXY_ADMIN_ADDRESS,
			(new ethers.Interface(communityFinanceImplementation.abi)).encodeFunctionData('initialize', [deployer.address])
		],
		log: true,
		// gasLimit: 13000000,
	});


	const communityFinanceContract = await ethers.getContractAt(
		"CommunityFinanceImplementation",
		communityFinanceProxy.address
	);

	await communityFinanceContract.transferOwnership(owner.address);
};

export default func;
func.dependencies = ["ImpactProxyAdminTest"];
func.tags = ["CommunityFinanceTest"];
