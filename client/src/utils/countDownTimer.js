
const countDownTimer =(countDownTo,callback)=>{
  let timeIntervalID = setInterval(() =>{
    let now = new Date().getTime();

    let duration = new Date(countDownTo).getTime() - now;

    // Time calculations for hours, minutes and seconds
    let days = Math.floor(duration / (1000 * 60 * 60 * 24)) || 0;
    let hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) || 0;
    let minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)) || 0;
    let seconds = Math.floor((duration % (1000 * 60)) / 1000) || 0;

    //Just some formatting
    days = days.toString().padStart(2, '0');
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2,'0');

    if(duration < 0){ 
      clearInterval(timeIntervalID);
      days="00"
      hours="00"
      minutes="00"
      seconds="00"
    };
    callback(days,hours,minutes,seconds);

  }, 1000);
  
  return timeIntervalID;
};
export default countDownTimer;
