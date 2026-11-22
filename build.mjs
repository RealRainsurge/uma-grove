import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','app.js','model.js','styles.css','favicon.svg','game-theme.css','mechanics.js','planner.js','catalog.json','editors.js','spark-data.js','records.js','rank-data.js','rank-art.js','rank-atlas.webp']) await copyFile(file,`dist/${file}`);
console.log('Built Uma Grove in dist/');
