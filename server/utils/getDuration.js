
// Test duration
exports.getDuration =(duration) => {

  // Accounting for decimal times;
  let numHrs, numMins;
  const mod = duration % 1;
  numMins = mod * 60;
  numHrs = duration - mod;

  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const date = new Date().getDate();
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const seconds = new Date().getSeconds();

  return parseInt(new Date( year, month, date, hour + numHrs, minute + numMins, seconds ).getTime() );
}

/** calculates time taken to complete a test session */
exports.getTimeToComplete=(duration_hrs, duration_Millis)=>{

  let totalTestTime = duration_hrs * 60 //converting total test time from hrs to mins

  let testDurationInMillis = ( new Date(duration_Millis).getTime() ) - ( new Date().getTime() - 500 ); //-500 accts for anytime lost in http req 

  let testDurationInMins = testDurationInMillis / 60000

  let timeToComplete =  totalTestTime - testDurationInMins;

  return timeToComplete
}