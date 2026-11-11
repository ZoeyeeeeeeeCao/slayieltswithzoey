// Content from the user-edited lesson document.
const lessonTwoContent = {
  "judgment": [
    [
      "many 变 most；few／little 变 most",
      "前者不能仅凭“很多”确认“大多数”；后者要在比较同一对象、同一数量范围时才构成冲突。"
    ],
    [
      "新增比较或优势",
      "先找原文是否真的比较了双方；只有缺少相关依据且无法反驳时才是 NG。"
    ],
    [
      "并列事件变因果",
      "同时出现不等于有因果关系。核对文章是否明确连接两件事。"
    ],
    [
      "过去或现在变未来计划",
      "检查原文是否提供未来意图。时态变化本身不自动决定答案。NG"
    ],
    [
      "多人观点归到一人",
      "查明这名人物是否包含在相关群体中、是否明确持该观点；不能只看人数变化。"
    ],
    [
      "添加精确数字或增减幅度",
      "核对数值、单位和比较基准。原文未提供且无法推断或反驳时，才考虑 NG。"
    ]
  ],
  "heading": [
  [
    "定义与概念",
    "definition / concept / meaning / the nature of X",
    "原文解释某物是什么、包含什么特征，或界定一个术语的范围。\n常见表达：X means… / X refers to… / a form of…；例如先提出术语，再用通俗说法解释。"
  ],
  [
    "起源与发展",
    "origins / history / emergence / development / early forms",
    "原文出现过去的年代、最初形式、发明者，以及从早期到后来的演变。\n常见表达：originally / first introduced / over the following decades。单独出现一个年份不一定是在讲发展史。"
  ],
  [
    "原因与影响因素",
    "reasons / causes / factors / why X happens",
    "原文解释为什么发生某事：先说现象，再给出促成它的条件或机制。\n常见表达：because / due to / stems from / is driven by。要找的是原因，不只是同时发生的另一件事。"
  ],
  [
    "结果与影响",
    "effects / impact / consequences / implications",
    "原文说明某件事带来了什么变化，影响了谁、哪些方面。\n常见表达：led to / resulted in / affected / enabled；例如某项措施实施后，成本下降、生活方式改变。"
  ],
  [
    "优点与收益",
    "advantages / benefits / merits / value / gains",
    "原文列出某做法带来的好处，如节省时间、降低费用、提高效率、改善健康。\n常见表达：save / reduce costs / improve / make it easier。要核对这些好处是否属于题干所指的对象。"
  ],
  [
    "局限与风险",
    "limitations / drawbacks / disadvantages / risks",
    "原文指出方法的不足、适用限制、代价或可能造成的损害。\n常见表达：cannot / only works when / may harm / at the expense of；也可能先肯定优点，再用 however 引出限制。"
  ],
  [
    "实验过程",
    "experiment / procedure / investigation / how X was tested",
    "原文描述研究对象、分组、操作步骤、控制条件和测量方式。\n例如一组接受处理、另一组不接受，随后记录两组反应；selected / divided / measured / recorded 常用于叙述过程。"
  ],
  [
    "相同与不同",
    "comparison / similarities / differences / contrasting",
    "原文同时讨论两个或多个对象，并在同一方面作比较。\n常见表达：both / unlike / whereas / compared with / more…than；例如 A 与 B 的用途相同，但材料不同。"
  ],
  [
    "当前进展",
    "recent advances / current developments / innovations / breakthroughs",
    "原文描述最近的新发现、新方法、新设备，或此前做不到而现在能够做到的事。\n常见表达：recently / now possible / newly developed；核对重点是最新进展，还是整段历史回顾。"
  ],
  [
    "被忽略的问题",
    "overlooked / neglected / little attention / lack of recognition",
    "原文说某个问题长期未受重视、研究不足或很少被讨论。\n常见表达：few studies have examined / received little attention / rarely considered；有时通过已有大量研究与尚未研究的方面形成对比。"
  ],
  [
    "数据与调查证据",
    "figures / data / statistics / survey / numerical evidence",
    "原文可能出现具体数字、百分比、比例、样本数量、测量值或调查结果，如 37%、240 participants、three out of ten（示意）。\ndata 也可指访谈和观察资料；figure 在统计语境可指数字，Figure 1 常指图，a leading figure 可指人物。先看词义，再看数字证明了什么。"
  ],
  [
    "研究发现与结论",
    "findings / results / conclusions / discovery / evidence",
    "原文呈现研究得出了什么结论、发现了什么规律，或原有预期是否得到支持。\n常见表达：found that / revealed / suggests / no difference was found。区分实验怎样做与最终发现什么；结果不一定有数字。"
  ],
  [
    "方法与解决措施",
    "methods / approaches / solutions / strategies / tackling",
    "原文说明怎样完成任务、解决问题或改善现状，可能列出步骤及作用。\n常见表达：by doing… / one way is… / introduce / replace / prevent；例如通过更换材料来减少损耗。"
  ],
  [
    "目标与目的",
    "aims / goals / objectives / purpose / intentions",
    "原文说明某人或某项目想达到什么目标、为什么开展某项工作。\n常见表达：in order to / so as to / designed to / intended to。目标表示想实现什么，不保证已经实现。"
  ],
  [
    "预测与展望",
    "predictions / prospects / outlook / future / potential",
    "原文推测以后可能发生的变化、未来用途或发展方向，也可能给出预测年份。\n常见表达：is expected to / may eventually / is projected to / could in future；核对预测对象及肯定程度。"
  ],
  [
    "困难与障碍",
    "challenges / obstacles / difficulties / barriers / hurdles",
    "原文描述阻碍某件事开展或成功的因素，如成本太高、条件不足、技术难题或遭到抵制。\n常见表达：prevent / hinder / struggle to / difficult to。重点是做成这件事有何困难，而非成功之后的副作用。"
  ],
  [
    "资金与资源",
    "funding / finance / investment / resources / financial support",
    "原文出现经费、预算、拨款、投资、赞助，或人员、设备、材料的投入和不足。\n常见表达：grants / budget / funded by / shortage of staff；出现金额后还要看是在讲资金来源、支出还是收益。"
  ],
  [
    "质疑与反对",
    "criticism / objections / doubts / opposition / controversy",
    "原文有人质疑某种观点或做法，提出反对理由、反证，或展示不同立场的争论。\n常见表达：question whether / reject / dispute / critics argue；argue 也可以只是提出观点，不能单独当作反对信号。"
  ],
  [
    "建议与推荐",
    "recommendations / advice / proposals / suggested action",
    "原文提出应该采取的行动、改进办法，或向某类人发出倡议。\n常见表达：should / ought to / recommend / call for。suggest doing 可提出建议；evidence suggests that 通常是在推断研究结论。"
  ],
  [
    "分类",
    "types / categories / classification / varieties / groups",
    "原文把一个大类分成若干小类，说明分类标准或各类特征。\n常见表达：can be divided into / falls into / consists of several types；连续出现例子不一定是在建立分类。"
  ],
  [
    "数量或水平变化",
    "trends / growth / decline / fluctuations / changing levels",
    "原文比较不同时期的数据或程度，描述上升、下降、波动、峰值或稳定。\n常见表达：rose from…to… / doubled / fell by… / remained stable；例如同一指标从 12% 变为 19%（示意），而不是只有一个时点的数字。"
  ],
  [
    "人群或专家观点",
    "views / attitudes / perceptions / beliefs / expert opinion",
    "原文把看法明确归给某个人或群体，可能使用引语或转述。\n常见表达：according to / believes / maintains / regards…as；核对是谁的观点，以及是支持、反对还是不确定。"
  ],
  [
    "技术与设备",
    "technology / equipment / devices / machinery / tools",
    "原文介绍仪器、装置或技术的构造、工作方式、用途及带来的改变。\n例如传感器收集信号，软件处理数据；也可能出现 detects / transmits / converts。仅提到设备名称不一定构成全段主旨。"
  ]
],
  "guessJudgment": [
    [
      "首题与末题",
      "首题答案不是 NG 的概率高达 80.71%；首题与末题答案不相同的概率高达 79.29%。（基于本地 140 组学术类判断题统计）"
    ],
    [
      "委婉或可能性表达（软词）",
      "may、might、possible、probable、likely、can、could、seem to、appear to、some、sometimes、not all、not always 等，倾向选 T，概率约80%。"
    ],
    [
      "绝对或强限定词",
      "only、never、always、all、immediately、best、ignore、too、largest、largely 等倾向选 F。"
    ],
    [
      "相邻答案分布",
      "连续出现三个 T 或三个 F 的可能性很小。"
    ],
    [
      "长句与难词",
      "较长、难词较多的题干倾向选 T。"
    ],
    [
      "转折和让步",
      "although、while、despite、in spite of、however 附近容易出现考点。"
    ]
  ],
  "guessChoice": [
    [
      "多选题首尾选项通常不是答案",
      "首尾选项指选项列表中的第一项和最后一项，例如 A—E 中的 A 和 E；这条口诀的意思是优先考虑中间选项。"
    ],
    [
      "优先排除 must／only／all／never",
      "must 表示“必须／一定”，only 表示“只有”，all 表示“全部”，never 表示“从不”；这类表达限定严格、语气绝对。"
    ],
    [
      "优先排除常识正确的选项",
      "指凭日常经验就觉得“很有道理”的选项，例如“运动有益健康”；这类选项容易让人直接认同。"
    ],
    [
      "优先排除照抄原词的选项",
      "指直接重复原文关键词或短语的选项。熟悉的词会制造“原文说过”的感觉，而同义改写会换一种表达方式。"
    ],
    [
      "优先选 some／possible／likely／partly",
      "some 表示“一些”，possible 表示“可能的”，likely 表示“很可能的”，partly 表示“部分地”；这类表达保留余地，语气较温和。"
    ],
    [
      "优先选符合文章总体立场的选项",
      "总体立场指作者对核心话题的基本态度，例如支持、反对或有所保留；这条口诀强调选项与作者态度的方向一致。"
    ]
  ]
};

