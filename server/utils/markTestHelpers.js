const testModel = require("../models/testModel");
const speechToText = require("./speechToText");

/** Sends the marked test to Mongo DB and returns updated to_be_marked*/
const submitMarkedTest = async(testype, totalPoints, userAnswers, to_Be_Marked, totalAnswered)=>{

  // Preparing the marked test object for updating mongoose
  let marked_Test = {
    total_score: to_Be_Marked.total_score + totalPoints,
    totalAnswered: to_Be_Marked.totalAnswered + totalAnswered
  };

  marked_Test[`${testype}_ans`] = {...userAnswers};
  marked_Test[`${testype}_score`] = to_Be_Marked[`${testype}_score`] + totalPoints;
    
  return await testModel.findByIdAndUpdate(to_Be_Marked._id, marked_Test, {new:true}).lean();
};


// Compares user's answer to Sponsorffy's solution and assigns marks if similarity found: READING, WRITING AND LISTENING ONLY.
const compareAnswers = (testTypeLower, userAnswers, marking_scheme) =>{
  let totalMarks = 0, qAnswered = 0;

  if(testTypeLower === "writing"){
    console.log("marking_scheme: ", marking_scheme);
    console.log("userAnswers : ", userAnswers);
  }
  for(let index = 0; index < marking_scheme.length; index++){
    let solution = marking_scheme[index];

    // End comparison if user didn't attempt further questions
    if(!userAnswers[index]) break;

    // Check next soln if current question not attempted
    if(!userAnswers[index].answer) continue;

    // Increase total questions attempted count
    if(testTypeLower !== "writing") qAnswered++;
    
    if(testTypeLower === "writing"){
      console.log(solution.answer.toLowerCase().trim(), ": SOLN-USER: ", userAnswers[index].answer.toLowerCase().trim());
      console.log(solution.answer.toLowerCase().trim()=== userAnswers[index].answer.toLowerCase().trim());

    }

    // Assign && increment marks for correct answers
    if(solution.answer.toLowerCase().trim()=== userAnswers[index].answer.toLowerCase().trim()){
      totalMarks = totalMarks + solution.mark;

      // Modify answer at the index with the mark earned by user
      userAnswers[index]={...userAnswers[index],mark:solution.mark}
    }
  };

  if(testTypeLower === "writing" && userAnswers.length > 1) qAnswered++; //Writing is seen as having only one question

  return { totalMarks, qAnswered}
}

// Marks user's WRITING answers against Sponsorffy's soln.
const writingMarker = (testTypeLower, userAnswers, marking_scheme) =>{
  console.log("..... MARKING WRITING .....")
  let totalMarks = 0;

  // ---------> 1. Writing House-keeping Section <--------- \\
  const { paraCount=0, sentCount=0, paragraphs=[] } = userAnswers[0]; // user's paragraph data
  const { paraCount:pCount, sentCount:sCount } = marking_scheme[0]; // sponsorffy Paragraph data
  const { sentRange, ref, mark } = marking_scheme[0].paragraphs;

  // Mark for right number of total paragraphs used
  if(paraCount >=pCount.range[0] && paraCount <= pCount.range[1]) totalMarks += pCount.mark;

  // Mark for right number of total sentences used
  if(sentCount >=sCount.range[0] && sentCount <= sCount.range[1]) totalMarks += sCount.mark;

  // Mark for right number of sentences used in individual paragraphs
  let sharedMark = 0, pLength = 0;
  if(paraCount >=pCount.range[0] && paraCount <= ref.length){
    sharedMark = mark / paraCount;
    paragraphs.length && paragraphs.forEach(paragraph =>{
      pLength = paragraph.length;
      if(pLength >= sentRange[0] && pLength <= sentRange[1]) totalMarks += sharedMark;
    });

  }else{
    sharedMark = mark / ref.length;
    ref.forEach((p, i)=>{
      pLength = paragraphs[i]?.length;
      if(pLength >= sentRange[0] && pLength <= sentRange[1]) totalMarks += sharedMark;
    })
  };

  // ---------> 2. Writing Progression Section <--------- \\
  const secTwo = compareAnswers(testTypeLower, userAnswers[1], marking_scheme[1]);
  return { totalMarks:totalMarks + secTwo.totalMarks, qAnswered:secTwo.qAnswered}
}

// Marks users' READING, WRITING AND LISTENING answers against Sponsorffy's soln.
const marker = (testTypeLower, userAnswers, marking_scheme )=>{
  
  if(testTypeLower === "writing") return writingMarker(testTypeLower, userAnswers, marking_scheme);
  
  return compareAnswers(testTypeLower, userAnswers, marking_scheme);
}

