const jwt = require('jsonwebtoken');

// Usually you want this in .env file though:
const secret = 'MyAppJWTSecretShh';
const expiration = '2h';

module.exports = {
  authMiddleware: function(req,res,next) {
    // Allows token to be sent via req.body, req.query, or headers. Respectively:
    // body: JSON.stringify({token:...})
    // URL?token=..
    // headers: { "Authorization": "Bearer ..."}
    let token = req?.body?.token || req?.query?.token || req?.headers?.authorization;

    // If not working, uncomment to help debug if your fetch is valid
    // console.log({req_body:req?.body})
    // console.log({req_query:req?.query})
    // console.log({req_headers:req?.headers})

    // By splitting authorization header into an array and popping, you get the right most value which is the token.
    // ["Bearer", "<tokenvalue>"]
    if (req?.headers?.authorization) {
      token = req.headers.authorization.split(' ').pop().trim();
    }

    try {
      // Decrypt back the original object about the user entity that was encrypted with signToken
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // Then merge the user entity object with req.user. At the route, you will verify this object is not undefined to prove authorization
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    next();
  },
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};
