import path from "path";
import * as SyncDir from "sync-directory";
import voca from "voca";
import color from "ansi-colors";

export default () => {
  const saveLocation = process.env.SAVE_LOCATION;

  if (!saveLocation) {
    throw new Error("save location not found: " + saveLocation);
  }

  const srcPath = path.resolve(__dirname, "../src");
  const newTexturePath = path.resolve(saveLocation, "new");

  console.log(
    `${color.blueBright(`[DEPLOY:READY]`)} - WIP Folder Watched Ready: ${color.yellow(srcPath)}`,
  );

  SyncDir.sync(srcPath, saveLocation, {
    watch: true,
    chokidarWatchOptions: {
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    },
    exclude: (pathName: string) => {
      const fileName = path.basename(pathName);
      const rootFile = pathName.replace(srcPath + "\\", "");

      return (
        /X\d+ - /.test(rootFile) ||
        /\.(psd|ai|tmp)$/.test(fileName) ||
        /^[A-Fa-f0-9]+\..+/.test(fileName) ||
        /\.tmp/.test(rootFile)
      );
    },
    afterEachSync: (params) => {
      if (params) {
        console.log(
          `${color.blueBright(`[DEPLOY:${voca.upperCase(params.eventType)}]`)} - ${color.yellow(path.basename(params.srcPath))}`,
        );
      }
    },
  });

  console.log(
    `${color.redBright(`[TMP:READY]`)} - Texture Folder Watched Ready: ${color.yellow(newTexturePath)}`,
  );

  SyncDir.sync(newTexturePath, path.resolve(__dirname, "../tmp"), {
    watch: true,
    chokidarWatchOptions: {
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    },
    afterEachSync: (params) => {
      if (params) {
        console.log(
          `${color.redBright(`[TMP:${voca.upperCase(params.eventType)}]`)} - ${color.yellow(path.basename(params.srcPath))}`,
        );
      }
    },
  });
};
