function startCordiality(){
  this.controller.hears('hello', ['direct_message','direct_mention','mention'], function(bot,message) {
    bot.reply(message,'Hello yourself.');
  });
}

export default function cordiality ( target, key, descriptor ){
  target.prototype.addCommand.call(target, startCordiality)
}
