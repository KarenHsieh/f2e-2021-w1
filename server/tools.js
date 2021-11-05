const axios = require("axios");
const jsSHA = require("jssha");
const ptx = require("./ptx");

const getAuthorizationHeader = function () {
  var AppID = ptx.AppID;
  var AppKey = ptx.AppKey;

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  var HMAC = ShaObj.getHMAC("B64");
  var Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';

  return { 
    "Authorization": Authorization,
    "X-Date": GMTString,
    "Accept-Encoding": "gzip",
  };
};

exports.axiosCall = (options) => {
  const { method, url, data } = options;
  switch (method) {
    case "POST":
      return axios({
        method: "POST",
        url: url,
        timeout: 30 * 1000,
        data: data,
        headers: getAuthorizationHeader(),
      })
        .then((response) => {
          // if(response.status === 200) {}
          return response
        })

    case "GET":
    default:
      return axios({
        method: "GET",
        url: url,
        timeout: 30 * 1000,
        headers: getAuthorizationHeader(),
      })
        .then((response) => {
          // if(response.status === 200) {}
          return response
        })

  }
};
