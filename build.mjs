import {readFileSync,writeFileSync} from 'node:fs';
import {minify} from 'terser';

const MAX_BYTES=32768;

const JS_FILES=['data','state','audio','input','world','physics','render','ui','main'];

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');

const joined=JS_FILES.map(name=>read(`src/js/${name}.js`)).join('\n');
const js=(await minify(`(()=>{\n${joined}\n})();`,{compress:{passes:3},mangle:true})).code;

const css=read('src/style.css')
 .replace(/\/\*[\s\S]*?\*\//g,'')
 .replace(/\s+/g,' ')
 .replace(/\s*([{}:;,>])\s*/g,'$1')
 .replace(/;}/g,'}')
 .trim();

const html=read('src/index.html')
 .replace(/<!--[\s\S]*?-->/g,'')
 .replace(/>\s+</g,'><')
 .replace(/\s*\n\s*/g,' ')
 .trim()
 .replace('%CSS%',()=>css)
 .replace('%JS%',()=>js);

const bytes=Buffer.byteLength(html);
if(bytes>MAX_BYTES)throw new Error(`index.html pesa ${bytes} bytes, el límite es ${MAX_BYTES}`);
writeFileSync(new URL('index.html',import.meta.url),html);
console.log('index.html',bytes,'bytes',(bytes/1024).toFixed(1),'KB');
