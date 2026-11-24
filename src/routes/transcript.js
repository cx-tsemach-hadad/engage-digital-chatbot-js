/**
 * download a saved conversation transcript by name
 */

import fs from 'fs'
import path from 'path'

const DEFAULT_TRANSCRIPTS_DIR = path.join(process.cwd(), 'transcripts')

export default (req, res) => {
  const transcriptsDir = process.env.RINGCENTRAL_ENGAGE_TRANSCRIPTS_DIR || DEFAULT_TRANSCRIPTS_DIR
  const baseDir = path.resolve(transcriptsDir)
  const filePath = path.resolve(baseDir, req.params.name)
  if (!filePath.startsWith(baseDir + path.sep)) {
    return res.status(404).send('transcript not found')
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(404).send('transcript not found')
    }
    res.type('text/plain').send(data)
  })
}
