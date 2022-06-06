import { model, Schema } from "mongoose";

interface IUser {
    email: string,
    password: string
}


const userScheme = new Schema<IUser>({
    email: { type: "String", required: true },
    password: { type: "String", required: true }
})

const user = model<IUser>("User", userScheme)

export default { user }