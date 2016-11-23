import BotKit from 'botkit'
import shellbot from 'botkit-shell'
import cordiality from './personalities/cordiality'
import ask from './commands/ask'
import quiz from './commands/quiz'
import ngrok from './utils/ngrok'
import serverForGithubHook from './utils/update-hook'
import initDb from './utils/db'

var controller, bot, commands = []

@ask
@quiz
@cordiality
class Bot{

  constructor( isCli, port, slackToken, firebaseToken, githubToken, ngrockToken ){
    this.controller = controller
    this.bot = bot
    this.name = 'ukulele'
    this.isCli = isCli || false
    this.port = port || 5000
    this.slackToken = slackToken || false
    this.firebaseToken = firebaseToken || false
    this.githubToken = githubToken || false
    this.ngrockToken = ngrockToken || false
    this.initialize()
  }

  initDb( ){
    let res = initDb(this.firebaseToken)
    this.questions = res.questions
    this.db = res.db
  }

  startHookHandler( ){
    if( !this.githubToken || !this.ngrockToken ) return false
    ngrok( this.ngrockToken,  this.githubToken, this.port )
    serverForGithubHook( this.port )
  }

  addCommand( command ){
    commands.push( command )
  }

  initialize(){
    this.initDb()

    if(this.isCli){
      this.controller = BotKit.slackbot({ debug : true })
      this.bot = this.controller.spawn({ token: this.slackToken }).startRTM()
      this.startHookHandler()
    }else{
      this.controller = shellbot({})
      this.bot = this.controller.spawn({})
    }

    this.parseCommands()
  }

  parseCommands(){
    for(let k in commands){
      commands[k].apply(this)
    }
  }

}

export default Bot
