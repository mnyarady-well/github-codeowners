import * as path from "path";
import { OwnedFile } from "./lib/OwnedFile";
import { OwnershipEngine } from "./lib/OwnershipEngine";
import { readDirRecursively } from "./lib/readDirRecursively";
import { readTrackedGitFiles } from "./lib/readTrackedGitFiles";

export const getFileOwnership = async (options: {
  codeowners: string;
  dir: string;
  onlyGit: boolean;
  root?: string;
}): Promise<OwnedFile[]> => {
  const engine = OwnershipEngine.FromCodeownersFile(options.codeowners);

  let filePaths;
  if (options.onlyGit) {
    filePaths = await readTrackedGitFiles(options.dir);
  } else {
    filePaths = await readDirRecursively(options.dir, [".git"]);
  }

  // TODO Move this to config

  // General
  filePaths = filePaths.filter((f) => f.indexOf("/core/") === -1);
  filePaths = filePaths.filter(
    (f) => f.indexOf("/foundation/migrations") === -1
  );
  filePaths = filePaths.filter(
    (f) =>
      f.endsWith(".ts") ||
      f.endsWith(".js") ||
      f.endsWith(".jsx") ||
      f.endsWith(".tsx")
  );

  // Maximus
  filePaths = filePaths.filter((f) => f !== "Maximus/.dependency-cruiser.js");
  filePaths = filePaths.filter((f) => !f.endsWith("/index.ts"));

  // Gluteus
  filePaths = filePaths.filter((f) => !f.endsWith("/fixture.ts"));
  filePaths = filePaths.filter((f) => !f.endsWith("/split-treatments.enum.ts"));
  filePaths = filePaths.filter((f) => !f.endsWith("/treatment-status.enum.ts"));
  filePaths = filePaths.filter(
    (f) => !f.endsWith("/treatment-with-config.type.ts")
  );

  // FEnotype
  // Per Sr FE Engineers, putting all the files here in the SR FE team

  if (options.root) {
    // We need to re-add the root so that later ops can find the file
    filePaths = filePaths.map((filePath) =>
      path.join(<string>options.root, filePath)
    );
  }

  filePaths.sort();

  const files: OwnedFile[] = [];

  for (const filePath of filePaths) {
    files.push(await OwnedFile.FromPath(filePath, engine));
  }

  return files;
};
