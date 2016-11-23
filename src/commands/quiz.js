
function findAndAskQuestion(questions, conversation){
  questions.once('value').then( snapshot => {
    let i = 0
    let total = snapshot.child('counter').val()
    let rand = Math.floor(Math.random() * total )
    console.log(total, rand)
    let question = snapshot.query.order('index').startAt(rand).limitToFirst(1).val();
    console.log(question)
    conversation.say(question.content)
    conversation.end()
  })
}

function quizMe ( ){
  this.controller.hears('quiz', ['direct_message','direct_mention','mention'], ( bot, message )=>{
    bot.say('Amazing!')
    bot.say("Let's see...")
    bot.startConversation(message, (err, conversation)=>{
      findAndAskQuestion(this.questions, conversation)
    })
  })
}

export default function quiz ( target ){
  target.prototype.addCommand.call( target, quizMe )
}
