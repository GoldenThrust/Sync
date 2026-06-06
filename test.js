import { generateUsername } from "./utils/functions.js";

const text = ["ffff", "ggggg", "hhhhhh", "jjjjjj", "kkkkk"];
const newName = text.toSpliced(2, 1);
console.log(text, newName);