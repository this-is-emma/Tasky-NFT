import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CONTRACT_NAME = "Tasky";

export default buildModule(CONTRACT_NAME, (m) => {
  const contract = m.contract(CONTRACT_NAME, );
  return { contract };
});
