import "dotenv/config";
import { runScreenshot } from "./screenshot.core";

const url = process.argv[2] ?? "https://example.com";

runScreenshot({ url })
  .then((result) => {
    console.log("✅ Resultado:", result);
  })
  .catch((err) => {
    console.error("❌ Falló:", err.message);
    process.exit(1);
  });
