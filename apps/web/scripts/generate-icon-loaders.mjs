import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { iconCatalog } from '@colorful-icons/react/catalog';
const output = new URL('../src/lib/icon-loaders.ts', import.meta.url);
mkdirSync(new URL('../src/lib/',import.meta.url),{recursive:true});
const content = `/* Generated from the public icon catalog. Run npm run generate. */\nimport type { ComponentType } from 'react';\nimport type { IconProps } from '@colorful-icons/react/lib';\nexport const iconLoaders: Record<string, () => Promise<Record<\`\${string}Icon\`, ComponentType<IconProps>>>> = {\n${iconCatalog.map(({component})=>`  ${component}: () => import('@colorful-icons/react/${component}'),`).join('\n')}\n};\n`;
if(!existsSync(output)||readFileSync(output,'utf8')!==content)writeFileSync(output,content);
console.log(`Generated ${iconCatalog.length} public icon loaders.`);
