
// The user items to send back to client on user requests
module.exports = modifiedUser =(user) =>{
  user.__v = undefined;
  user.createdAt = undefined;
  user.active = undefined;
  user.passwordChangedAt = undefined;
  return user;
};