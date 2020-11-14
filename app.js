import express from 'express'
import bodyParser from 'body-parser'


import {
  UserRouter,
  FollowingRouter
} from './routers'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, OPTIONS, PATCH'
  );
  next();
});

app.use('/user', UserRouter)
app.use('/following', FollowingRouter)

app.use(function(req, res, next){
  return res.status(404).json({ message: 'page does not exist' });
});

app.use(function(err, req, res, next){
  return res.status(500).json({ message: 'Something broke!' });
});

module.exports = app