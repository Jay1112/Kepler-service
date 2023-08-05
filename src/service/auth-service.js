const userModal = require('../models/users');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const status = require('../enums/status-code-types');
const mailServiceObj = require('../service/mail-service');

class AuthService {
    
    saltRounds = 10 ;

    async encryptPassword(str){
        try{
            const password = await bcrypt.hash(str,this.saltRounds);
            return password;
        }catch(err){
            return null;
        }
    }

    async isUserExist(email){
        const result = await userModal.find({ email });
        if(Array.isArray(result) && result.length === 1){
            return true;
        }
        return false;
    }

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
            password
        };

        try{
            const result = await userModal.create(newUser);
            const data = {
                otp : 111299,
                email : result?.email
            }
            const mailResponse = await mailServiceObj.composeMail(data);
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
}

const authService = new AuthService();

module.exports = authService ; 