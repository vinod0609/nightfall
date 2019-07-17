/** **************************************************************************
*                      index.js
* This is the rest API for the Authentication  microservice, which provides
* Authentication and AUthorisation from  the Blockchain

**************************************************************************** */

import rootRouter from './routes/api-gateway';
import nftCommitmentRoutes from './routes/nft_commitment';
import ftCommitmentRoutes from './routes/ft_commitment';
import ftRoutes from './routes/ft';
import nftRoutes from './routes/nft';
import userRoutes from './routes/user';
import shieldRoutes from './routes/shield';

const express = require('express');

const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const cors = require('cors'); // cors is used to allow cross origin requests
const config = require('./config/config');
// require the config file
config.setEnv(process.env.NODE_ENV);
const Config = require('./config/config').getProps(); // get the properties of environment

const logger = require('./logger');

const {
  authentication,
} = require('./middlewares/authMiddleware'); /* Authorization filter used to verify Role of the user */
const { unlockAccount } = require('./middlewares/passwordMiddleware');

app.use(bodyParser.json()); // set up a filter to parse JSON

app.use(cors()); // cross origin filter
app.use(authentication);

app.use('/zkp', unlockAccount, proxy(`${Config.zkp.app.host  }:${  Config.zkp.app.port}`));
app.use('/database', proxy(`${Config.database.host  }:${  Config.database.port}`));
app.use(
  '/offchain-service',
  unlockAccount,
  proxy(`${Config.offchain.app.host  }:${  Config.offchain.app.port}`),
);
app.use('/', unlockAccount, router);
app.use('/', rootRouter);
app.use('/token', nftCommitmentRoutes);
app.use('/coin', ftCommitmentRoutes);
app.use('/ft', ftRoutes);
app.use('/nft', nftRoutes);
app.use('/user', userRoutes);
app.use('/shield', shieldRoutes);

// handle bad calls
function badCalls (req, res) {
  res.status(404).send({ url: `${req.originalUrl  } not found` });
}
app.use(badCalls);
// error handler
function errorHandler (err, req){
  logger.error(
    `${req.method}:${req.url}
      ${JSON.stringify({ error: err.message })}
      ${JSON.stringify({ body: req.body })}
      ${JSON.stringify({ params: req.params })}
      ${JSON.stringify({ query: req.query })}
    `,
  );
}

app.use(errorHandler);

// handle unhandled promise rejects
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

function serverListener () {
  logger.info('API-Gateway API server running on port 80');
}
const server = app.listen(80, '0.0.0.0', serverListener);

server.setTimeout(120*60*1000);