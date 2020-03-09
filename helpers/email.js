"use strict";
const   nodemailer  = require('nodemailer'),
        conf        = require('../credentials/email');

async function send( message ){
  let transporter = nodemailer.createTransport( conf );
  let info = await transporter.sendMail( message );
  return info.messageId
}
module.exports = { send }