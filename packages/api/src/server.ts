// src/server.ts
import {app} from "./app";

const port = process.env.NODE_PORT||5003;
app.listen(port, () =>
  console.log(`LIS App Started at http://localhost:${port}`)
);

