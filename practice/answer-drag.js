export function bindAnswerDrag(root, {readOnly, changeAnswer}) {
  document.querySelectorAll('.answer-tooltip').forEach(el => el.remove());
  const tip = document.createElement('div');
  tip.className = 'answer-tooltip'; tip.role = 'tooltip'; tip.hidden = true; root.append(tip);
  const showTip = event => {
    const el = event.target.closest('[data-correct-answer]');
    if (!el) return;
    tip.textContent = '参考答案：' + el.dataset.correctAnswer;
    tip.hidden = false;
    const rect = el.getBoundingClientRect();
    tip.style.left = Math.max(8, Math.min(rect.left, innerWidth - tip.offsetWidth - 8)) + 'px';
    tip.style.top = Math.max(8, rect.top - tip.offsetHeight - 6) + 'px';
  };
  root.addEventListener('pointerover', showTip);
  root.addEventListener('pointermove', showTip);
  root.addEventListener('focusin', showTip);
  for (const event of ['pointerout', 'focusout']) root.addEventListener(event, () => tip.hidden = true);
  let chosen = null;
  const groupOf = el => el.closest('[data-question-group]');
  const slots = [...root.querySelectorAll('select.drop-answer')].map(select => {
    const wrap = document.createElement('span');
    wrap.className = 'answer-slot'; wrap.dataset.target = select.dataset.answer;
    select.removeAttribute('data-target'); select.before(wrap); wrap.append(select);
    const token = document.createElement('button');
    token.type = 'button'; token.className = 'answer-token';
    const empty = document.createElement('button');
    empty.type = 'button'; empty.className = 'answer-token empty-drop';
    empty.textContent = select.options[0].textContent.replace('拖入或选择', '将选项拖到这里');
    empty.disabled = readOnly;
    const clear = document.createElement('button');
    clear.type = 'button'; clear.className = 'answer-clear'; clear.textContent = '×'; clear.title = '移回选择池';
    wrap.append(empty, token, clear);
    clear.onclick = () => { chosen = null; changeAnswer(Number(select.dataset.answer), ''); };
    return {select, wrap, token, clear, empty};
  });
  const choose = item => {
    chosen = item;
    root.querySelectorAll('[data-chip]').forEach(el => el.setAttribute('aria-pressed', String(item && el.dataset.chip === item.value && groupOf(el) === item.group)));
  };
  const refresh = () => {
    for (const {select, wrap, token, clear, empty} of slots) {
      const filled = !!select.value;
      const pureDrag = groupOf(select).dataset.pureDrag === 'true';
      select.hidden = filled || pureDrag; empty.hidden = filled || !pureDrag;
      token.hidden = !filled; clear.hidden = !filled || readOnly;
      token.textContent = select.selectedOptions[0]?.textContent || '';
      token.disabled = readOnly;
      wrap.classList.toggle('filled', filled);
      if (select.dataset.correctAnswer) { wrap.dataset.correctAnswer = select.dataset.correctAnswer; }
    }
    root.querySelectorAll('[data-bank]').forEach(bank => {
      const group = groupOf(bank);
      const used = new Set([...group.querySelectorAll('[data-answer]')].filter(c => c.type !== 'radio' || c.checked).map(c => c.value));
      bank.querySelectorAll('[data-chip]').forEach(chip => chip.hidden = group.dataset.reusable === 'false' && used.has(chip.dataset.chip));
    });
  };
  const place = (target, item) => {
    if (readOnly || !item || groupOf(target) !== item.group) return;
    if (target.hasAttribute('data-bank')) {
      if (item.source != null) changeAnswer(item.source, '');
    } else {
      const index = Number(target.dataset.target);
      if (index !== item.source) {
        if (item.source != null) changeAnswer(item.source, '');
        changeAnswer(index, item.value);
      }
    }
    choose(null); refresh();
  };
  const bindSource = (el, getItem) => {
    let start, ghost, moved = false;
    const cleanup = () => { ghost?.remove(); ghost = null; start = null; root.querySelectorAll('.drag-over').forEach(t => t.classList.remove('drag-over')); };
    el.draggable = false;
    el.onclick = event => { event.stopPropagation(); if (!readOnly && !moved) choose(getItem()); moved = false; };
    el.onpointerdown = event => {
      if (readOnly || event.button !== 0) return;
      event.preventDefault(); event.stopPropagation(); moved = false;
      start = {x:event.clientX, y:event.clientY, item:getItem()};
      el.setPointerCapture(event.pointerId);
    };
    el.onpointermove = event => {
      if (!start || (!moved && Math.hypot(event.clientX-start.x,event.clientY-start.y)<5)) return;
      moved = true;
      if (!ghost) { ghost=document.createElement('div'); ghost.className='drag-ghost'; ghost.textContent=el.textContent; document.body.append(ghost); }
      ghost.style.left=event.clientX+12+'px'; ghost.style.top=event.clientY+12+'px';
      root.querySelectorAll('.drag-over').forEach(t=>t.classList.remove('drag-over'));
      const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-target], [data-bank]');
      if (target && groupOf(target)===start.item.group) target.classList.add('drag-over');
      const scrollPane=root.closest('.exam-pane') || root;
      const rect=scrollPane.getBoundingClientRect();
      if(event.clientY<rect.top+45) scrollPane.scrollTop-=22;
      if(event.clientY>rect.bottom-45) scrollPane.scrollTop+=22;
    };
    el.onpointerup = event => {
      if (!start) return;
      const item=start.item;
      const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-target], [data-bank]');
      cleanup();
      if(el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
      if(moved && target) place(target,item);
      else if(!moved) choose(item);
    };
    el.onpointercancel=()=>{cleanup();choose(null);};
    el.onlostpointercapture=cleanup;
  };
  root.querySelectorAll('[data-chip]').forEach(chip=>bindSource(chip,()=>({value:chip.dataset.chip,group:groupOf(chip)})));
  slots.forEach(({select,token})=>bindSource(token,()=>({value:select.value,source:Number(select.dataset.answer),group:groupOf(select)})));
  root.querySelectorAll('[data-target], [data-bank]').forEach(target=>{
    target.addEventListener('pointerdown',event=>{
      if(chosen && !event.target.closest('[data-chip], .answer-clear')) { event.preventDefault(); event.stopPropagation(); place(target,chosen); }
    },true);
    target.addEventListener('click',event=>{
      if(chosen && !event.target.closest('[data-chip], .answer-clear, .answer-token:not(.empty-drop)')) place(target,chosen);
    });
  });
  refresh();
  return refresh;
}
