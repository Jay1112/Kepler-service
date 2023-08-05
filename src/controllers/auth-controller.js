const status = require('../enums/status-code-types');
const authService = require('../service/auth-service');
const mailServiceObj = require('../service/mail-service');

class AuthController {
    async doSignUp(req,res){
        const user = {
            name : req.body?.name,
            password : req.body?.password,
            email : req.body?.email
        };

        const isUserExist = await authService.isUserExist(user?.email);

        if(isUserExist){
            res.status(status.OK).json({
                success : false,
                message : 'User is Already exist'
            });
            return ;
        }

        const result = await authService.createNewUser(user);

        if(result?.success){
            res.status(status.OK).json({
                success : true,
                message : result?.message,
            });
        }else{
            res.status(status.BAD_REQUEST).json(result);
        }
    }
}

const authControllerObj = new AuthController();

module.exports = authControllerObj ; 
