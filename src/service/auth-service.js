const userModal = require('../models/users');
const otpModal  = require('../models/otp');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const status = require('../enums/status-code-types');
const mailServiceObj = require('../service/mail-service');

class AuthService {
    
    saltRounds = 10 ;
    startOTP = 100000 ;
    endOTP = 999999 ;

    // password encryption
    async encryptPassword(str){
        try{
            const password = await bcrypt.hash(str,this.saltRounds);
            return password;
        }catch(err){
            return null;
        }
    }

    // user in database check
    async isUserExist(email){
        const result = await userModal.find({ email });
        if(Array.isArray(result) && result.length === 1){
            return true;
        }
        return false;
    }

    // user is verified or not check
    async isUserVerified(user_id){
        const result = await userModal.find({ user_id });
        if(Array.isArray(result) &&  result.length > 0 && result[0]?.verified){
            return true;
        }
        return false;
    }

    // save OTP in DB
    async saveOtpInDB(otp,user_id){
        try{
            await otpModal.create({ otp, user_id });
            return true;
        }catch(err){
            return false;
        }
    }

    //   create new user
    async createNewUser(user){
        if(!user?.name || !user?.email || !user?.password){
            return {
                success : false,
                message : 'field missing : name, email or password'
            };
        }
        const user_id = uuidv4();
        const password = await this.encryptPassword(user?.password);
        if(!password){
            return {
                success : false,
                message : 'password encryption error'
            };
        }

        const newUser = {
            ...user,
            user_id,
            password,
            verified : false
        };

        try{
            const result = await userModal.create(newUser);
            const otp = Math.floor(Math.random() * (this.endOTP - this.startOTP + 1)) + this.startOTP;
            const data = {
                otp,
                email : result?.email
            }

            // send mail to user email
            const mailResponse = await mailServiceObj.composeMail(data);
            // save otp in database
            const isOTPsavedInDB = await this.saveOtpInDB(data?.otp,result?.user_id);

            return {
                success : true,
                message : 'User Created Successfully',
                data : result
            };
        }catch(err){
            return {
                success : false,
                message : 'User Creation Failed',
                data : null
            };
        }
    }

    // get user otp from db
    async  getOTPforUser(user_id){
        const result = await otpModal.find({ user_id });
        if(Array.isArray(result) && result.length > 0){
            return result[0]?.otp;
        }
        return null;
    }

    // account verification
    async doVerification(user_id,otp){
        if(!user_id || !otp){
            return {
                success : false,
                message : 'field missing : user_id or OTP'
            };
        }

        const stored_otp = await this.getOTPforUser(user_id);

        if(Number(stored_otp) === otp){
            // update status of an user in db as verified
            try{
                const result = await userModal.findOneAndUpdate({ user_id },{ verified : true });
                return {
                    success : true,
                    message : 'User Verification Successfully'
                }
            }catch(error){
                return {
                    success : false,
                    message : error.message
                }
            }
        }else{
            return {
                success : false,
                message : `OTP was not matched`
            }
        }
    }
}

const authService = new AuthService();

module.exports = authService ; 