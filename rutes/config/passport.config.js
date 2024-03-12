import passport from "passport";
import github from "passport-github2";
import User from "../../dao/db/models/user.model.js";

export const initPassport = () =>{
    passport.use("github", new github.Strategy(
        {
            clientID: "Iv1.6ffe7901f4be7bb0",
            clientSecret: "068a53684f5d32a2a6f52c4e27ea51947638660f",
            callbackURL: "http://localhost:8080/api/view/perfil"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};


