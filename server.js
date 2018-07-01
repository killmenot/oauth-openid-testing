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
  });
});

app.get('/cicauth/realms/NHS/protocol/openid-connect/auth', (req, res) => {
  res.redirect(`${req.query.redirect_uri}?code=mzgybGPAr4tGi9fd`)
});

app.post('/cicauth/realms/NHS/protocol/openid-connect/token', (req, res) => {
  const iat = (new Date).getTime() / 1000;
  const exp = iat + 36000;

  const data = {
    nhsNumber: '943-476-5919',
    email: 'john.doe@example.org',
    iss: 'https://oauth-openid-testing.herokuapp.com/cicauth/realms/NHS',
    sub: '24400320',
    aud: 's6BhdRkqt3',
    exp: exp,
    iat: iat
  };

  res.json({
    session_state: uuidv4(),
    id_token: jwt.encode(data, process.env.PRIVATE_KEY, 'RS256')
  });
});

app.get('/cicauth/realms/NHS/protocol/openid-connect/certs', (req, res) => {
  res.json({
    'keys': [
      {
        kty: 'RSA',
        n: 'ixQRUnC2CzsdLlRd-Rzg_krBZ3buUiF5cR8hhFuanFqOo1HutBPP9oSLNu6Ef8kdgno-zjy824k-wMaTwUGebwz3Eh8G8Aqmc_NuQqvyoghJrLNiHaqhmU28KhRJfQbj7ZcPACPZWtWxa1U5QN8TT--3whQUhbpSg9j6XD-TS-U',
        e: 'AQAB'
      }
    ]
  });
});

app.get('/cicauth/realms/NHS/protocol/openid-connect/logout', (req, res) => {
  const data = {};
  res.json(data);
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.info('Express server listening on port ' + server.address().port);
});
