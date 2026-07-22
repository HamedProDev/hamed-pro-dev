const { onRequest } = require('firebase-functions/v2/https')
const next = require('next')

const app = next({
  dev: false,
  dir: '..',
  conf: {
    distDir: '.next',
  },
})

const handle = app.getRequestHandler()

app.prepare().then(() => {})

exports.nextjs = onRequest(
  {
    cpu: 1,
    memory: '512MiB',
    minInstances: 0,
    maxInstances: 10,
  },
  (req, res) => {
    return handle(req, res)
  }
)
