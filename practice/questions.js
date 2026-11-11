const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function questionGroups(part) {
  const groups = [];
  part.questions.forEach((question, index) => {
    if (question.section || !groups.length) groups.push({section: question.section || '', indices: []});
    groups.at(-1).indices.push(index);
  });
  return groups;
}

function options(text) {
  return [...text.matchAll(/^([A-Z])[.)]\s+(.+)$/gm)].map(match => ({value: match[1], text: match[2], offset: match.index}));
}

export function renderQuestions(part, {number, answer, readOnly, finished, matchingModes = {}}) {
  const disabled = readOnly ? ' disabled' : '';
  // Annotation offsets remain relative to the original question or section text.
  const text = (value, region, offset = 0) => '<span data-region="' + region + '" data-start="' + offset + '">' + escape(value) + '</span>';
  const flag = index => '<button type="button" class="flag" data-flag="' + index + '" aria-label="标记第 ' + number(index) + ' 题，稍后检查" aria-pressed="false">⚑</button>';
  const result = index => {
    const q = part.questions[index];
    if (!finished) return '';
    return '<div class="question-result ' + (q.correct ? 'good' : 'bad') + '">' + (q.correct ? '✓ 正确' : '× ' + (answer(index) ? '错误' : '未作答')) + ' · 参考答案 ' + escape(q.keys.join(' / ')) + (q.explanation ? '<details><summary>查看解析</summary><p>' + escape(q.explanation) + '</p></details>' : '') + '</div>';
  };
  const answerTip = index => finished ? ' title="参考答案：' + escape(part.questions[index].keys.join(' / ')) + '" data-correct-answer="' + escape(part.questions[index].keys.join(' / ')) + '"' : '';
  const input = index => '<input' + answerTip(index) + ' class="inline-answer" id="answer-' + index + '" data-answer="' + index + '" data-target="' + index + '" value="' + escape(answer(index)) + '" placeholder="' + number(index) + '" aria-label="第 ' + number(index) + ' 题答案" autocomplete="off"' + (readOnly ? ' readonly' : '') + '>';
  const select = (index, choices) => '<select' + answerTip(index) + ' class="drop-answer" id="answer-' + index + '" data-answer="' + index + '" data-target="' + index + '" aria-label="第 ' + number(index) + ' 题答案"' + disabled + '><option value="">' + number(index) + ' · 拖入或选择</option>' + choices.map(c => '<option value="' + escape(c.value) + '"' + (answer(index) === c.value ? ' selected' : '') + '>' + escape(c.value + '  ' + c.text) + '</option>').join('') + '</select>';
  const bank = (choices, group) => '<div class="choice-bank" data-bank="' + group + '"><small>将选项拖入空格；已填答案可以拖到其他空格，或拖回这里。也可点选选项后点空格。</small>' + choices.map(c => '<button type="button" class="choice-chip" draggable="' + !readOnly + '" data-chip="' + escape(c.value) + '" data-group="' + group + '" aria-pressed="false"' + disabled + '><b>' + escape(c.value) + '</b> ' + escape(c.text) + '</button>').join('') + '</div>';
  const rowTitle = index => '<div class="question-title"><b>' + number(index) + '</b>' + text(part.questions[index].text.replace(/\s*_{3,}\s*$/, ''), 'q' + index) + flag(index) + '</div>';

  return questionGroups(part).map((group, groupIndex) => {
    const first = group.indices[0], section = group.section, choices = options(section);
    const allQuestions = group.indices.map(i => part.questions[i]);
    const isMulti = allQuestions.every(q => q.answerGroup && q.answerGroup === allQuestions[0].answerGroup);
    const isCloze = !isMulti && group.indices.every(i => new RegExp('\\b' + number(i) + '\\s*_{3,}').test(section));
    let html = '<section class="question-group" data-reusable="' + (/more than once|multiple times|repeatedly|Which section/i.test(section) && !/only once|not.*more than once/i.test(section)) + '" data-question-group="' + groupIndex + '">';
    const table = allQuestions[0].table;
    if (table) {
      html += '<div class="instructions">' + text(section, 'section-' + first) + '</div><div class="completion-table-wrap"><table class="completion-table"><thead><tr>' + table.columns.map(c => '<th scope="col">' + escape(c) + '</th>').join('') + '</tr></thead><tbody>';
      html += table.rows.map((row, r) => '<tr>' + row.map((cell, c) => {
        const region = 'table-' + first + '-' + r + '-' + c;
        let cursor = 0, contents = '';
        for (const match of cell.matchAll(/(\d+)\s*_{3,}/g)) {
          const index = group.indices.find(i => number(i) === Number(match[1]));
          if (index === undefined) continue;
          contents += text(cell.slice(cursor, match.index), region, cursor) + '<span class="inline-slot" id="q' + index + '">' + input(index) + flag(index) + '</span>';
          cursor = match.index + match[0].length;
        }
        return '<td>' + contents + text(cell.slice(cursor), region, cursor) + '</td>';
      }).join('') + '</tr>').join('');
      html += '</tbody></table></div>' + group.indices.map(i => finished ? '<div><b>Question ' + number(i) + '</b>' + result(i) + '</div>' : '').join('');
    } else if (isCloze) {
      let cursor = 0, body = '';
      const choicesAt = choices.length ? choices[0].offset : section.length;
      const source = section.slice(0, choicesAt);
      for (const match of source.matchAll(/(\d+)\s*_{3,}/g)) {
        const index = group.indices.find(i => number(i) === Number(match[1]));
        if (index === undefined) continue;
        body += text(source.slice(cursor, match.index), 'section-' + first, cursor);
        body += '<span class="inline-slot" id="q' + index + '">' + (choices.length ? select(index, choices) : input(index)) + flag(index) + '</span>';
        cursor = match.index + match[0].length;
      }
      body += text(source.slice(cursor), 'section-' + first, cursor);
      html += '<div class="cloze-body">' + body + '</div>' + (choices.length ? bank(choices, groupIndex) : '');
      html += group.indices.map(i => finished ? '<div><b>Question ' + number(i) + '</b>' + result(i) + '</div>' : '').join('');
    } else if (isMulti && choices.length) {
      const end = choices[0].offset;
      html += '<div class="instructions multi-stem">' + text(section.slice(0, end), 'section-' + first) + flag(first).replace('data-flag=', 'data-flag-group="' + group.indices.join(',') + '" data-flag=') + group.indices.map(i => '<span id="q' + i + '"></span>').join('') + '</div>';
      html += '<fieldset class="multiple-choice"><legend>选择 ' + group.indices.length + ' 项</legend>';
      const selected = new Set(group.indices.map(answer));
      html += choices.map(c => '<label class="option"><input type="checkbox" data-multi="' + groupIndex + '" value="' + c.value + '"' + (selected.has(c.value) ? ' checked' : '') + disabled + '><span>' + text(c.value + '. ' + c.text, 'section-' + first, c.offset) + '</span></label>').join('') + '</fieldset>';
      if (finished) {
        const correct = allQuestions.filter(q => q.correct).length;
        const keys = [...new Set(allQuestions.flatMap(q => q.keys))];
        const explanations = [...new Set(allQuestions.map(q => q.explanation?.trim()).filter(Boolean))];
        html += '<div class="question-result group-result ' + (correct === group.indices.length ? 'good' : 'bad') + '"><b>Questions ' + number(first) + '–' + number(group.indices.at(-1)) + '</b><p>本组得分 ' + correct + ' / ' + group.indices.length + ' · 参考答案 ' + escape(keys.join(' / ')) + '</p>' + (explanations.length ? '<details><summary>查看解析</summary>' + explanations.map(value => '<p>' + escape(value) + '</p>').join('') + '</details>' : '') + '</div>';
      }
    } else if (/list of headings/i.test(section)) {
      const headings = part.headings;
      html += '<div class="instructions">' + text(section, 'section-' + first) + '</div>';
      html += bank(headings, groupIndex);
      html += group.indices.map(i => '<div class="q matching-row" id="q' + i + '">' + rowTitle(i) + select(i, headings) + result(i) + '</div>').join('');
    } else if (/Which section|Match each|correct ending/i.test(section)) {
      const range = section.match(/\bA[–—-]([B-Z])/);
      const matchingChoices = choices.length ? choices : Array.from({length: range ? range[1].charCodeAt(0) - 64 : 7}, (_, i) => ({value: String.fromCharCode(65 + i), text: ''}));
      const sectionMatching = /Which section|Which paragraph/i.test(section);
      const sentenceCompletion = /correct ending/i.test(section);
      if (sentenceCompletion) html = html.replace('data-question-group=', 'data-pure-drag="true" data-question-group=');
      const mode = sectionMatching ? 'table' : sentenceCompletion ? 'drag' : matchingModes[first] || 'table';
      const instructions = mode === 'drag' && choices.length ? section.slice(0, choices[0].offset).replace(/\s*Sentence endings\s*$/i, '') : section;
      html += '<div class="instructions">' + text(instructions, 'section-' + first) + '</div>' + (sectionMatching || sentenceCompletion ? '' : '<div class="matching-mode" role="group" aria-label="匹配题作答方式"><button data-mode="table" data-first="' + first + '" aria-pressed="' + (mode === 'table') + '">表格选择</button><button data-mode="drag" data-first="' + first + '" aria-pressed="' + (mode === 'drag') + '">拖拽匹配</button></div>');
      if (mode === 'table') {
        html += '<div class="match-table-wrap"><table class="match-table"><thead><tr><th scope="col">题目</th>' + matchingChoices.map(c => '<th scope="col">' + c.value + '</th>').join('') + '</tr></thead><tbody>';
        html += group.indices.map(i => '<tr id="q' + i + '"><th scope="row">' + rowTitle(i) + result(i) + '</th>' + matchingChoices.map(c => '<td><input type="radio" name="q-' + i + '" data-answer="' + i + '" value="' + c.value + '" aria-label="第 ' + number(i) + ' 题，选 ' + c.value + '"' + (answer(i) === c.value ? ' checked' : '') + disabled + '></td>').join('') + '</tr>').join('') + '</tbody></table></div>';
      } else {
        html += group.indices.map(i => '<div class="q matching-row" id="q' + i + '">' + rowTitle(i) + select(i, matchingChoices) + result(i) + '</div>').join('') + bank(matchingChoices, groupIndex);
      }
    } else {
      html += section ? '<div class="instructions">' + text(section, 'section-' + first) + '</div>' : '';
      const diagram = allQuestions[0].diagram;
      if (diagram && /^assets\/[a-z0-9-]+\.(png|jpg|svg)$/i.test(diagram.src)) html += '<figure class="question-diagram"><img src="' + escape(diagram.src) + '" alt="' + escape(diagram.alt) + '"></figure>';
      html += group.indices.map(i => {
        const q = part.questions[i], opts = options(q.text), isJudgement = /TRUE[\s\S]*FALSE[\s\S]*NOT GIVEN|YES[\s\S]*NO[\s\S]*NOT GIVEN/i.test(section);
        let body = '<div class="q" id="q' + i + '">';
        const stem = opts.length ? q.text.slice(0, opts[0].offset).trimEnd() : q.text;
        body += '<div class="question-title"><b>' + number(i) + '</b>' + text(stem, 'q' + i) + flag(i) + '</div>';
        const values = opts.length ? opts : isJudgement ? (/\bTRUE\b/.test(section) ? ['TRUE','FALSE','NOT GIVEN'] : ['YES','NO','NOT GIVEN']).map(v => ({value:v,text:v})) : [];
        if (values.length) {
          body += '<fieldset class="single-choice"><legend class="sr-only">第 ' + number(i) + ' 题</legend>' + values.map(c => '<label class="option"><input type="radio" name="q-' + i + '" data-answer="' + i + '" value="' + c.value + '"' + (answer(i) === c.value ? ' checked' : '') + disabled + '><span>' + (opts.length ? text(c.value + '. ' + c.text, 'q' + i, c.offset) : escape(c.text)) + '</span></label>').join('') + '</fieldset>';
        } else body += input(i);
        return body + result(i) + '</div>';
      }).join('');
    }
    return html + '</section>';
  }).join('');
}
