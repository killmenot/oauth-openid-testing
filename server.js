'use strict';

const express = require('express');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');

const app = express();
const jwtSecret = 'foobar';

app.get('/healthcheck', (req, res) =>
  res.json({
    ok: true,
    timestamp: (new Date()).getTime()
  })
);

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/cicauth/realms/NHS/protocol/openid-connect/auth', (req, res) => res.redirect(`${req.query.redirect_uri}?code=mzgybGPAr4tGi9fd`));

app.post('/cicauth/realms/NHS/protocol/openid-connect/token', (req, res) => {
  const data = {
    nhsNumber: '943-476-5919',
    email: 'john.doe@example.org',
    iss: 'https://xxx.dev1.signin.nhs.uk/',
    iat: 1530107787,
    exp: 1530143787
  };

  res.json({
    session_state: uuidv4(),
    id_token: jwt.encode(data, jwtSecret)
  });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.info('Express server listening on port ' + server.address().port);
});
