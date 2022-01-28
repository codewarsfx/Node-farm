const jwt = require('jsonwebtoken')

const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const UserModel = require('../Models/userModel')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')

//private function to sign JWTs
const signJWT = (id) => jwt.sign({id},process.env.SIGNATURE,{
        expiresIn:process.env.EXPIRY_DATE
    })


//signup functionality
exports.signup = asyncErrorCatcher(async (req,res)=>{
    const userData = await UserModel.create(req.body)
    
    const  jwtToken = await signJWT(userData._id)
    res.status(201).json({
        message:"success",
        userData,
        jwtToken
    })
    
})








// login functionality
exports.login = asyncErrorCatcher( async (req,res,next)=>{
    const {email, password} = req.body
    // check if there is an email and password 
    if(!email || !password) return next(new AppError("please include an email and password",401));
    //find the user with that email and confirm the password is the same as
    const userWithEmail = await UserModel.findOne({email}).select('+password')
    const passwordCorrect = await userWithEmail.comparePasswords(password,userWithEmail.password)

    if(!userWithEmail || !passwordCorrect)return next(new AppError('you have entered an incorrect email or password ',401));
    const jwtToken  = await signJWT(userWithEmail._id)
    //if the password isnt correct return error .if it is send a jwt token to the client 
    res.status(200).json({message:'success',jwtToken})
})












//in order to protect access to certain routes there'd be some kind of protection mechanism to grant access to only protected users.
exports.protect = asyncErrorCatcher(async (req,res,next)=>{
    // the protection algorithm is as follows
   
    
    // 1. check if the token exists in the request header
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) return next(new AppError('Please login to receive authorization token',401));
    
    const token = req.headers.authorization.split(' ')[1]
    
    //2. verify the token and get it's payload. two kind of errors can occur in the verification stage
    const jwtTokenPayload = await jwt.verify(token,process.env.SIGNATURE)
    
    // 1. the token is expired. the next is that the token's payload has been tampered with since the last time it was signed 
    
    // After verifying the token check that the user with that token still exist in your database
    const currentUser = await UserModel.findById(jwtTokenPayload.id)
    if(!currentUser) return next(new AppError('Sorry User with that token  doesnt exist please create an account',401))
    
    
    //lastly confirm that the user passw3ord hasnt changed since the token was issued 
    
    if(currentUser.checkPasswordUpdate(jwtTokenPayload.iat)) return next(new AppError('User modified this password already',401))
    
    req.user = currentUser
    
    next()
    
})







// this function gives users the ability to perform  certain actions based on the role they posses 
exports.authorizeUser =([...user])=>((req,res,next)=>{
    const {role} = req.user
    console.log(user)
    if(!user.includes(role)){
        return next(new AppError('User is not Authorized to perform such an action',401)) 
    }
    next()
})






exports.forgotPassword = asyncErrorCatcher( async (req,res,next) => {
    const {email} = req.body
    
    const userWithEmail = await UserModel.findOne({email})
    if(!userWithEmail) return next(new AppError('Sorry No user with that email exist, please create an account',404))
    
   const userToken = userWithEmail.generateResetToken()
   await userWithEmail.save({validateBeforeSave:false})
   
   const resetPasswordUrl = `${req.protocol}://${req.get('host')}/app/vi/users/${userToken}`
   
   try {
       await sendEmail({
       email:req.body.email,
       subject:`Password request token for ${req.body.email}`,
       message:`Please click on the link ${resetPasswordUrl} to reset your password. The reset token expires in 10 minutes`
   })
   
   res.status(200).json({
       "message":"Password reset token sent"
   })
   }
   catch(error){
       next(new AppError('An error occured in sending the password reset mail',500))
       userWithEmail.resetToken= undefined
       userWithEmail.resetTokenExpires = undefined
       
       userWithEmail({
           validateBeforeSave: false
       })
   }
   
})   