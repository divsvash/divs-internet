(()=>{
const oldForm=document.querySelector('#command-form');if(!oldForm)return;
const form=oldForm.cloneNode(true);oldForm.replaceWith(form);
const input=form.querySelector('#command');
const prompt=form.querySelector('label');
const historyRoot=document.querySelector('#history');
const terminalBox=document.querySelector('#terminal');
let cwd=[];
let commandHistory=[];
let historyCursor=0;

const filesystem={
  projects:{type:'dir',children:{cortex:{type:'app',app:'projects'},forge:{type:'app',app:'forge'},helios:{type:'app',app:'projects'},converge:{type:'app',app:'projects'},meshchain:{type:'app',app:'projects'}}},
  writing:{type:'dir',children:{'ai-brain.txt':{type:'article',href:'/the-line-between-ai-and-your-brain/',title:'The Line Between AI and Your Brain',excerpt:'On outsourcing thought, vibe coding, and keeping your own taste.'},'thinkpad.txt':{type:'article',href:'/my-personal-beef-with-a-thinkpad/',title:'My Personal Beef With a ThinkPad',excerpt:'A Windows funeral, a stubborn E420, and a very personal Linux installation.'}}},
  media:{type:'dir',children:{music:{type:'app',app:'music'},books:{type:'app',app:'books'},movies:{type:'app',app:'movies'},leetcode:{type:'app',app:'leetcode'}}},
  'about.sys':{type:'app',app:'about'},
  'now.txt':{type:'text',content:'NOW.TXT — SEPTEMBER 2026\nbuilding     Cortex, Forge, Helios\nresearching  GenAI × big-data pipelines\nlearning     Rust, distributed systems, GATE CS\nstatus       too many tabs; systems nominal'},
  'interests.txt':{type:'text',content:'RABBIT HOLES\n> local-first software\n> agent evaluation and infrastructure\n> distributed systems\n> quantum computing\n> operating systems and old computers\n> compilers, context, memory, weird interfaces'},
  'links.url':{type:'app',app:'internet'},
  'forge.exe':{type:'app',app:'forge'},
  secrets:{type:'dir',children:{'classified.txt':{type:'text',content:'Nice try. Forge redacted this file.'}}}
};

const aliases={cls:'clear',ls:'dir',work:'projects',blog:'writing',cat:'type',contact:'links'};
const appCommands={about:'about',projects:'projects',writing:'writing',music:'music',books:'books',movies:'movies',leetcode:'leetcode',links:'internet',forge:'forge',appearance:'appearance'};
const commands=['help','clear','cls','dir','ls','cd','pwd','open','type','cat','history','date','time','ver','whoami','exit','about','projects','work','writing','blog','now','interests','music','books','movies','leetcode','links','contact','forge','appearance','neofetch','fortune','sudo','rm','hello','status','ping'];

function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function pathText(){return 'C:\\DIVS'+(cwd.length?'\\'+cwd.map(x=>x.toUpperCase()).join('\\'):'')}
function updatePrompt(){prompt.textContent=pathText()+'>'}
function currentChildren(){let node={children:filesystem};for(const part of cwd)node=node.children[part];return node.children}
function resolve(name){return currentChildren()[name.toLowerCase()]||null}
function scrollEnd(){terminalBox.scrollTop=terminalBox.scrollHeight}
function output(command,html='',kind=''){
  const block=document.createElement('div');block.className='terminal-output'+(kind?' '+kind:'');block.innerHTML=`<span>${escapeHtml(pathText())}&gt; ${escapeHtml(command)}</span>${html?`\n\n${html}`:''}`;historyRoot.append(block);scrollEnd();
}
function bare(html,kind=''){const block=document.createElement('div');block.className='terminal-output '+kind;block.innerHTML=html;historyRoot.append(block);scrollEnd()}
function commandButton(label,cmd){return `<button class="terminal-link" data-terminal-command="${escapeHtml(cmd)}">${escapeHtml(label)}</button>`}
function fileButton(name,node){if(node.type==='dir')return commandButton(name.toUpperCase()+' &lt;DIR&gt;','cd '+name);return commandButton(name,node.type==='app'?'open '+name:'type '+name)}
function tokenize(raw){const matches=raw.match(/"[^"]*"|'[^']*'|\S+/g)||[];return matches.map(x=>x.replace(/^(['"])(.*)\1$/,'$2'))}
function suggest(value,choices){let best='',score=Infinity;for(const c of choices){let d=Math.abs(c.length-value.length);for(let i=0;i<Math.min(c.length,value.length);i++)if(c[i]!==value[i])d++;if(d<score){score=d;best=c}}return score<=3?best:''}

