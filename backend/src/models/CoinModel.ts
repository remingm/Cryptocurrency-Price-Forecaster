import mongoose, { Number, Schema } from "mongoose";

// const UserSchema: Schema = new Schema({
//     email: { type: String, required: true, unique: true },
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true }
// });


export interface ICoin extends Document {
    symbol: string,
    past: [{
        timestamp: string,
        close: number
    }],
    prediction: [{
        timestamp: string,
        close: number
    }],
    period: string,
    MAPE: number
}

const CoinSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    past: [{
        timestamp: { type: String, required: true },
        close: { type: Number, required: true }
    }],
    prediction: [{
        timestamp: { type: String, required: true },
        close: { type: Number, required: true }
    }],
    period: { type: String, required: true },
    MAPE: { type: Number, required: true }
});

const Coin = mongoose.model<ICoin>("Coin", CoinSchema);
export default Coin;

// class TimePrice {
//   time: string;
//   price: string;
// }

// class TimePrices {
//     timePrice: TimePrice[]
// }

// class CoinSchema {
//   symbol: string;
//   past: TimePrice[];
//   prediction: TimePrice[];
//   period: string;
//   MAPE: string;
// };


// export interface TimePrice {
//     time: string;
//     price: string;
// }

// export interface PriceSeries {
//     close: TimePrice[];
// }

// export default class Coin {
//     symbol: string;
//     past: PriceSeries;
//     prediction: PriceSeries;
//     period: string;
//     MAPE: string;
// }



// }

// const Coin = getModelForClass(CoinSchema)

// export const Coin = getModelForClass(CoinSchema);

// const CoinSchema = new Schema<Coin>(
//     {
//         symbol: { type: String, required: true },
//         past:
//             {
//                 close: [{time: String, price: Number}]
//             },
//         prediction:
//             {
//                 close: [{time: String, price: Number}]
//             },
//         period: { type: String, required: true },
//         MAPE: String,
//     }
// )

// const userSchema = new mongoose.Schema<UserDocument>(
//     {
//         email: { type: String, unique: true },
//         password: String,
//         passwordResetToken: String,
//         passwordResetExpires: Date,

//         facebook: String,
//         twitter: String,
//         google: String,
//         tokens: Array,

//         profile: {
//             name: String,
//             gender: String,
//             location: String,
//             website: String,
//             picture: String,
//         },
//     },
//     { timestamps: true }
// );

// /**
//  * Password hash middleware.
//  */
// userSchema.pre("save", function save(next) {
//     const user = this as UserDocument;
//     if (!user.isModified("password")) {
//         return next();
//     }
//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) {
//             return next(err);
//         }
//         bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
//             if (err) {
//                 return next(err);
//             }
//             user.password = hash;
//             next();
//         });
//     });
// });

// const comparePassword: comparePasswordFunction = function (
//     candidatePassword,
//     cb
// ) {
//     bcrypt.compare(
//         candidatePassword,
//         this.password,
//         (err: mongoose.Error, isMatch: boolean) => {
//             cb(err, isMatch);
//         }
//     );
// };

// userSchema.methods.comparePassword = comparePassword;

// /**
//  * Helper method for getting user's gravatar.
//  */
// userSchema.methods.gravatar = function (size: number = 200) {
//     if (!this.email) {
//         return `https://gravatar.com/avatar/?s=${size}&d=retro`;
//     }
//     const md5 = crypto.createHash("md5").update(this.email).digest("hex");
//     return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
// };
