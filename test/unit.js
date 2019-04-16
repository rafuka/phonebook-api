const jwt = require('jsonwebtoken');
const auth = require('../api/middleware/auth');
const assert = require('assert');

const testData = {
  data: "some data"
};
const token = jwt.sign(testData , process.env.JWT_KEY);

let req = {
  headers: {
    authorization: `Bearer ${token}`
  }
}

function nextFunc(err) {
  if (err) return "Error";
  return "Next func called";
}

describe('Test auth middleware', () => {
  it("Should return next function without error", () => {
    let result = auth(req, null, nextFunc);
    assert.equal(result, "Next func called");
  });
  
  it("Should append the userData object to the req object", () => {
    auth(req, null, nextFunc);
    assert.equal(req.userData.data, testData.data);
  });

  it("Should return next function with an error", () => {
    let result = auth(null, null, nextFunc);
    assert.equal(result, "Error");
  })
})









