import ngrok from 'ngrok'
import github from 'octonode'


function updateHook( client, url ){
  client.repo('HackYourFuture/hukulele').hooks( (err, res) => {
    if( !res || typeof res[0].id === 'undefined') return false
    // Update the first hook
    client.post(
      '/repos/HackYourFuture/hukulele/hooks/'+res[0].id,
      { config: { url: url} },
      (err, status, body, headers) => {
        console.log(body);
      }
    )
  })
}

function ngRok( nGToken, githubToken, port ){
  // Here you've to insert the API KEYS FOR GITHUB
  const gitClient = github.client(githubToken)
  ngrok.connect({
    addr: port,
    authtoken: nGToken, // this is ngRok API KEY
    region: 'eu'
  }, (err, url) => {
    console.log(url);
    if(!url){
      ngrok.disconnect()
      setTimeout(()=>{
        ngRok( nGToken, githubToken, port )
      }, 1200)
      return false;
    }
    updateHook( gitClient, url );
  })
}

export default ngRok
