import fs from 'fs';
import path from 'path';

// 설정: 레이어 순서와 비활성화할 규칙
const layerOrder = ['root', 'app', 'widgets', 'features', 'entities', 'shared'];
const disabledLayers = new Set<string>();

const findLayerIndex = (filePath: string) => {
  return layerOrder.findIndex((layer) => filePath.includes(`/${layer}/`));
};

const resolveImportPath = (importPath: string, currentFile: string) => {
  if (importPath.startsWith('.')) {
    return path.resolve(path.dirname(currentFile), importPath);
  }

  return importPath;
};

const validateLayers = (targetDir: string) => {
  const files: Array<string> = [];

  const collectFiles = (dir: string) => {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        collectFiles(fullPath);
      } else if (fullPath.endsWith('.ts')) {
        files.push(fullPath);
      }
    });
  };

  collectFiles(targetDir);

  const errors: Array<string> = [];

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(/import .* from ['"](.*)['"]/g) || [];

    matches.forEach((match) => {
      const [, importPathRaw] = match.match(/from ['"](.*)['"]/) || [];
      const importPath = resolveImportPath(importPathRaw, file);

      const sourceLayer = findLayerIndex(file);
      const importLayer = findLayerIndex(importPath);

      // 레이어 규칙 비활성화 확인
      if (sourceLayer === -1 || importLayer === -1) return; // 레이어 바깥 파일은 무시
      if (disabledLayers.has(layerOrder[sourceLayer]) || disabledLayers.has(layerOrder[importLayer])) return;

      if (sourceLayer > importLayer) {
        errors.push(
          `Layer violation: "${layerOrder[sourceLayer]}" (${file}) cannot import from "${layerOrder[importLayer]}" (${importPath})`,
        );
      }
    });
  });

  if (errors.length > 0) {
    console.error('Layer rule violations:');
    errors.forEach((error) => console.error(error));
    process.exit(1);
  } else {
    console.log('All layer rules passed!');
  }
};

validateLayers(path.resolve(__dirname, '../src'));
