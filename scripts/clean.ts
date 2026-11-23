import fsExtra from "fs-extra"
import path from "path"

export default () => {
  console.info("[START] - Clean Raw Texture Script");
  const saveLocation = process.env.SAVE_LOCATION;

  fsExtra.emptyDirSync(path.resolve(__dirname, "../tmp"));

  if (!saveLocation) {
    throw new Error("save location not found: " + saveLocation);
  }

  fsExtra.emptyDirSync(path.resolve(saveLocation, "new"));
  console.info("[END] - Clean Raw Texture Script");
};
