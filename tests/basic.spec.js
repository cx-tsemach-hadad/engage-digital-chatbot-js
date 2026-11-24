/* eslint-env jest */

import pack from '../package.json'
// import axios from 'axios'
import { initApp } from '../src/app'
import * as config from '../example-bots/auto-reply-all'
import request from 'supertest'
import fs from 'fs'
import os from 'os'
import path from 'path'

require('dotenv').config()

const app = initApp(config)

const {
  RINGCENTRAL_ENGAGE_VERIFY_TOKEN
} = process.env

jest.setTimeout(99999)

describe(pack.name, () => {
  it('verify should work', async () => {
    const c = '1'
    const res = await request(app)
      .get(`/rc/webhook?hub.mode=subscribe&hub.challenge=${c}&hub.verify_token=${RINGCENTRAL_ENGAGE_VERIFY_TOKEN}`)
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual(c)
  })
  it('webhook with empty data', async () => {
    const res = await request(app)
      .post('/rc/webhook')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual('no events')
  })
  // it('webhook with empty data', async () => {
  //   const em = 'x@c.com'
  //   const res = await request(app)
  //     .post(`/rc/webhook`)
  //     .send({
  //       events: [
  //         {
  //           resource: {
  //             id: 'a',
  //             metadata: {
  //               author_id: 'aa1',
  //               from: em
  //             }
  //           }
  //         }
  //       ]
  //     })
  //   expect(res.statusCode).toEqual(200)
  //   expect(res.body.to[0]).toEqual(em)
  // })
  it('test should work', async () => {
    const res = await request(app)
      .get('/test')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual('server running')
  })
  it('transcript download should return file content', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'transcripts-'))
    fs.writeFileSync(path.join(dir, 'chat-1.txt'), 'hello from the chat')
    process.env.RINGCENTRAL_ENGAGE_TRANSCRIPTS_DIR = dir
    const res = await request(app)
      .get('/rc/transcripts/chat-1.txt')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual('hello from the chat')
  })
  it('transcript download should return 404 for missing file', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'transcripts-'))
    process.env.RINGCENTRAL_ENGAGE_TRANSCRIPTS_DIR = dir
    const res = await request(app)
      .get('/rc/transcripts/missing.txt')
    expect(res.statusCode).toEqual(404)
  })
})
