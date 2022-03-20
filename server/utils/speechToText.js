const https = require('https');
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

const speechToText = async(fileURL) =>{
  try{
    // Gets the media file from AWS Server
    const getAudioDataAWS = () =>{
      return new Promise((resolve, reject) =>{
        https.get(fileURL,(res)=>{

          let bufferArray = [];
    
          res.on('data',(chunk) => bufferArray.push(chunk));
    
          res.on('end',()=>{
            const data=Buffer.concat(bufferArray);
            resolve(data)
          });
    
        }).on('error',reject)
      })
    };

    const data = await getAudioDataAWS();

    if(data){
      const audio = {
        content:data
      };
      
      const config = {
        encoding: 'MP3',//LINEAR16
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      };
      
      const request = {audio, config};
      
      const [response] = await client.recognize(request);

      transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');

      return transcription;
    }
  }
  catch(error){
    console.log(error);
  }
}
module.exports = speechToText;
