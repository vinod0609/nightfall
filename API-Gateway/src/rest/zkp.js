const request = require('request');
const Config = require('../config/config').getProps();

const host = `${Config.zkp.host  }:${  Config.zkp.port}`;


const loadVks = (details, headers) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/vk`,
      method : 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'address': headers.address,
        'password': headers.password,
      },
      body: details,
    };
    request(options, (err, res, body) => {
      if(err)
        return reject(err);
      if(body.statusCode !== 200)
        return reject(body);
      return resolve(body);
    });
  });
};

const mintToken = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/token/mint`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const spendToken = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/token/transfer`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const burnToken = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/token/burn`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const mintCoin = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/coin/mint`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const transferCoin = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/coin/transfer`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const burnCoin = (details, {address}) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/coin/burn`,
      method : 'POST',
      json: true,
      headers: {address},
      body: details,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const mintNFToken = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/nft/mint`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const transferNFToken = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/nft/transfer`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const burnNFToken = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/nft/burn`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const transferFToken = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/ft/transfer`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const setTokenShield = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/token/shield`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};


const setCoinShield = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/coin/shield`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};


const unSetCoinShield = ({address}) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/coin/shield`,
      method : 'DELETE',
      json: true,
      headers: { address },
    };
    request(options, (err, res, body) => {
      if(err)
        return reject(err);
      if(body.statusCode !== 200)
        return reject(body);
      return resolve(body);
    });
  });
};

const unSetTokenShield = ({address}) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/token/shield`,
      method : 'DELETE',
      json: true,
      headers: { address },
    };
    request(options, (err, res, body) => {
      if(err)
        return reject(err);
      if(body.statusCode !== 200)
        return reject(body);
      return resolve(body);
    });
  });
};

const mintFToken = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/ft/mint`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const burnFToken = ({address}, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/ft/burn`,
      method : 'POST',
      json: true,
      headers: { address },
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const checkCorrectnessToken = (headers, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/token/checkCorrectness`,
      method : 'POST',
      json: true,
      headers,
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const checkCorrectnessCoin = (headers, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/coin/checkCorrectness`,
      method : 'POST',
      json: true,
      headers,
      body,
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const getCoinShield = ({address}) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/coin/shield`,
      method : 'GET',
      json: true,
      headers: { address },
    };
    request(options, (err, res, bodyDetails) => {
      if(err)
        return reject(err);
      if(bodyDetails.statusCode !== 200)
        return reject(bodyDetails);
      return resolve(bodyDetails);
    });
  });
};

const getTokenShield = ({address}) => {
  return new Promise((resolve, reject) => {
    const options = {
      url : `${host  }/token/shield`,
      method : 'GET',
      json: true,
      headers: { address },
    };
    request(options, (err, res, body) => {
      if(err)
        return reject(err);
      if(body.statusCode !== 200)
        return reject(body);
      return resolve(body);
    });
  });
};


module.exports = {
  loadVks,
  mintToken,
  spendToken,
  mintCoin,
  transferCoin,
  burnToken,
  burnCoin,
  mintNFToken,
  transferNFToken,
  burnNFToken,
  transferFToken,
  setTokenShield,
  setCoinShield,
  unSetCoinShield,
  unSetTokenShield,
  mintFToken,
  burnFToken,
  checkCorrectnessToken,
  checkCorrectnessCoin,
  getCoinShield,
  getTokenShield,
};
