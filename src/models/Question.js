class Question{

  constructor( questions, content, answers ){
    this.content = content || false
    this.answers = answers || []
    this.dbInstance = false
    this.questions = questions || false
  }

  setContent( content ){
    this.content = content
  }

  addAnswer( answer ){
    this.answers.push(answer)
  }

  isContentSet(){
    return !this.content ? false : this.content.trim().length > 0
  }

  save( cb ){
    if(!this.questions) return false
    this.dbInstance = this.dbInstance || this.questions.push()
    this.dbInstance.set({question: this.content, answers: this.answers}).then((err, data)=>{
      if( cb ) cb()
      let counter = questions.child('counter');
      counter.transaction(function (current_value) {
        // increment the user count by one
        return (current_value || 0) + 1;
      });
    })
  }

}

export default Question
