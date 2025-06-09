// import { mongoDB } from "./config/db.js";
// import Session from "./models/session.js";

// async function run() {
//     await mongoDB.run().catch(console.dir);


//     try {
//         const session = await Session.findOne({ sessionId: '01937463-a0d3-722f-87f5-1e5b8d088d6c' });

//         if (session) {

//             console.log("Manually updated session:", session.activeUsers);
//         } else {
//             console.log("Session not found");
//         }        
//     } catch (error) {
//         console.error("Error during update:", error.message);
//     }

// }

// run();

const data = ['hello', 'world'];
const emp = [];

data.forEach((val, key) => {
    emp.push({ [val]: key})
})

console.log(emp);