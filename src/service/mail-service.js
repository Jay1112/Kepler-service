const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); 
const Mailgen = require('mailgen');

dotenv.config();

class MailService {
    transporter = null; 
    gmail = null ; 
    password = null ;
    
    constructor(gmail,password){
        this.gmail = gmail;
        this.password = password ;
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: gmail,
              pass: password
          }
      });
    }

    async composeMail(data){
      try{
        let MailGenerator = new Mailgen({
          theme : 'default',
          product : {
            name : 'UnoTracker',
            link : 'https://react-verse-maso.netlify.app/'
          }
        });

        let response = {
          body : {
            intro : `Your OTP : ${data?.otp}`
          }
        }

        let mail = MailGenerator.generate(response);

        const packetData = {
          from: `${this.gmail}`, 
          to: data?.email, 
          subject: "Verification Mail", 
          html: mail, 
        };

        const mailResponse = await this.transporter.sendMail(packetData);
        return mailResponse ;
      }catch(err){
        return null;
      }
    }
}
const gmail       = process.env.GMAIL ;
const password    = process.env.PASSWORD ;
const mailServiceObj = new MailService(gmail,password);

module.exports = mailServiceObj ; 