function listDirectory(){const children=currentChildren();const rows=Object.entries(children).map(([name,node])=>fileButton(name,node));return `<span class="terminal-heading">Directory of ${escapeHtml(pathText())}</span>\n\n${rows.join('\n')}\n\n<span class="terminal-dim">${rows.length} object(s)</span>`}
function changeDirectory(target){if(!target||target==='~'||target==='\\'){cwd=[];updatePrompt();return `Now in ${pathText()}`}if(target==='..'){cwd.pop();updatePrompt();return `Now in ${pathText()}`}const node=resolve(target);if(!node||node.type!=='dir')return null;cwd.push(target.toLowerCase());updatePrompt();return `Now in ${pathText()}`}
function openTarget(target){if(!target)return {error:'Usage: open &lt;program-or-file&gt;'};const direct=appCommands[target.toLowerCase()];if(direct){openApp(direct);return {text:`Opening ${apps[direct].title}...`}}const node=resolve(target);if(!node)return {error:`Cannot find '${escapeHtml(target)}' in ${escapeHtml(pathText())}.`};if(node.type==='dir'){cwd.push(target.toLowerCase());updatePrompt();return {text:`Opened ${pathText()}`}}if(node.type==='app'){openApp(node.app);return {text:`Opening ${apps[node.app].title}...`}}if(node.type==='article'){location.href=node.href;return {text:`Opening ${node.title}...`}}return {text:escapeHtml(node.content).replaceAll('\n','<br>')}}
function readFile(target){if(!target)return {error:'Usage: type &lt;file&gt;'};const node=resolve(target);if(!node)return {error:`File not found: ${escapeHtml(target)}`};if(node.type==='dir')return {error:`${escapeHtml(target)} is a directory.`};if(node.type==='article')return {html:`<span class="terminal-heading">${escapeHtml(node.title)}</span><br>${escapeHtml(node.excerpt)}<br><br><a class="terminal-link" href="${node.href}">[open full article]</a>`};if(node.type==='app')return openTarget(target);return {html:escapeHtml(node.content).replaceAll('\n','<br>')}}

