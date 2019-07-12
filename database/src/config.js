/**
@module config.js
@author Liju Jose
@desc constants used by a nubmer of other modules
*/

let env = 'local'; // set the environment to local if not mentioned while starting the app
const props = {
  local: {
    app: {
      host: 'http://database',
      port: '80',
    },
    mongo: {
      host: 'mongo',
      port: '27017',
      databaseName: 'nightfall',
      admin: 'admin',
      adminPassword: 'admin',
    },
    isLoggerEnable: true,
  },
};

/**
 * Set the environment
 * @param { string } environment - environment of app
 */
export function setEnv (environment) {
  if (props[environment]) {
    env = environment;
  }
}

/**
 * get the appropriate environment config
 */
export const getProps = () => props[env];
