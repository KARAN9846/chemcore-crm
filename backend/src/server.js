import dotenv from "dotenv";
dotenv.config({ path: ".env", override: true, quiet: true });

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT);
