import Question from './../models/Question'

// Declared in the exported Ask Function.
var Bot
const labelCreateNewQuestion = 'Do you wanna create a new question?'
const labelInsertAnotherAnswer = 'Wanna insert another answer?'
const labelInsertAnswer = 'what would be an answer?'
const labelInsertQuestion = 'what would be the question?'


function prompt(conversation){
  conversation.ask(
    labelCreateNewQuestion,
    promptBoolean( (reply, convo) => {
      convo.say('Amazing!')
      askQuestion(convo)
      convo.next()
    },(reply, convo) => {
      convo.say("ooOoh :'(")
      convo.stop()
    } )
  )
}


function promptBoolean( cbYes, cbNo ){
  return [
    {
      pattern: Bot.utterances.yes,
      callback: cbYes
    },
    {
      pattern: Bot.utterances.no,
      callback: cbNo
    },
    {
      default: true,
      callback: (reply, convo)=>{
        convo.repeat()
        convo.next()
      }
    }
  ]
}

function askInsertAnotherAnswer(convo, question){
  convo.ask(
    labelInsertAnotherAnswer,
    promptBoolean( (reply, convo) => {
      askAnswer(convo, question)
      convo.next()
    }, (reply,convo) => {
      question.save()
      convo.say('Oh, ok. Your question is saved')
      convo.stop()
    } )
  )
}

function saveAnswers(convo, question, answer){
  question.addAnswer(answer)
  askInsertAnotherAnswer(convo, question)
  convo.next()
}

function promptIsCorrectAnswerArgs(convo, question, answer){
  return promptBoolean(
    ( reply, _convo ) => {
      answer.correct = true
      saveAnswers(_convo, question, answer)
    },
    ( reply, _convo ) => {
      answer.correct = false
      saveAnswers(_convo, question, answer)
    })
}

function askAnswer(conversation, question){
  let answer = {}
  let promptContinue = false

  conversation.ask( labelInsertAnswer, (reply, convo) => {
    answer.message = reply.text
    convo.ask('is a correct answer?', promptIsCorrectAnswerArgs(convo, question, answer))
    convo.next()
  })
}

function askQuestion(conversation){
  conversation.ask( labelInsertQuestion , (reply, convo) => {
    let question = new Question()
        question.setContent(reply.text)
    askAnswer(convo, question)
    convo.next()
  })
}

function initAsk(){
  Bot = this.bot
  this.controller.hears(['ask', 'add question'], ['direct_message','direct_mention','mention'], (bot, message) => {
    bot.startConversation( message, (err, conversation) => {
      prompt(conversation)
      conversation.on('end', (convo) => {
        // Here we should save
      })
    })
  })
}

export default function Ask(target, key, descriptor){
  target.prototype.addCommand.call(target, initAsk)
}
