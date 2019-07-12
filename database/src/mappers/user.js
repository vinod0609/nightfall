export default function ({ name, email, address, isAuditor, shhIdentity }) {
  return {
    name,
    email,
    address: address.toLowerCase(),
    is_auditor: isAuditor,
    shh_identity: shhIdentity,
  };
}
