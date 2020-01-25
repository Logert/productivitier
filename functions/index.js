const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.watchDirectionAndUpdateSprint = functions.database.ref('/directions/{dirUid}')
  .onCreate(async (snapshot, context) => {
    const dirUid = context.params.dirUid;
    const uid = context.auth.uid;
    const db = admin.database();
    const user = (await db.ref(`/users/${uid}`).once('value')).val();
    const sprintArrKey = Object.keys((await db.ref('/sprints').orderByChild('owner').equalTo(uid).once('value')).val());
    const sprintKey = sprintArrKey[sprintArrKey.length - 1];
    return db.ref(`/sprints/${sprintKey}/direction/${dirUid}`).set(new Array(user.settings.actionsCount).fill(''));
  });

// exports.deleteDirectionFromSprint = functions.database.ref('/directions/{dirUid}')
//   .onDelete(async (snapshot, context) => {
//       const dirUid = context.params.dirUid;
//       const uid = context.auth.uid;
//       const db = admin.database();
//       return db
//         .ref('/sprints')
//         .orderByChild('owner')
//         .equalTo(uid)
//         .remove(`direction/${dirUid}`);
//   });

// exports.createSprintSchedule = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
//   const db = admin.database();
//   const users = (await db.ref('/users').once('value')).val();
//   return Object.entries(users).map(async ([key, { settings }]) => {
//     const date = new Date();
//     const userDirections = (await db.ref('/directions').orderByChild('owner').equalTo(key).once('value')).val();
//     const direction = Object.entries(userDirections).reduce((res, [dirKey]) => {
//       res[dirKey] = new Array(settings.actionsCount).fill('');
//       return res;
//     }, {});
//
//     return db.ref('/sprints').push({
//       owner: key,
//       range: [date.toLocaleDateString(), new Date(date.setDate(date.getDate() + settings.days - 1)).toLocaleDateString()],
//       direction
//     });
//   });
// });
