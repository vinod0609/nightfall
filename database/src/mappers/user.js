import Utils from 'zkp-utils';

const utils = Utils('/app/config/stats.json');

export default async function({ name, email, address, isAuditor, shhIdentity }) {
  const hash = await utils.rndHex(27);
  return {
    name,
    email,
    address: address.toLowerCase(),
    is_auditor: isAuditor,
    shh_identity: shhIdentity,
    secretkey: hash,
    publickey: utils.hash(hash),
  };
}
