const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const userModel = require('./models/user.model');


passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    function (username, password, cb) {
        return userModel.getByUsername(username)
            .then((data) => {
                if (data.length > 0) { // đã tồn tại
                    if (password === data[0].password) {
                        return cb(null, { loginUser: data[0] }, { message: 'Logged in successfully', code: 2 });
                    }
                    else {
                        cb(null, false, { message: 'Wrong password', code: 1 });
                    }
                }
                else {
                    return cb(null, false, { message: 'Wrong username', code: 0 });
                }
            })
            .catch((error) => {                
                return cb(error)
            });
    }
));

passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: '1612018_TranQuocAnh',
    },
    function (jwtPayload, cb){              
        return userModel.getByID(jwtPayload.id)
            .then(user=>{                
                return cb(null, user,{message: 'Authorized', code: 1 });
            })
            .catch(err=>{                
                return cb(err, null,{ message: 'Can not authorized', code: 0 });
            });
    }
));
