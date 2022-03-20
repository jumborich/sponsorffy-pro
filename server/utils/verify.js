
const AppError = require("./appError");
/**
 * Checks if the user still has enough coins and
 * returns true or throws error based on the findings
 */

const canContest = (req, next) =>{
  const { coins } = req.user;

  // Deduct 5 coins for this action. Can depend on the category
  if(coins >= 5) return true;

  // If not enough coins
  return next(
    new AppError(
      "Insufficient coin balance! To continue, buy coins.",
      401
    )
  );
};

/** Updates a user's coin account balance by deducting 5 */
const updateBalance = (req) => req.user.coins - 5;

module.exports = { canContest , updateBalance}