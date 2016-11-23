import admin from 'firebase-admin'

// As an admin, the app has access to read and write all data, regardless of Security Rules

const init = ( cert ) => {
  // Initialize the app with a service account, granting admin privileges
  admin.initializeApp({
    credential: admin.credential.cert(cert),
    databaseURL: "https://hackyourfutureexams.firebaseio.com/"
  })

  let db = admin.database()
  return {
    db: db,
    questions: db.ref("questions")
  }
}

export default init
