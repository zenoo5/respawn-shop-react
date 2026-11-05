// Register hooks for Git checkouts while allowing source archives and explicit HUSKY=0.
import { existsSync } from "node:fs";
import husky from "husky";

if (process.env.HUSKY === "0") {
  console.log("HUSKY=0: skipping Git hook installation.");
} else if (!existsSync(".git")) {
  console.log(
    "No Git checkout found. Run npm run prepare after initializing Git.",
  );
} else {
  const message = husky();
  if (message) {
    console.error(message);
    process.exitCode = 1;
  }
}
