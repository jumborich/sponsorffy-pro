import { fetchUserSuccess } from "../../redux/user/UserAction";
/**
* Exposes methods needed for updating test state 
*/
class StateActions {
  constructor(user,dispatch, navigate){
    this.user = user;
    this.dispatch = dispatch;
    this.navigate = navigate;
  };

  testTypes = ['reading','writing','listening','speaking'];

  onPrevious(currentType,setCurrentType, setActivePage){
    // 1) Don't execute if the first type is READING
    if(currentType === 'reading') return;

    // 2) Get index of the current test type in testTypes array above
    let index = this.testTypes.indexOf(currentType);

    // 3) Get the prev test type 
    let prevType  = this.testTypes[index - 1];

    // 4) Set Active page to default Two for navigating to reading
    // currentType === "writing" && this.dispatch(setActivePage('two'));
    this.dispatch(setActivePage('two'));

    // 5) set previous/current page
    this.dispatch(setCurrentType(prevType))
  };

  onNext(currentType,setCurrentType, setActivePage){
    // 1) Don't execute if the last type is SPEAKING
    if(currentType === 'speaking') return;

    // 2) Get index of the current test type in testTypes array above
    let index = this.testTypes.indexOf(currentType);

    // 3) Get the next/Prev test type
    let nextType  = this.testTypes[index + 1];
    
    // 4) Set Active page to One
    this.dispatch(setActivePage('one'))

    // 5) Set next/current type test type
    this.dispatch(setCurrentType(nextType))
  };

  // Sets the values of the input tags/tags that have been replaced with regex: MAKE SURE TO GIVE TAGS to be REPLACED AN ID
  setDefaultValues(task,taskType){
    task && task.length && document.querySelectorAll(".question-description").forEach((tag, i)=>{
      if(tag.id){
        let input = tag.querySelector("input");
        let type = input && tag.querySelector("input").type;

        if(input && type){
          //1) For TEXT inputs
          if(type==="text" && task[(tag.id*1)-1])input.value=task[(tag.id*1)-1].answer

          // 2) For RADIO inputs
          if(type==="radio" && task[(input.className*1)-1]){
            if(task[(input.className*1)-1].answer.toLowerCase() === input.value.toLowerCase()){
              input.checked=true;
            }
          }
        }
    
        // 3) For SELECT tags
        if(tag.nodeName==="SELECT" && task[(tag.id*1)-1]){
          tag.value=task[(tag.id*1)-1].answer? task[(tag.id*1)-1].answer:"select";
          
          // 3-i) For One_On_One speaking task
          if(taskType && taskType === "speaking_ans_2"){
            tag.value=task[(tag.id*1)-1].answer.option? task[(tag.id*1)-1].answer.option:"pick response";
          }
        }
      }
    });
  }

  onTestSubmit(shouldSubmit){
    
    if(shouldSubmit){
      // Navigate to test marking page
      this.navigate("/test/marktest",{replace: true,state:{...this.user.testSession}});

      // Remove testSession from client side
      this.dispatch(fetchUserSuccess({...this.user, testSession:{}}));
    }
  }

  // Displays submit testModal options
  testModalOpts(){
    return{
      header:"Confirm Test Submission", //Text to display as the header of modal
      subHeader:"Are you sure you want to submit test?", //Text to display as sub-header of Modal
      choice:["Cancel","Yes Submit"], //Users options to choose from
      choiceParams:[false,true], //Parameters to be passed to functions of the users choice option
      callback:(value, closeModal)=>{
        closeModal();
        this.onTestSubmit(value)
      }
    }
  }
}

export default StateActions;