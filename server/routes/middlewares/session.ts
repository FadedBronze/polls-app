import express from "express"

function session(req: express.Request, res: express.Response, next: express.NextFunction) {
  console.log("session unimplemented") 
  next()
}

export {session}