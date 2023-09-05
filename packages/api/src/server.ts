// src/server.ts
import {app} from "./app";
import {getPort} from "@lis/common";

const port = getPort();
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

