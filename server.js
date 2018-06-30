'use strict';

const express = require('express');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');

const app = express();
const baseUrl = 'https://oauth-openid-testing.herokuapp.com';
const strip = (str) => str.split('\n').filter(x => x && !x.startsWith('-----')).join('')

process.env.PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\nMIICWwIBAAKBgQCLFBFScLYLOx0uVF35HOD+SsFndu5SIXlxHyGEW5qcWo6jUe60E8/2hIs2\n7oR/yR2Cej7OPLzbiT7AxpPBQZ5vDPcSHwbwCqZz825Cq/KiCEmss2IdqqGZTbwqFEl9BuPt\nlw8AI9la1bFrVTlA3xNP77fCFBSFulKD2PpcP5NL5QIDAQABAoGAa3GXaD8XBFoo0w/ugXNk\nBlAuVgY1W1HtBg1s0VoLedsj8txrMsdTlDkVa9yclDQFDjXuq1mU9W10A23l3Bkbkb/Ad7Fp\n2m/eo0PfCo2D0fI5i4free8CeYRQNm4YWPQADzsUqUq/AM+cPNxa3zals0lkHkGShPnvncC7\n1wUaXAkCQQC843jx94K7eCvj/+MR0V7EYpj609H3bgRzdD+xG1Sx9EV12DEx8cANsPAmsnVD\nwDeXBHBJC7eveF/OpHswzMHHAkEAvH4RACcPk8JF/BBijViCsO3QMRpTSsbjhkmFDDVKrrXl\nx8dqmc1qTv1LF+qJtJn243fjv+Lrm/mKu1u3IE3E8wJASIhZEyFmVDLLN9w1B8yMRYFPGVJp\nmEfo8aS8KHhER6lzWtNP4MviYd+F+HYizYdsUVNlAse7G2hv8dv7ajvWVQJAEp1AgIta9nSR\nBLt5gAvlnCNgE/lNkGzjuzc3dGUu4uIDtx7yYA3xGavZ5pq6zqMFxqDoVOLL8bNLCAWeqAoG\nEQJAR0i/2ZMAskC+zdtGwycM6zRh0OoxCQLB3aPEGg5m/plkanmc3oDOWo3oMdatX0BOE3Ya\ndmxMPlc6sS1Y9pQ3LA==\n-----END RSA PRIVATE KEY-----\n'

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
    'iss': 'https://oauth-openid-testing.herokuapp.com/',
     'sub': '24400320',
     'aud': 's6BhdRkqt3',
     'exp': 1311281970,
     'iat': 1311280970
  };

  res.json({
    session_state: uuidv4(),
    id_token: jwt.encode(data, process.env.PRIVATE_KEY, 'RS256')
  });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.info('Express server listening on port ' + server.address().port);
});
