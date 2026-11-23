import minimist from "minimist";
import Deploy from "./deploy";
import Watch from "./watch";
import Clean from "./clean";

type CommandARGS = {
  mode?: "watch" | "deploy" | "clean";
};
const argv = minimist<CommandARGS>(process.argv.slice(2));

const initialize = async () => {
  switch (argv.mode) {
    case "watch":
      return Watch();
    case "deploy":
      return Deploy();
    case "clean":
      return Clean();
    default:
      console.log("no arguments provided");
  }
};

initialize().catch((err) => {
  console.error(err);
  process.exit(1);
});