/** Updates DB with test marks and answers and then returns the updated_To_Be_Marked*/
exports.useMarker = async( testType, to_Be_Marked, marking_scheme )=>{
  let testTypeLower = testType.toLowerCase();
  let answerType = `${testTypeLower}_ans`
  let userAnswers = to_Be_Marked[answerType] //This is an object

  // --------------------------TESTTYPE-TASK-ONE-------------------------
  if(userAnswers.task_1 && userAnswers.task_1.length){

    let { totalMarks, qAnswered } = marker(testTypeLower, userAnswers.task_1, marking_scheme[testType].task_1);
    return await submitMarkedTest(testTypeLower, totalMarks, userAnswers, to_Be_Marked, qAnswered);
  } 
  else return to_Be_Marked;
}

// Converts users audio to text and helps in marking the speaking component of Test.
const markSpeakingHelper = async(taskType, audioUrl, index, solution, userAnswers)=>{
  try{
    // Transcribe user's speech to text and do further processing
    const text =  await speechToText(audioUrl);

    if(!text)return;
      
    //This is the total run up count since words are split and assigned marks
    let totalMarks = 0;

    const userWordsArr = text.trim().toLowerCase().split(" ");
    const solnWords = solution.answer.value.toLowerCase().trim().split(" ");
    const valueMark = taskType === "one_on_one" ? solution.mark.value : solution.mark

    let individual_mark = valueMark / solnWords.length;
    
    for(let i = 0; i < solnWords.length; i++){

      if(!userWordsArr[i]) continue;

      //1) Compare each solution word to the user's transcribed word using their common index
      if(solnWords[i] === userWordsArr[i]){

        // Add the individual mark to total marks: Ind mark = total question mark/solnWord length
        totalMarks += individual_mark;
      }
    }

    // Modify answer at the index with the mark earned by user
    if(taskType === "one_on_one") totalMarks += solution.mark.option //mark for choosing right option
    userAnswers.task_1[index] = {...userAnswers["task_1"][index], mark: totalMarks};

    return totalMarks;
  }
  catch(error){
    console.log("err: ",error)
  }
}

// Marks speaking component of test
exports.markSpeaking = async(to_Be_Marked , marking_scheme)=>{  

  let userAnswers = to_Be_Marked.speaking_ans //This is an object
  let taskAns = userAnswers.task_1, totalPoints = 0, totalAnswered = 0;
  const { type, task_1:task_scheme } = marking_scheme.Speaking;

  // -------------------------- SPEAKING-TYPE(summary_speaking) -------------------------
  if(type === "summary_speaking" && taskAns.length){ //Only run if user answer arr isn't empty

    for(let index=0; index < task_scheme.length; index++){

      let solution = task_scheme[index];
      let userAnswer = taskAns[index].answer; //could be an object or string

      // Marking those with and without audioUrls separately
      if(userAnswer?.hasOwnProperty("audioUrl")){

        if(!userAnswer.audioUrl) continue;
        
        // increment user's total q answered    
        totalAnswered++;

        const audioUrl = userAnswer.audioUrl;

        const audioMark = await markSpeakingHelper(type, audioUrl, index, solution, userAnswers)

        // increment user's total points
        totalPoints += audioMark 

      }else{

        if(!userAnswer) continue;

        // increment user's total q answered  
        totalAnswered++;

        if(solution.answer.value.toLowerCase().trim() === userAnswer.toLowerCase().trim()){

          // Modify answer at the index with the mark earned by user
          userAnswers.task_1[index]={...userAnswers.task_1[index], mark:solution.mark}

          // increment user's total points
          totalPoints += solution.mark;
        }
      }
    };
  }

  // --------------------------SPEAKING-TYPE(one_on_one)-------------------------
  if(type === "one_on_one" && taskAns.length){
    for(let index = 0; index < task_scheme.length; index++){

      const userAnswer = taskAns[index].answer; //An object

      const audioUrl = userAnswer?.audioUrl;

      if(!audioUrl) continue;

      // increment total q answered  
      totalAnswered++;

      const solution = task_scheme[index];
      const solnOption = solution.answer.option.toLowerCase().trim();//The option Sponsorffy has
      const userOption = userAnswer?.option?.toLowerCase().trim();//The option the user chose

      // Checking if the user selected options is equal to the solution option
      if(solnOption === userOption){

        // Transcribe user's speech to text and do further processing
        const audioMark = await markSpeakingHelper(type, audioUrl, index, solution, userAnswers);

        totalPoints += audioMark;
      }
    }
  };

  if(totalAnswered > 0){
    return await submitMarkedTest("speaking", totalPoints, userAnswers, to_Be_Marked, totalAnswered);
  }
  else{
    return to_Be_Marked
  }
};