// Selected classroom examples: student-facing content only.
const lessonTwoJudgmentExamples = [
  {
    "rule": 6,
    "id": "C09-T1-P1-Q05",
    "title": "William Henry Perkin",
    "excerpt": "The drug is derived from the bark of the cinchona tree, native to South America, and by 1856, demand for the drug was surpassing the available supply.",
    "question": "The trees from which quinine is derived grow only in South America."
  },
  {
    "rule": 2,
    "id": "C09-T1-P1-Q07",
    "title": "William Henry Perkin",
    "excerpt": "And, proving the truth of the famous scientist Louis Pasteur’s words ‘chance favours only the prepared mind’, Perkin saw the potential of his unexpected find.",
    "question": "Perkin was inspired by the discoveries of the famous scientist Louis Pasteur."
  },
  {
    "rule": 7,
    "id": "C09-T2-P2-Q25",
    "title": "Venus in transit",
    "excerpt": "While this showed astronomers that Venus was surrounded by thick layer of gases refracting sunlight around it, both effects made it impossible to obtain accurate timings.",
    "question": "Earth astronomers suspected that the atmosphere on Venus was toxic."
  },
  {
    "rule": 2,
    "id": "C09-T2-P3-Q34",
    "title": "A neuroscientist reveals how to think differently",
    "excerpt": "Observation of iconoclasts shows that they embrace novelty while most people avoid things that are different.",
    "question": "Most people are too shy to try different things."
  },
  {
    "rule": 1,
    "id": "C14-T1-P1-Q11",
    "title": "The importance of children’s play",
    "excerpt": "Children wrote longer and better-structured stories when they first played with dolls representing characters in the story.",
    "question": "Playing with dolls was found to benefit girls’ writing more than boys’ writing."
  },
  {
    "rule": 1,
    "id": "C13-T2-P1-Q12",
    "title": "Bringing cinnamon to Europe",
    "excerpt": "Eventually, the Dutch began cultivating their own cinnamon trees to supplement the diminishing number of wild trees available for use.",
    "question": "The trees planted by the Dutch produced larger quantities of cinnamon than the wild trees."
  },
  {
    "rule": 1,
    "id": "C12-T5-P1-Q01",
    "title": "Cork",
    "excerpt": "Its bark grows up to 20 cm in thickness",
    "question": "The cork oak has the thickest bark of any living tree."
  },
  {
    "rule": 2,
    "id": "C14-T2-P3-Q40",
    "title": "Why companies should welcome disorder",
    "excerpt": "In similar fashion, the former chairman of General Electric embraced disorganisation, putting forward the idea of the “boundaryless” organisation. Again, it involves breaking down the barriers between different parts of a company and encouraging virtual collaboration and flexible working. Google and a number of other tech companies have embraced (at least in part) these kinds of flexible structures, facilitated by technology and strong company values which glue people together.",
    "question": "Google was inspired to adopt flexibility by the success of General Electric."
  },
  {
    "rule": 5,
    "id": "C20-T2-P1-Q12",
    "title": "Manatees",
    "excerpt": "A review of almost 1,800 cases of entanglement in fishing nets and of plastic consumption among marine mammals in US waters from 2009 to 2020 found that at least 700 cases involved manatees.",
    "question": "The risk to manatees from entanglement and plastic consumption increased significantly in the period 2009–2020."
  }
];

