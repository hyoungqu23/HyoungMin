import fs from 'fs';
import path from 'path';

const BASE_DIR = 'src';
const NO_SLICED_LAYERS = ['root', 'shared'];
const SLICED_LAYERS = ['pages', 'widgets', 'features', 'entities'];
const LAYERS = [...SLICED_LAYERS, ...NO_SLICED_LAYERS];

const target = process.argv[2];

const isDirectory = (dir: string) => fs.existsSync(dir) && fs.statSync(dir).isDirectory();

const getNormalExports = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const regex = /^export (const|let|var|function|class|enum) ([a-zA-Z0-9_]+)/gm;
  const matches = [];
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    matches.push(match[2]);
  }
  return matches.filter((exportItem) => !exportItem!.startsWith('_'));
};

const getTypeExports = (filePath: string): string[] => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const regex = /^export (type|interface) ([a-zA-Z0-9_]+)/gm;
  const matches: string[] = [];
  let match;

  while ((match = regex.exec(fileContent)) !== null) {
    if (!match[2]!.startsWith('_')) {
      matches.push(match[2]!);
    }
  }

  return matches;
};

const processFiles = (dir: string, prefix?: string) => {
  const filePath = prefix ? path.join(dir, prefix) : path.join(dir);

  const files = fs
    .readdirSync(filePath)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
    .filter((file) => file !== 'index.ts');

  for (const file of files) {
    const filePath = prefix ? path.join(dir, prefix, file) : path.join(dir, file);
    const filename = path.basename(filePath, path.extname(filePath));

    const normalExports = getNormalExports(filePath);
    const typeExports = getTypeExports(filePath);

    const from = prefix ? `./${prefix}/${filename}` : `./${filename}`;

    if (normalExports.length > 0) {
      fs.appendFileSync(path.join(dir, 'index.ts'), `export { ${normalExports.join(', ')} } from '${from}';\n`);
    }

    if (typeExports.length > 0) {
      fs.appendFileSync(path.join(dir, 'index.ts'), `export type { ${typeExports.join(', ')} } from '${from}';\n`);
    }
  }
};

const processLayer = (layer: string) => {
  const layerPath: string = path.join(BASE_DIR, layer);

  if (NO_SLICED_LAYERS.includes(layer)) {
    const segments = fs.readdirSync(layerPath);

    for (const segment of segments) {
      const segmentPath = path.join(layerPath, segment);

      fs.writeFileSync(path.join(segmentPath, 'index.ts'), '// Auto Generated File. DO NOT EDIT MANUALLY.\n\n');

      processFiles(segmentPath);
    }

    console.log(`슬라이스가 없는 레이어 ${layer}의 모든 세그먼트에 대해 공개 API가 설정되었습니다.`);
  }

  if (SLICED_LAYERS.includes(layer)) {
    const slices = fs.readdirSync(layerPath);

    for (const slice of slices) {
      const slicePath = path.join(layerPath, slice);

      fs.writeFileSync(path.join(slicePath, 'index.ts'), '// Auto Generated File. DO NOT EDIT MANUALLY.\n\n');

      const segments = fs.readdirSync(slicePath);

      for (const segment of segments) {
        const segmentPath = path.join(slicePath, segment);

        if (isDirectory(segmentPath)) {
          processFiles(slicePath, segment);
        }
      }

      console.log(`${layer} 레이어 내부 슬라이스 ${slice}의 모든 세그먼트에 대해 공개 API가 설정되었습니다.`);
    }
  }
};

if (!target) {
  for (const layer of LAYERS) {
    const layerPath: string = path.join(BASE_DIR, layer);

    if (!isDirectory(layerPath)) {
      console.error(`❌ 사용하지 않는 레이어: ${layer}`);
      continue;
    }

    console.log(`🔍🔍🔍 ${layer} 레이어를 검사합니다.`);

    processLayer(layer);
  }
} else {
  const [layer, ..._rest] = target.split('/');

  if (!layer) {
    console.error('❌ Target Layer is not defined');
    process.exit(1);
  }

  const targetPath = path.join(BASE_DIR, target);
  const targetFiles = fs.readdirSync(targetPath);
  const hasSegment = targetFiles
    .filter((file) => file !== 'index.ts')
    .every((file) => isDirectory(path.join(targetPath, file)));

  if (hasSegment) {
    console.log(`🔍🔍🔍 ${target} 하위 세그먼트를 검사합니다.`);

    fs.writeFileSync(path.join(targetPath, 'index.ts'), '// Auto Generated File. DO NOT EDIT MANUALLY.\n\n');

    const segments = targetFiles.filter((file) => file !== 'index.ts');

    for (const segment of segments) {
      const filePath = path.join(targetPath, segment);

      if (isDirectory(filePath)) {
        processFiles(targetPath, segment);
      }
    }
  } else {
    console.log(`🔍🔍🔍 ${target} 세그먼트를 검사합니다.`);

    fs.writeFileSync(path.join(targetPath, 'index.ts'), '// Auto Generated File. DO NOT EDIT MANUALLY.\n\n');

    processFiles(targetPath);
  }
}
