import { writeFile, readFile } from 'fs/promises';

const libraryPackageJsonPath = './projects/ngx-extended-form-builder/package.json';
const mainPackageJsonPath = './package.json';

async function main() {
  try {
    const libraryPackageJson = JSON.parse(
      await readFile(libraryPackageJsonPath, { encoding: 'utf-8' })
    );
    const mainPackageJson = JSON.parse(
      await readFile(mainPackageJsonPath, { encoding: 'utf-8' })
    );
    const versionArray = libraryPackageJson?.version?.split('.');
    const libraryDependencies = libraryPackageJson.peerDependencies;
    let haveChanges: boolean = false;
    Object.keys(libraryDependencies).forEach(
      key => {
        if (mainPackageJson.dependencies[key] && mainPackageJson.dependencies[key] !== libraryDependencies[key]) {
          libraryDependencies[key] = mainPackageJson.dependencies[key];
          if (!haveChanges) {
            haveChanges = true;
          };
        } else {
          if (mainPackageJson.devDependencies[key] && mainPackageJson.devDependencies[key] !== libraryDependencies[key]) {
            libraryDependencies[key] = mainPackageJson.devDependencies[key];
            if (!haveChanges) {
              haveChanges = true;
            };
          };
        };
      });
    if (haveChanges || (versionArray && versionArray?.[2])) {
      if ((versionArray && versionArray?.[2])) {
        versionArray[2] = String(+versionArray[2] + 1);
        libraryPackageJson.version = versionArray.join('.');
      };
      await writeFile(libraryPackageJsonPath, JSON.stringify(libraryPackageJson, null, 2));
      console.log(`Successfully update library package.json file!.`);
    } else {
      throw new Error(`Error on update version in package.json file!. Current value (need fix) = ${libraryPackageJson.version}.`);
    };
  } catch (message) {
    console.log(message);
  };
};

main();