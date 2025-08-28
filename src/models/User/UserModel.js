import UserSchema from "./UserSchema.js";

//Insert new user
export const createNewUser = (userObj) => {
  return UserSchema(userObj).save();
};
export const updateUser = (filter, updateObj) => {
  return UserSchema.findOneAndUpdate(filter, updateObj, { new: true });
};
export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};
export const getOneUser = (filter) => {
  return UserSchema.findOne(filter);
};
export const getUserById = (userId) => {
  return UserSchema.findById(userId);
};
export const findByIdAndDelete = (userId) => {
  return UserSchema.findByIdAndDelete(userId);
};
