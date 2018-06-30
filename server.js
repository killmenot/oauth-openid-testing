'use strict';

const express = require('express');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');

const app = express();
const baseUrl = 'https://oauth-openid-testing.herokuapp.com';
const strip = (str) => str.split('\n').filter(x => x && !x.startsWith('-----')).join('')

app.get('/healthcheck', (req, res) => {
  res.json({
    ok: true,
    timestamp: (new Date()).getTime()
  })
});

app.get('/favicon.ico', (req, res) => {
  res.status(204)
});

app.get('/cicauth/realms/NHS', (req, res) => {
  res.json({
    'realm': 'NHS',
    'public_key': strip(process.env.PUBLIC_KEY || ''),
    'token-service': `${baseUrl}/cicauth/realms/NHS/protocol/openid-connect`,
    'account-service': `${baseUrl}/cicauth/realms/NHS/account`,
    'admin-api': `${baseUrl}/cicauth/admin`,
    'tokens-not-before': 0
  })
});

app.get('/cicauth/realms/NHS/protocol/openid-connect/auth', (req, res) => {
  res.redirect(`${req.query.redirect_uri}?code=mzgybGPAr4tGi9fd`)
});

app.post('/cicauth/realms/NHS/protocol/openid-connect/token', (req, res) => {
  const data = {
    nhsNumber: '943-476-5919',
    email: 'john.doe@example.org',
    iss: 'https://oauth-openid-testing.herokuapp.com/',
    iat: 1530107787,
    exp: 1530143787
  };

  res.json({
    session_state: uuidv4(),
    id_token: jwt.encode(data, process.env.PRIVATE_KEY, 'RS256')
  });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.info('Express server listening on port ' + server.address().port);
});
