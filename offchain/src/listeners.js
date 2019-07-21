import db from './rest/db';
import apiGateway from './rest/api-gateway';

const addFToken = async data => {
  try {
    console.log('\noffchain/src/listeners.js', '\naddFToken', '\ndata', data);
    await db.addFToken(data, {
      amount: data.amount,
      shieldContractAddress: data.shieldContractAddress,
      transferor: data.transferor,
      transferorAddress: data.transferorAddress,
      isReceived: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const addNFTToken = async data => {
  try {
    console.log('\noffchain/src/listeners.js', '\naddNFTToken', '\ndata', data);

    await db.addNFTToken(data, {
      uri: data.uri,
      tokenId: data.tokenId,
      shieldContractAddress: data.shieldContractAddress,
      transferor: data.transferor,
      transferorAddress: data.transferorAddress,
      isReceived: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const addToken = async (data, userData) => {
  try {
    console.log(
      '\noffchain/src/listeners.js',
      '\naddToken',
      '\ndata',
      data,
      '\nuserData',
      userData,
    );

    const correctnessChecks = await apiGateway.checkCorrectnessToken(
      {
        authorization: userData.jwtToken,
      },
      {
        A: data.tokenId,
        pk: data.transfereePublicKey,
        S_A: data.salt,
        z_A: data.commitment,
        z_A_index: data.commitmentIndex,
      },
    );

    console.log(
      '\noffchain/src/listeners.js',
      '\naddToken',
      '\ncorrectnessChecks',
      correctnessChecks,
    );

    await db.addToken(data, {
      tokenUri: data.tokenUri,
      tokenId: data.tokenId,
      salt: data.salt,
      commitment: data.commitment,
      commitmentIndex: data.commitmentIndex,
      isReceived: true,
      zCorrect: correctnessChecks.data.z_correct,
      zOnchainCorrect: correctnessChecks.data.z_onchain_correct,
    });
  } catch (err) {
    console.log(err);
  }
};

const addCoin = async (data, userData) => {
  try {
    console.log('\noffchain/src/listeners.js', '\naddCoin', '\ndata', data, '\nuserData', userData);

    const correctnessChecks = await apiGateway.checkCorrectnessCoin(
      {
        authorization: userData.jwtToken,
      },
      {
        E: data.amount,
        S_E: data.salt,
        pk: data.pk,
        z_E: data.commitment,
        z_E_index: data.commitmentIndex,
      },
    );

    console.log(
      '\noffchain/src/listeners.js',
      '\naddCoin',
      '\ncorrectnessChecks',
      correctnessChecks,
    );

    await db.addCoin(data, {
      amount: data.amount,
      salt: data.salt,
      commitment: data.commitment,
      commitmentIndex: data.commitmentIndex,
      isReceived: true,
      ...correctnessChecks.data,
    });
  } catch (err) {
    console.log(err);
  }
};

const listeners = async (data, userData) => {
  console.log('\noffchain/src/listeners.js', '\nlisteners', '\ndata', data, '\nuserData', userData);

  const actualPayload = data.payload;
  switch (actualPayload.for) {
    case 'coin':
      await addCoin(actualPayload, userData);
      break;
    case 'token':
      await addToken(actualPayload, userData);
      break;
    case 'NFTToken':
      await addNFTToken(actualPayload, userData);
      break;
    case 'FToken':
      await addFToken(actualPayload, userData);
      break;
    default:
      throw Error('payload.for is invalid');
  }
};

export default listeners;
