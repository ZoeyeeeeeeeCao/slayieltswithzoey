const groups = [
  {name:"关键词定位", types:[0]},
  {name:"填空", types:[1,2,3,4,5,6,15]},
  {name:"判断", types:[7,8]},
  {name:"匹配", types:[9,10,11,12]},
  {name:"选择", types:[13,14]}
];
const topics = [
  ["关键词定位","先用定位词找到原文，再用判断词核对题干和原文的关系。"],
  ["表格填空","把行名和列名合成一个问题，再带着两个条件回原文。"],
  ["笔记填空","沿着笔记的小标题和缩进，分清已知信息与要补的对象。"],
  ["句子填空","先读完整句，确定空格需要的词性，再核对时间、对象和范围。"],
  ["简答填空","先看疑问词，再从原文中取符合字数限制的答案。"],
  ["总结填空","无选项时回原文取词；有选项时先判断词性，再比较意思。"],
  ["流程图填空","沿箭头读清步骤，把材料、操作和结果分别对应起来。"],
  ["事实判断","逐项核对题干的事实。区分原文提供了反证，还是没有提供足够信息。"],
  ["作者观点判断","先确认是谁的观点，再比对题干和作者表达的态度及程度。"],
  ["句子首尾匹配","从句首先确定条件或动作，再找能补全原文逻辑关系的句尾。"],
  ["人物观点与特征匹配","把选项看作人物、日期或其他特征，再核对它对应的具体事件。"],
  ["段落信息匹配","先确定要找的信息是什么，再扫读各段寻找具体证据。"],
  ["标题匹配","概括整段的作用，再判断哪个标题能覆盖主要内容。"],
  ["多选题","每一个选项都要有独立依据，核对题目要求选择的数量。"],
  ["单选题","读清作者为什么举这个例子，再比较各选项对原文的概括。"],
  ["图示标注","沿标线找到具体部件，再核对原文中它的位置和作用。"]
];
const $ = id => document.getElementById(id);
function node(tag, cls, text) {
  const el=document.createElement(tag);
  if(cls) el.className=cls;
  if(text) el.textContent=text;
  return el;
}
const pad=n=>String(n).padStart(2,"0");
const code=n=>n===15?"附":pad(n);
const origin=e=>"剑桥雅思 "+e.volume+" · Test "+e.test+" · Passage "+e.passage+" · Q"+e.q;
let selected=0, current=null, opener=null, revealed=false;
function go(n){ if(selected===n)return; history.pushState(null,"","#lesson-1/type-"+n); render(); }
$("lesson-select").addEventListener("change",()=>{
  $("enter-course").href=$("lesson-select").value==="2"?"#lesson-2":"#lesson-1/type-0";
});
function renderKeywordTips(lesson){
  const rows=[
    ["圈人名，先找姓氏", "James Watson", "题干问 Watson 怎样解释这次发现。先扫读找 Watson，再读他讲自己与 Crick 为什么成功的那一句。", 14],
    ["圈地名，锁定对象", "The amphitheatre of Arles", "摘要里先圈 Arles。回到介绍这座城的段落后，只追踪当地竞技场的用途变化。", 5],
    ["圈年份，对准事件", "despite the … of 2001", "表格里先圈 2001，回原文找 January 2001。附近还出现了 1960s，但那是修复时间，空格问的是 2001 年发生的事。", 1],
    ["读数字，连单位一起圈", "figures demonstrating the environmental benefits", "题干要找环保成效的数据。扫到原文的 660 tons 时，把单位和 carbon dioxide 一起读：它衡量减排量；同段的 8,844 只是设备数量。", 11],
    ["圈范围词，逐项核对", "both Marie’s Nobel Prizes", "圈出 both，在纸上分写 1903 和 1911，再核对每次的获奖人。只查第一次，还不能判断“两次都是”。", 0],
    ["回原文圈否定词，看它否定什么", "play a key role", "题干说环境对创造力起关键作用。回原文读到 doesn’t make them feel at all creative 时，连着后面的动作读：被否定的是“让人觉得有创造力”。", 8],
    ["圈比较词，查清比较的内容", "more likely to", "句尾匹配题先圈 more likely to，再圈 values match。前者提示要找哪种行为更可能发生，后者限定讨论的是哪一组员工。", 9]
  ];
  lesson.append(node("h3","keywords-title","怎样圈关键词"));
  rows.forEach(([title,phrase,method,type],i)=>{
    const example=type===0?keywordExample:examples.find(item=>item.type===type);
    const row=node("article","keyword-row");
    const body=node("div","keyword-body");
    body.append(node("h4","",title),node("blockquote","",phrase),node("p","",method));
    const button=node("button","primary","打开例题");
    button.setAttribute("aria-label",title+"：打开例题");
    button.onclick=()=>openExample(example,button);
    row.append(node("span","step-num",pad(i+1)),body,button);lesson.append(row);
  });
}
function render(){
  // Keep existing #type-N links working as Lesson 1 links.
  const match=location.hash.match(/^#(?:lesson-1\/)?type-(\d+)$/);
  const lessonTwoMatch=location.hash.match(/^#lesson-2(?:\/(judgment|heading|fenjue))?$/);
  const lessonTwo=Boolean(lessonTwoMatch);
  const lessonTwoSection=lessonTwoMatch?.[1]||"judgment";
  const inCourse=Boolean(match)||lessonTwo;
  selected=match && topics[Number(match[1])]?Number(match[1]):0;
  if (!$("practice").hidden) closeExample(false);
  $("welcome").hidden = inCourse;
  $("course").hidden = !inCourse;
  if(inCourse){
    $("lesson-select").value=lessonTwo?"2":"1";
    $("enter-course").href=lessonTwo?"#lesson-2":"#lesson-1/type-0";
  }
  document.querySelector(".page-title").textContent=lessonTwo?"Lesson 2 · 阅读核心点与焚决":"Lesson 1 · 雅思阅读题型与解法";
  $("tabs").hidden=false;
  $("tabs").classList.toggle("lesson-two-tabs",lessonTwo);
  $("lesson").classList.toggle("lesson-two",lessonTwo);
  const page = $("page-surface");
  page.querySelector(":scope > .ink-layer")?.remove();
  pen.attach(page, lessonTwo ? "lesson-two-" + lessonTwoSection : match ? "lesson-" + selected : "welcome");
  if (!inCourse) return;
  if(lessonTwo){
    $("subtypes").closest("aside").hidden=true;
    $("lesson").parentElement.classList.add("basics");
    renderLessonTwo(lessonTwoSection);
    return;
  }
  const group=groups.find(g=>g.types.includes(selected));
  $("tabs").replaceChildren(...groups.map(g=>{
    const b=node("button","tab"+(g===group?" active":""));
    b.textContent=g.name;
    b.setAttribute("aria-pressed",String(g===group));b.onclick=()=>go(g.types[0]);return b;
  }));
  const basics=selected===0;
  $("subtypes").closest("aside").hidden=basics;
  $("lesson").parentElement.classList.toggle("basics",basics);
  $("subtypes").replaceChildren(...group.types.map(n=>{
    const b=node("button","side"+(selected===n?" active":""));b.append(node("span","",code(n)),topics[n][0]);
    if(n===selected)b.setAttribute("aria-current","page");b.onclick=()=>go(n);return b;
  }));
  const [name,description]=topics[selected], lesson=$("lesson");
  const label=basics?"通用方法":selected===15?"补充练习":selected>=10&&selected<=12?"乱序题型":"顺序题型";
  const meta=node("div","type-meta");meta.append(node("span","overline",basics?"READING SKILLS":"FIELD GUIDE　/　"+code(selected)),node("span","tag",label));
  lesson.replaceChildren(meta,node("h2","lesson-title",name),node("p","intro",description));
  const guide = node("article", "method");
  const steps = node("ol", "strategy-steps");
  for (const step of strategies[selected]) steps.append(node("li", "", step));
  guide.append(node("h3", "", "拿到这类题怎么做"), steps);
  lesson.append(guide);
  if (basics) { renderKeywordTips(lesson); return; }
  const subset=examples.filter(e=>e.type===selected);
  subset.forEach((e,i)=>{
    const card=node("article","method");
    card.append(node("div","overline","METHOD　"+pad(i+1)+"　 /　解题技巧"),node("h3","",e.tip.replaceAll("　"," · ")),node("p","",e.method));
    const foot=node("div","card-foot"),b=node("button","primary","打开例题");
    b.onclick=()=>openExample(e,b);foot.append(node("span","",origin(e)),b);card.append(foot);lesson.append(card);
  });

}
function renderLessonTwo(section){
  const sections=[['judgment','判断','判断题核心点'],['heading','匹配题','匹配题核心点'],['fenjue','焚决','焚决']];
  $("tabs").replaceChildren(...sections.map(([id,label])=>{
    const b=node('button','tab'+(section===id?' active':''),label);
    b.setAttribute('aria-pressed',String(section===id));
    b.onclick=()=>{if(section===id)return;history.pushState(null,'','#lesson-2/'+id);render();window.scrollTo(0,0);};
    return b;
  }));
  const lesson=$("lesson");
  lesson.replaceChildren(node('div','overline','LESSON 02'),node('h2','lesson-title',sections.find(([id])=>id===section)[2]));
  const cards=(rows)=>{
    const list=node('div','lesson-two-cards');
    rows.forEach(([title,body],i)=>{
      const card=node('article','lesson-two-card');
      card.append(node('span','step-num',pad(i+1)),node('h3','',title),node('p','',body));
      list.append(card);
    });return list;
  };
  if(section==='judgment'){
    lesson.append(node('p','intro','判断题中的信息变化'),cards(lessonTwoContent.judgment));
    const practice=node('div','lesson-two-examples');
    practice.append(node('h3','keywords-title','例题练习'));
    lessonTwoJudgmentExamples.forEach(example=>{
            const item=node('section','lesson-two-example');
            item.dataset.exampleId=example.id;
            item.append(node('h4','',example.id+' · '+example.title));
            const passage=node('blockquote','lesson-two-passage',example.excerpt);
            passage.lang='en';
            const question=node('p','lesson-two-question',example.question);
            question.lang='en';
            item.append(node('div','lesson-two-example-label','原文'),passage,node('div','lesson-two-example-label','题干'),question);
            practice.append(item);
    });
    lesson.append(practice);
  }else if(section==='heading'){
    const table=node('table','lesson-two-table');
    const caption=node('caption','','题干／标题 → 原文内容');table.append(caption);
    const head=document.createElement('thead'),tr=document.createElement('tr');
    ['功能方向','题干／标题中可能出现','原文中找什么'].forEach(t=>{const th=node('th','',t);th.scope='col';tr.append(th);});head.append(tr);table.append(head);
    const body=document.createElement('tbody');
    lessonTwoContent.heading.forEach(([label,words,clues])=>{
      const row=document.createElement('tr'),th=node('th','',label),td=node('td','',words),description=node('td','matching-clues',clues);
      th.scope='row';td.lang='en';row.append(th,td,description);body.append(row);
    });table.append(body);
    const wrap=node('div','lesson-two-table-wrap');wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label','匹配题对应表，可横向滚动');wrap.append(table);lesson.append(wrap);
    const practiceLink=node('a','primary','剑雅 20 · Test 3 · Passage 2');
    practiceLink.href='./practice/c20-t3-p2.html';
    practiceLink.style.cssText='display:inline-block;margin-top:28px;text-decoration:none';
    lesson.append(practiceLink);
  }else{
    lesson.append(node('h3','keywords-title','判断题'),cards(lessonTwoContent.guessJudgment),node('h3','keywords-title','选择题'),node('p','intro','选项倾向'),cards(lessonTwoContent.guessChoice));
  }
}
const annotations=new Map();
const menu=$("highlight-menu");
let pending=null;
function personalRanges(area){
  const key=origin(current)+"/"+area;
  if(!annotations.has(key))annotations.set(key,[]);
  return annotations.get(key);
}
function drawAnnotatedText(root,area,segments){
  const ranges=personalRanges(area);
  let offset=0;
  root.replaceChildren();
  for(const [text,isEvidence] of segments){
    const parent=isEvidence && revealed?node("mark",""):document.createDocumentFragment();
    let cursor=0;
    for(const [from,to] of ranges){
      const a=Math.max(0,from-offset), b=Math.min(text.length,to-offset);
      if(a>=b)continue;
      parent.append(text.slice(cursor,a),node("span","my-highlight",text.slice(a,b)));
      cursor=b;
    }
    parent.append(text.slice(cursor));root.append(parent);offset+=text.length;
  }
}
function dismissMenu(){menu.hidden=true;pending=null;}
function selectionOffset(root,container,offset){
  const prefix=document.createRange();prefix.selectNodeContents(root);
  prefix.setEnd(container,offset);return prefix.toString().length;
}
$("practice").addEventListener("contextmenu",event=>{
  dismissMenu();
  const root=event.target.closest("#passage,.qtext");
  if(!root)return;
  const selection=getSelection();
  if(!selection.rangeCount)return;
  let range=selection.getRangeAt(0);
  if(range.collapsed){
    const marked=event.target.closest(".my-highlight");
    if(!marked)return;
    range=document.createRange();range.selectNodeContents(marked);
  }
  if(!root.contains(range.startContainer)||!root.contains(range.endContainer)||!range.toString().trim())return;
  const area=root.id==="passage"?"passage":"question";
  const a=selectionOffset(root,range.startContainer,range.startOffset);
  const b=a+range.toString().length;
  const remove=personalRanges(area).some(([lo,hi])=>lo<=a && hi>=b);
  event.preventDefault();pending={area,a,b,remove};
  menu.textContent=remove?"移除我的高亮":"Highlight";
  menu.hidden=false;
  const card=$("practice").getBoundingClientRect();
  menu.style.left=Math.max(3,Math.min(event.clientX-card.left,card.width-menu.offsetWidth-4))+"px";
  menu.style.top=Math.max(3,Math.min(event.clientY-card.top,card.height-menu.offsetHeight-4))+"px";
  menu.focus({preventScroll:true});
});
menu.onclick=()=>{
  if(!pending)return;
  const {area,a,b,remove}=pending, ranges=personalRanges(area);
  const next=[];
  let start=a,end=b;
  for(const [lo,hi] of ranges){
    if(hi<a||lo>b){next.push([lo,hi]);continue;}
    if(remove){
      if(lo<a)next.push([lo,a]);
      if(hi>b)next.push([b,hi]);
    }else{start=Math.min(start,lo);end=Math.max(end,hi);}
  }
  if(!remove)next.push([start,end]);
  ranges.splice(0,ranges.length,...next.sort((x,y)=>x[0]-y[0]));
  dismissMenu();getSelection().removeAllRanges();paintEvidence();
};
document.addEventListener("pointerdown",event=>{if(event.target!==menu)dismissMenu();});
$("practice").addEventListener("scroll",dismissMenu,true);
function paintEvidence(){
  const e=current;
  let segments;
  if (e.fullText) {
    segments = [];
    let offset = 0;
    for (const quote of [...e.quotes].sort((a,b)=>e.fullText.indexOf(a)-e.fullText.indexOf(b))) {
      const start = e.fullText.indexOf(quote);
      segments.push([e.fullText.slice(offset,start), false], [quote, true]);
      offset = start + quote.length;
    }
    segments.push([e.fullText.slice(offset), false]);
  } else {
    segments = [[e.before?e.before+" ":"",false],[e.evidence,true],[e.after?" "+e.after:"",false]];
  }
  drawAnnotatedText($("passage"),"passage",segments);
  drawAnnotatedText($("question").querySelector(".qtext"),"question",[[e.question,false]]);
  $("answer").hidden=!revealed;
  $("answer").replaceChildren();
  if(revealed)$("answer").append(node("strong","","答案　"+(e.keys ? e.keys.map((key,i)=>(e.firstNumber+i)+" "+key).join(" · ") : e.answer)),node("span","",e.explain));
  $("reveal").textContent=revealed?"隐藏依据与答案":"显示依据与答案";
  $("reveal").setAttribute("aria-expanded",String(revealed));
  $("hint").textContent=revealed?(e.answer==="NOT GIVEN"?"高亮处是相关信息，题干所问的信息未给出。":"对照高亮原句，核对你的作答。"):"选中文字后右键 Highlight，标记你的线索";
}
function openExample(e,button){
  if (opener === button && !$("practice").hidden) { closeExample(); return; }
  closeExample(false);
  current=e;opener=button;revealed=false;
  button.setAttribute("aria-expanded","true");
  $("ex-title").textContent=e.article;$("source").textContent=origin(e);$("qnum").textContent=(e.keys ? "Questions " : "Question ")+e.q;
  $("passage").previousElementSibling.textContent=e.fullText ? "阅读原文（全文）" : "原文节选";
  $("response").parentElement.hidden=Boolean(e.keys);
  $("group-response")?.remove();
  if (e.keys) {
    const group=node("fieldset","group-response");
    group.id="group-response";
    group.append(node("legend","","你的作答"));
    e.keys.forEach((_,i)=>{
      const label=node("label","",String(e.firstNumber+i)+" ");
      const select=node("select");
      select.append(new Option("—",""), ...e.choices.map(choice=>new Option(choice,choice)));
      label.append(select);
      group.append(label);
    });
    $("answer").before(group);
  }
  $("response").value="";$("question").replaceChildren(node("div","qtext",e.question));
  if(e.pic){const img=node("img","question-image");img.src="./"+e.pic;img.alt=e.alt||("剑桥雅思 "+e.volume+" 阅读 Q"+e.q+" 原题");$("question").append(img);}
  for (const area of ["passage", "question"]) {
    const sheet = $(area).closest(".practice-sheet");
    sheet.querySelector(".ink-layer")?.remove();
    pen.attach(sheet, origin(e) + "/" + area);
  }
  paintEvidence();
  const card=$("practice");
  $("shade").hidden=false;
  document.querySelector("main").inert=true;
  document.body.classList.add("practice-open");
  card.hidden=false;
  card.querySelectorAll(".panels, .panels section").forEach(panel=>panel.scrollTop=0);
  $("close").focus({preventScroll:true});
}
$("reveal").onclick=()=>{revealed=!revealed;paintEvidence();if(revealed)$("answer").scrollIntoView({block:"nearest"});};
function closeExample(restoreFocus=true){
  const card=$("practice");
  dismissMenu();
  card.hidden=true;
  $("shade").hidden=true;
  document.querySelector("main").inert=false;
  document.body.classList.remove("practice-open");
  if (opener) {
    opener.setAttribute("aria-expanded","false");
    if (restoreFocus && opener.isConnected) opener.focus({preventScroll:true});
  }
  opener=null;current=null;revealed=false;
}
$("close").onclick=()=>closeExample();
$("shade").onclick=()=>closeExample();
document.addEventListener("keydown",event=>{
  if($("practice").hidden)return;
  if(event.key==="Escape"){if(!menu.hidden){dismissMenu();$("practice").focus({preventScroll:true});}else closeExample();}
  if(event.key==="Tab"){
    const first=$("practice").querySelector(".pen-tools button"),last=$("reveal");
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
});
pen.toolbar(document.querySelector("main"), document.querySelector("main"));
pen.toolbar(document.querySelector(".dialog-head"), $("practice"), $("close"));
window.addEventListener("hashchange",render);render();

