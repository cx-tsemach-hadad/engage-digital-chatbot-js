
import express from 'express'
import bodyParser from 'body-parser'
import initWebhook from './routes/webhook'
import verify from './routes/verify'
import transcript from './routes/transcript'
import morgan from 'morgan'

const app = express()
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/test', (req, res) => res.send('server running'))
app.get('/rc/transcripts/:name', transcript)

export const initApp = (conf) => {
  app.get('/rc/webhook', verify)
  app.post('/rc/webhook', initWebhook(conf))
  /* istanbul ignore next */
  for (const skill of conf.skills || []) {
    if (skill.appExtend) {
      skill.appExtend(app)
    }
  }
  return app
}
