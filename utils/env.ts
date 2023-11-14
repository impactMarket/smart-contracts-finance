import * as dotenv from 'dotenv';
import hre from 'hardhat';

const configs = (dotenv.config({
  path: `.env.${hre.network.name}`,
})).parsed;

const GetIntEnvVar = (name: string): number => {
  const value = parseInt(configs[name] as string, 10);
  if (Number.isNaN(value)) {
    throw new Error(`Error while trying to parse env variable ${name} as Int. Raw value: ${configs[name]}`);
  }
  return value;
};

const GetFloatEnvVar = (name: string): number => {
  const value = parseFloat(configs[name] as string);
  if (Number.isNaN(value)) {
    throw new Error(`Error while trying to parse env variable ${name} as Float. Raw value: ${configs[name]}`);
  }
  return value;
};

const GetStringEnvVar = (name: string): string => {
  const value = configs[name];
  if (value === undefined) {
    throw new Error(`Env variable ${name} is not defined`);
  }
  return value;
};

const GetBooleanEnvVar = (name: string): boolean => {
  const value = configs[name];
  if (value === undefined) {
    throw new Error(`Env variable ${name} is not defined`);
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  throw new Error(`Error while trying to parse env variable ${name} as Boolean. Raw value: ${configs[name]}`);
};

const GetListOfStringEnvVar = (name: string): string[] => {
  const value = configs[name];
  if (value === undefined) {
    throw new Error(`Env variable ${name} is not defined`);
  }

  return value.split(",");
};

export const appConfig = {
  DEPLOYER_PRIVATE_KEY: GetStringEnvVar("DEPLOYER_PRIVATE_KEY"),
  DEPLOYER_PUBLIC_ADDRESS: GetStringEnvVar("DEPLOYER_PUBLIC_ADDRESS"),
  IMPACT_MULTISIG_PROXY_ADMIN_ADDRESS: GetStringEnvVar("IMPACT_MULTISIG_PROXY_ADMIN_ADDRESS"),
  CUSD_ADDRESS: GetStringEnvVar("CUSD_ADDRESS"),
};