function execute(raw){
  const trimmed=raw.trim();if(!trimmed)return;
  commandHistory.push(trimmed);historyCursor=commandHistory.length;
  const parts=tokenize(trimmed),original=parts.shift().toLowerCase(),cmd=aliases[original]||original,arg=parts.join(' ');
  if(cmd==='clear'){historyRoot.innerHTML='';return}
  if(appCommands[cmd]){output(trimmed,`Opening ${escapeHtml(apps[appCommands[cmd]].title)}...`);openApp(appCommands[cmd]);return}
  if(cmd==='now'||cmd==='interests'){output(trimmed,escapeHtml(filesystem[cmd+'.txt'].content).replaceAll('\n','<br>'));return}
  switch(cmd){
    case 'help':output(trimmed,`<span class="terminal-heading">DIVS.INTERNET COMMAND REFERENCE</span><br><br><div class="terminal-table"><span>SHELL</span><span>help · clear · dir · cd · pwd · open · type · history</span><span>SYSTEM</span><span>date · time · ver · whoami · exit</span><span>PLACES</span><span>about · projects · writing · now · interests · links</span><span>MEDIA</span><span>music · books · movies · leetcode</span><span>OTHER</span><span>forge · appearance · neofetch · fortune · ping</span></div><br><span class="terminal-dim">Use ↑/↓ for history, Tab to complete, Ctrl+L to clear.</span>`);break;
    case 'dir':output(trimmed,listDirectory());break;
    case 'cd':{const result=changeDirectory(arg.toLowerCase());output(trimmed,result?escapeHtml(result):`<span class="terminal-error">The system cannot find the path specified.</span>`);break}
    case 'pwd':output(trimmed,escapeHtml(pathText()));break;
    case 'open':{const r=openTarget(arg);output(trimmed,r.error?`<span class="terminal-error">${r.error}</span>`:(r.html||r.text));break}
    case 'type':{const r=readFile(arg.toLowerCase());output(trimmed,r.error?`<span class="terminal-error">${r.error}</span>`:(r.html||r.text));break}
    case 'history':output(trimmed,commandHistory.map((x,i)=>`${String(i+1).padStart(2,'0')}  ${escapeHtml(x)}`).join('<br>'));break;
    case 'date':output(trimmed,new Date().toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'}));break;
    case 'time':output(trimmed,new Date().toLocaleTimeString());break;
    case 'ver':output(trimmed,'divs.internet 95 [Version 1.1.2026]<br>Terminal subsystem: operational.');break;
    case 'whoami':output(trimmed,'divs — engineer, writer, professional rabbit-hole resident.');break;
    case 'exit':output(trimmed,'Minimizing MS-DOS Prompt...');setTimeout(()=>minimize('terminal'),350);break;
    case 'neofetch':output(trimmed,`<span class="terminal-success">divs@internet</span><br>────────────────────────<br><div class="terminal-table"><span>OS</span><span>divs.internet 95</span><span>Host</span><span>personal corner of the internet</span><span>Shell</span><span>divs.exe</span><span>Projects</span><span>too many</span><span>Tabs</span><span>classified</span><span>Resident</span><span>Forge :3</span></div>`);break;
    case 'fortune':output(trimmed,'“the best way to understand a system is to build a terrible version of it.”');break;
    case 'sudo':output(trimmed,'<span class="terminal-error">Forge: divs already owns this machine.<br>You, unfortunately, do not.</span>');break;
    case 'rm':output(trimmed,arg==='-rf /'?'<span class="terminal-error">Forge denied the request and is now judging you.</span>':'Access denied. This filesystem has emotional attachments.');break;
    case 'hello':output(trimmed,'hi. welcome to the machine.');break;
    case 'status':output(trimmed,'<span class="terminal-success">SYSTEMS NOMINAL</span><br>Forge awake · windows draggable · ideas unfinished');break;
    case 'ping':output(trimmed,arg.toLowerCase()==='forge'?'Pinging FORGE.EXE... reply from resident-cat: bytes=3 mood=:3':'Usage: ping forge');break;
    default:{const hint=suggest(cmd,commands);output(trimmed,`<span class="terminal-error">Bad command or file name: ${escapeHtml(cmd)}</span>${hint?`<br>Did you mean ${commandButton(hint,hint)}?`:''}`);}
  }
}

form.addEventListener('submit',event=>{event.preventDefault();const value=input.value;input.value='';execute(value)});
input.addEventListener('keydown',event=>{
  if(event.key==='ArrowUp'){event.preventDefault();if(historyCursor>0)historyCursor--;input.value=commandHistory[historyCursor]||'';input.setSelectionRange(input.value.length,input.value.length)}
  if(event.key==='ArrowDown'){event.preventDefault();if(historyCursor<commandHistory.length)historyCursor++;input.value=commandHistory[historyCursor]||'';input.setSelectionRange(input.value.length,input.value.length)}
  if(event.key==='Tab'){event.preventDefault();const parts=tokenize(input.value);if(parts.length<=1){const match=commands.find(x=>x.startsWith((parts[0]||'').toLowerCase()));if(match)input.value=match}else{const prefix=parts.at(-1).toLowerCase(),match=Object.keys(currentChildren()).find(x=>x.startsWith(prefix));if(match)input.value=input.value.replace(/\S+$/,match)}}
  if(event.ctrlKey&&event.key.toLowerCase()==='l'){event.preventDefault();historyRoot.innerHTML=''}
});
terminalBox.addEventListener('click',event=>{const button=event.target.closest('[data-terminal-command]');if(!button)return;input.value=button.dataset.terminalCommand;execute(input.value);input.value='';input.focus()});
if(sessionStorage.getItem('divs-booted'))historyRoot.innerHTML='<div class="terminal-output terminal-dim">divs.internet terminal resumed. type help.</div>';else sessionStorage.setItem('divs-booted','1');
updatePrompt();
})();
