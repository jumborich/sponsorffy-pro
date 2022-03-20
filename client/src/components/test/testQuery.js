import _useAxios from "../../utils/_useAxios";
import ProfileActions from "../../redux/profile/action";
import {fetchUserSuccess} from "../../redux/user/UserAction";

/**
 * Exposes methods for querying DB for tests
 */
class TestQuery{
  constructor(user, dispatch, navigate){
    this.user = user;
    this.dispatch = dispatch;
    this.navigate = navigate;
  };

  // Gets a new test for user to take/on refresh gets back same test
  getNewTest(setQuestions){
    const { testSession } = this.user;

    const testMode = localStorage.getItem("testMode") || "";

    let params={testMode}; //Only need this on initial request

    if(testSession.testId){
      params={
        testId:testSession.testId
      };
    }

    _useAxios("GET",params,"tests/getNewTest").then(res =>{
      if(res.data){
        // 1)Sets the questions to be used in each component
        // const { test } = res.data;
        const {test, candidateId, duration, duration_Millis} = res.data;

        setQuestions(test);

        //2) Update user in redux to get latest testSession on Init of new test
        if(!testSession.testId) new ProfileActions(this.dispatch).getMe();
      }
    }).catch(err =>console.log(err));
  };

  // Saves user's answers to DB
  saveAnswers(type,task,answers){
    const{ userOwnTestId } = this.user.testSession;

    // 1) For all non-audio/speaking questions
    let data = { userOwnTestId, type, task, answers }

    // 2) For questions requiring user voice inputs
    if(type==="speaking_ans"){
      data = new FormData() //It uses the same format a form would use if the encoding type were set to "multipart/form-data".
      data.append("userOwnTestId",userOwnTestId); //user's currently created test
      data.append("type",type);
      data.append("task",task);
      data.append("answers",JSON.stringify(answers));
      answers.forEach((answerItem,index)=>{
        if(answerItem.answer.blob){
          data.append("audioBlob",answerItem.answer.blob,`Q${answerItem.question_num}`);
        }
      })
    };

    // 3) make axios request to server for form upload
    _useAxios("PATCH",data,"tests/updateTest")
    .then((response) => {})
    .catch((error) => console.log(error));
  }

  getUserSavedAnsDB(setAnswers){
    const { testId, candidateId } = this.user.testSession;
    const params={ testId, creatorId:this.user._id, candidateId }
    
    _useAxios("GET",params,"tests/getUserSavedAns")
    .then((response)=>{
      const{ test }= response.data;

      // update user's answers in redux
      this.dispatch(setAnswers(test, false));
      
      // update testSession with userOwnTestId
      this.dispatch(
        fetchUserSuccess({
          ...this.user, 
          testSession:{
            ...this.user.testSession, 
            userOwnTestId:test._id
          }
        })
      )
      
    }).catch((error) => console.log(error));
  }
};

export default TestQuery;