// Sources support the reading approach and language functions; the table is a teaching synthesis.
const lessonTwoMatchingSources = [
  [
    "IELTS 官方题型说明：标题匹配与段落信息匹配的区别",
    "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading"
  ],
  [
    "IELTS 教学文章：关键词、同义表达与主题句",
    "https://ielts.org/news-and-insights/how-to-prepare-learners-for-matching-headings-task-on-the-ielts-reading-test"
  ],
  [
    "IDP：Matching Headings 阅读方法",
    "https://ielts.idp.com/prepare/article-ielts-reading-matching-headings"
  ],
  [
    "曼彻斯特大学 Academic Phrasebank：定义",
    "https://www.phrasebank.manchester.ac.uk/writing-definitions/"
  ],
  [
    "曼彻斯特大学 Academic Phrasebank：比较",
    "https://www.phrasebank.manchester.ac.uk/compare-and-contrast/"
  ],
  [
    "曼彻斯特大学 Academic Phrasebank：因果",
    "https://www.phrasebank.manchester.ac.uk/explaining-cause-and-effect/"
  ],
  [
    "曼彻斯特大学 Academic Phrasebank：研究结果",
    "https://www.phrasebank.manchester.ac.uk/reporting-results/"
  ],
  [
    "曼彻斯特大学 Academic Phrasebank：趋势",
    "https://www.phrasebank.manchester.ac.uk/describing-trends/"
  ]
];
