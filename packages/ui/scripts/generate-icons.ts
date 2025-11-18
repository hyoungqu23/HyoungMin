import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

const parseSVG = (svgContent: string) => {
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
  const elements: string[] = [];

  // path, circle, rect 등 모든 요소 추출
  const elementRegex =
    /<(path|circle|rect|line|polyline|polygon|ellipse)[^>]*>/g;
  let match: RegExpExecArray | null;
  while ((match = elementRegex.exec(svgContent)) !== null) {
    elements.push(match[0]);
  }

  return {
    viewBox: viewBoxMatch?.[1] || "0 0 24 24",
    elements,
  };
};

const elementToJSX = (element: string): string => {
  // SVG 요소를 JSX로 변환
  let jsx = element
    .replace(/stroke="black"/g, 'stroke="currentColor"')
    .replace(/fill="black"/g, 'fill="currentColor"')
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=")
    .replace(/fill-rule=/g, "fillRule=")
    .replace(/clip-rule=/g, "clipRule=");

  // self-closing 태그 처리
  if (!jsx.endsWith("/>")) {
    const tagMatch = jsx.match(/<(\w+)/);
    if (tagMatch) {
      jsx = jsx.replace(/>$/, " />");
    }
  }

  return jsx;
};

const generateIconFile = (svgPath: string, outputPath: string) => {
  const svgContent = readFileSync(svgPath, "utf-8");
  const { viewBox, elements } = parseSVG(svgContent);
  const fileName = svgPath.split("/").pop()!.replace(".svg", "");
  const componentName = fileName
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");

  const jsxElements = elements
    .map((el) => `    ${elementToJSX(el)}`)
    .join("\n");

  const code = `import { createIcon } from "../utils";

export const ${componentName} = createIcon(
  "${viewBox}",
  <>
${jsxElements}
  </>
);
`;

  // 출력 디렉토리가 없으면 생성
  const outputDir = dirname(outputPath);
  mkdirSync(outputDir, { recursive: true });

  writeFileSync(outputPath, code);
  console.log(`✅ Generated ${componentName} from ${fileName}.svg`);
};

const publicDir = join(process.cwd(), "public");
const outputDir = join(process.cwd(), "src/icons/generated");

const svgFiles = readdirSync(publicDir).filter((f) => f.endsWith(".svg"));

if (svgFiles.length === 0) {
  console.log("⚠️  No SVG files found in public directory");
  process.exit(0);
}

console.log(`📦 Generating ${svgFiles.length} icon components...\n`);

svgFiles.forEach((file) => {
  generateIconFile(
    join(publicDir, file),
    join(outputDir, file.replace(".svg", ".tsx")),
  );
});

console.log(`\n✨ Done! Generated ${svgFiles.length} icon components`);
