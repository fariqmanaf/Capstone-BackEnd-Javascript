const User = require('../models/user');
const { get } = require('../routes');
const UserValidations = require('../validations/user');


module.exports = {
    getProfile: async (req, res, next) => {
        try {
            await UserValidations.getprofile(req.params);
            const user = await User.profile(req.params.email);

            return res.status(200).json({
                status : "Succes",
                statusCode : 200,
                message : "Data pengguna berhasil didapatkan",
                data : user
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    changePassword : async (req, res, next) => {
        try{
            // await UserValidations.getProfile(req.params);
            // const userProfile = await User.profile(req.params.email);

            const user = req.user;
            return res.status(200).json({
                status : "Succes",
                statusCode : 200,
                message : "Data pengguna berhasil didapatkan",
                data : user
            });
            
        } catch (err){
            console.log(err, "ini error di di controller");
        }
    }
}