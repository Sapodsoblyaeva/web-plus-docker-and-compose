const dotenv = require("dotenv")

dotenv.config({path: "../.env.deploy"})

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REP, DEPLOY_REF
} = process.env;

module.exports = {
  apps : [{
    name   : "kpd-BE",
    script : "dist/main.js"
  }],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REP,
      path: `${DEPLOY_PATH}`,
      // 'pre-deploy-local': `bash scripts/deployEnv.sh ${DEPLOY_USER}@${DEPLOY_HOST} ${DEPLOY_PATH}`,
      // 'post-deploy': 'cd backend && pwd && npm i && npm run build && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },

}
