import express from "express";

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World! Copied from https://developer.okta.com/blog/2018/11/15/node-express-typescript')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}.`)
})