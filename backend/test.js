// TEMPORARY TEST CALL

import { cronGenerator } from "./helpers/cronGenerator.js";

// This will run the moment you start your server
cronGenerator().then(res => console.log("Manual Test Result:", res));