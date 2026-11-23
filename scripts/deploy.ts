import fsExtra from "fs-extra"
import path from "path"

export default () => {
  console.info("[START] - Deployment Script");
  const saveLocation = process.env.SAVE_LOCATION;

  if (!saveLocation) {
    throw new Error("save location not found: " + saveLocation);
  }

  if (!fsExtra.existsSync(saveLocation)) {
    throw new Error("Save Path not found.");
  }

  fsExtra.emptyDirSync(saveLocation);

  fsExtra.cpSync(path.resolve(__dirname, "../src"), saveLocation, {
    recursive: true,
    filter: (source) => {
      const checkFile = path.basename(source);

      return (
        !/X\d+ - /.test(checkFile) &&
        !/\.(psd|ai)$/.test(checkFile) &&
        !/^[A-Fa-f0-9]+\..+/.test(checkFile)
      );
    },
  });

  console.info("[END] - Deployment Script");
};

