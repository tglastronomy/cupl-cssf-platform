// 中国政法大学 刑事司法学院 硕士研究生综合数据
export const schoolInfo = {
  name: '中国政法大学',
  college: '刑事司法学院',
  englishName: 'China University of Political Science and Law',
  collegeEnglish: 'School of Criminal Justice',
  established: '1952',
  collegeEstablished: '2003',
  address: '北京市昌平区府学路27号',
  website: 'https://xssfxy.cupl.edu.cn/',
  gradWebsite: 'https://yjsy.cupl.edu.cn/',
  phone: '010-58908070',
  description: '中国政法大学刑事司法学院是国内刑事法学教学与研究的重要基地。学院前身为1952年建校时的刑法教研室，2003年在原刑法学系和刑事诉讼法学系基础上组建成立。学院下设刑法学研究所、刑事诉讼法学研究所、侦查学研究所、犯罪学研究所和网络法学研究所五个教学科研机构。',
  highlights: [
    '刑法学、刑事诉讼法学均为国家重点学科',
    '专职教师64人，其中教授23人，博士生导师19人',
    '两个博士点（刑法学、诉讼法学）和两个硕士点',
    '面向硕士、博士研究生开设专业课50余门',
    '国内刑事法学教学与研究的顶尖学府之一'
  ]
}

export const programs = [
  {
    code: '030104',
    name: '刑法学',
    type: '学术学位',
    degree: '法学硕士',
    duration: '3年',
    directions: [
      '中国刑法学',
      '外国刑法学与比较刑法学',
      '经济刑法学',
      '国际刑法学',
      '犯罪学与刑事政策学',
      '网络与信息犯罪治理'
    ],
    examSubjects: [
      { code: '101', name: '思想政治理论', score: 100 },
      { code: '201', name: '英语（一）', score: 100, note: '或202俄语、203日语、240德语、241法语' },
      { code: '708', name: '法学综合一（法理学、宪法学）', score: 150 },
      { code: '808', name: '法学综合二（刑法学、民法学）', score: 150 }
    ],
    retestSubjects: ['刑法学专业综合（含刑法学、犯罪学）'],
    references: [
      { title: '刑法学（第六版）', author: '曲新久', publisher: '中国政法大学出版社', year: '2022', importance: '核心' },
      { title: '刑法学（上下册）', author: '陈兴良', publisher: '复旦大学出版社', year: '2023', importance: '重要' },
      { title: '刑法总论精释（第四版）', author: '陈兴良', publisher: '人民法院出版社', year: '2021', importance: '参考' },
      { title: '法理学', author: '舒国滢', publisher: '中国政法大学出版社', year: '2023', importance: '核心' },
      { title: '宪法学', author: '焦洪昌', publisher: '北京大学出版社', year: '2023', importance: '核心' },
      { title: '民法学（第三版）', author: '李永军', publisher: '中国政法大学出版社', year: '2022', importance: '核心' }
    ]
  },
  {
    code: '030106',
    name: '诉讼法学（刑事诉讼法方向）',
    type: '学术学位',
    degree: '法学硕士',
    duration: '3年',
    directions: [
      '刑事诉讼法学',
      '证据法学',
      '侦查学',
      '司法鉴定学',
      '刑事执行法学'
    ],
    examSubjects: [
      { code: '101', name: '思想政治理论', score: 100 },
      { code: '201', name: '英语（一）', score: 100, note: '或202俄语、203日语、240德语、241法语' },
      { code: '708', name: '法学综合一（法理学、宪法学）', score: 150 },
      { code: '811', name: '刑事诉讼法学', score: 150 }
    ],
    retestSubjects: ['刑事诉讼法学专业综合（含刑诉法、证据法）'],
    references: [
      { title: '刑事诉讼法（第七版）', author: '陈光中', publisher: '北京大学出版社', year: '2023', importance: '核心' },
      { title: '刑事诉讼法学', author: '汪海燕', publisher: '中国政法大学出版社', year: '2022', importance: '核心' },
      { title: '证据法学（第三版）', author: '张保生', publisher: '中国政法大学出版社', year: '2022', importance: '重要' },
      { title: '法理学', author: '舒国滢', publisher: '中国政法大学出版社', year: '2023', importance: '核心' },
      { title: '宪法学', author: '焦洪昌', publisher: '北京大学出版社', year: '2023', importance: '核心' }
    ]
  }
]

export const scoreLines = [
  { year: 2026, program: '刑法学', code: '030104', politics: 60, english: 60, professional: 90, total: 370, nationalLine: 325, note: '最新' },
  { year: 2026, program: '诉讼法学', code: '030106', politics: 60, english: 60, professional: 90, total: 370, nationalLine: 325, note: '最新' },
  { year: 2025, program: '刑法学', code: '030104', politics: 60, english: 60, professional: 90, total: 370, nationalLine: 325 },
  { year: 2025, program: '诉讼法学', code: '030106', politics: 60, english: 60, professional: 90, total: 370, nationalLine: 325 },
  { year: 2024, program: '刑法学', code: '030104', politics: 60, english: 60, professional: 90, total: 370, nationalLine: 326 },
  { year: 2024, program: '诉讼法学', code: '030106', politics: 60, english: 60, professional: 90, total: 365, nationalLine: 326 },
  { year: 2023, program: '刑法学', code: '030104', politics: 60, english: 60, professional: 90, total: 380, nationalLine: 326 },
  { year: 2023, program: '诉讼法学', code: '030106', politics: 60, english: 60, professional: 90, total: 370, nationalLine: 326 },
  { year: 2022, program: '刑法学', code: '030104', politics: 60, english: 60, professional: 90, total: 375, nationalLine: 335 },
  { year: 2022, program: '诉讼法学', code: '030106', politics: 60, english: 60, professional: 90, total: 370, nationalLine: 335 },
  { year: 2021, program: '刑法学', code: '030104', politics: 55, english: 55, professional: 90, total: 365, nationalLine: 321 },
  { year: 2021, program: '诉讼法学', code: '030106', politics: 55, english: 55, professional: 90, total: 355, nationalLine: 321 },
]

export const admissionStats = [
  { year: 2026, program: '刑法学', planned: 18, applied: 350, admitted: 20, ratio: '17.5:1', avgScore: 386 },
  { year: 2026, program: '诉讼法学', planned: 24, applied: 290, admitted: 26, ratio: '11.2:1', avgScore: 381 },
  { year: 2025, program: '刑法学', planned: 18, applied: 340, admitted: 20, ratio: '17:1', avgScore: 385 },
  { year: 2025, program: '诉讼法学', planned: 24, applied: 280, admitted: 26, ratio: '10.8:1', avgScore: 380 },
  { year: 2024, program: '刑法学', planned: 18, applied: 320, admitted: 20, ratio: '16:1', avgScore: 388 },
  { year: 2024, program: '诉讼法学', planned: 15, applied: 250, admitted: 17, ratio: '14.7:1', avgScore: 382 },
  { year: 2023, program: '刑法学', planned: 17, applied: 350, admitted: 19, ratio: '18.4:1', avgScore: 395 },
  { year: 2023, program: '诉讼法学', planned: 14, applied: 230, admitted: 16, ratio: '14.4:1', avgScore: 386 },
  { year: 2022, program: '刑法学', planned: 16, applied: 310, admitted: 18, ratio: '17.2:1', avgScore: 390 },
  { year: 2022, program: '诉讼法学', planned: 13, applied: 210, admitted: 15, ratio: '14:1', avgScore: 384 },
]

export const advisors = [
  {
    name: '曲新久',
    title: '教授、博士生导师',
    direction: '中国刑法学、刑法哲学',
    intro: '刑事司法学院教授，著有《刑法学》（通用教材），长期从事刑法学基础理论研究。',
    tags: ['刑法学', '刑法哲学', '博导']
  },
  {
    name: '汪海燕',
    title: '教授、博士生导师',
    direction: '刑事诉讼法学、证据法学',
    intro: '刑事司法学院教授，主编《刑事诉讼法学》教材，研究领域涵盖刑事诉讼制度改革、证据规则等。',
    tags: ['刑事诉讼法', '证据法', '博导']
  },
  {
    name: '罗翔',
    title: '教授',
    direction: '刑法学、刑事政策',
    intro: '著名法学教授，B站知名法学科普人，著有《刑法学讲义》等畅销法学读物，深受学生欢迎。',
    tags: ['刑法学', '法学科普', '刑事政策']
  },
  {
    name: '赵天红',
    title: '教授、博士生导师',
    direction: '犯罪学、刑事政策学',
    intro: '犯罪学研究所所长，主要研究犯罪预防、刑事政策与社区矫正。',
    tags: ['犯罪学', '刑事政策', '博导']
  },
  {
    name: '郭金霞',
    title: '教授',
    direction: '侦查学、刑事技术',
    intro: '侦查学研究所教授，研究方向包括侦查理论、刑事技术与数字取证。',
    tags: ['侦查学', '刑事技术', '数字取证']
  },
  {
    name: '张保生',
    title: '教授、博士生导师',
    direction: '证据法学、司法文明',
    intro: '证据科学研究院名誉院长，中国证据法学研究的奠基人之一，主编《证据法学》核心教材。',
    tags: ['证据法', '司法文明', '博导']
  },
  {
    name: '于冲',
    title: '教授',
    direction: '网络犯罪、刑法学',
    intro: '网络法学研究所核心成员，专注于网络犯罪理论与实践研究。',
    tags: ['网络犯罪', '刑法学', '网络法']
  },
  {
    name: '王桂萍',
    title: '教授',
    direction: '刑事诉讼法、司法制度',
    intro: '长期从事刑事诉讼法教学与研究，在司法制度改革领域有深入研究。',
    tags: ['刑事诉讼法', '司法制度']
  }
]

export const timeline = [
  { month: '现在-6月', title: '基础阶段 ← 你在这里', desc: '2026年4-6月：通读专业课教材，建立知识框架；开始英语和政治基础复习', color: '#07C160' },
  { month: '7-8月', title: '暑期强化', desc: '2026年暑假：深入研读核心教材，结合真题把握重点；暑期集中复习黄金期', color: '#0066FF' },
  { month: '9月', title: '招生简章发布', desc: '2026年9-10月：关注法大研究生院官网发布的2027年招生章程和专业目录', color: '#D4A853' },
  { month: '10月', title: '网上报名', desc: '2026年10月：研招网（yz.chsi.com.cn）网上报名，10月中下旬确认', color: '#FE2C55' },
  { month: '10-11月', title: '冲刺阶段', desc: '2026年10-11月：真题模拟、查漏补缺、背诵核心知识点、时事政治', color: '#FF8200' },
  { month: '12月', title: '2027考研初试', desc: '2026年12月下旬：全国硕士研究生统一招生考试', color: '#7A1F1F' },
  { month: '2月', title: '成绩公布', desc: '2027年2月：初试成绩公布，关注国家线和院线', color: '#4E6EF2' },
  { month: '3月', title: '复试', desc: '2027年3月：院线公布后进行复试，差额复试比例不低于120%', color: '#E74C3C' },
  { month: '4-6月', title: '录取入学', desc: '2027年4-6月：发放录取通知书，9月入学', color: '#00A1D6' }
]

export const faq = [
  {
    q: '法大刑事司法学院的刑法学和刑事诉讼法学哪个更好考？',
    a: '从近年数据看，诉讼法学的分数线通常略低于刑法学5-10分，报录比也相对较低。但两个专业都是国家重点学科，竞争都较为激烈。建议根据自己的兴趣和专长选择。'
  },
  {
    q: '跨专业考法大刑法学难度大吗？',
    a: '法大刑法学每年都有跨专业考生成功上岸。关键在于：1）吃透曲新久老师《刑法学》教材；2）法学综合一（法理+宪法）不能丢分；3）复试时展现对刑法的热情和理解。建议至少准备一年以上。'
  },
  {
    q: '法大刑事诉讼法的811科目怎么准备？',
    a: '811刑事诉讼法学以陈光中《刑事诉讼法》为核心教材，考试题型包括名词解释、简答、论述和案例分析。建议：1）反复精读教材3遍以上；2）关注司法改革热点和新修法条；3）多做历年真题把握出题规律。'
  },
  {
    q: '法大刑事司法学院复试流程是怎样的？',
    a: '复试一般在3月下旬进行，包括：1）专业课笔试；2）英语听说测试；3）综合面试。面试中导师会考察专业基础、学术潜力和表达能力。复试权重通常为30%-50%，切勿掉以轻心。'
  },
  {
    q: '法大的708法学综合一怎么复习？',
    a: '708包含法理学和宪法学两部分。法理学以舒国滢教材为主，重点是法律概念、法律推理、法的价值等；宪法学以焦洪昌教材为主，重点关注基本权利、国家机构。建议画知识导图，反复背诵核心概念。'
  },
  {
    q: '刑事司法学院有哪些值得推荐的导师？',
    a: '学院师资力量雄厚：刑法方向推荐曲新久、罗翔、于冲等教授；刑诉方向推荐汪海燕教授；证据法方向推荐张保生教授；犯罪学方向推荐赵天红教授。选导师要结合研究兴趣，可提前阅读心仪导师的论文。'
  },
  {
    q: '法大研究生的住宿和奖学金情况如何？',
    a: '法大昌平校区有研究生宿舍，4-6人间为主。学业奖学金覆盖面较广，分一等（全额学费）、二等、三等。国家助学金每月600元，还有国家奖学金、学校各类奖学金可申请。'
  },
  {
    q: '备考法大有什么好的学习资料推荐？',
    a: '核心资料：1）各科指定教材；2）法大历年真题（至少近10年）；3）法考相关资料作为补充；4）关注《法学研究》《中国法学》等期刊的最新论文；5）法大老师的学术专著和论文。'
  }
]

export const studyResources = [
  {
    category: '专业课教材',
    items: [
      { name: '刑法学（第六版）- 曲新久', type: '核心教材', desc: '法大刑法考研指定教材，必须精读' },
      { name: '刑事诉讼法（第七版）- 陈光中', type: '核心教材', desc: '刑诉方向必备，考试重点出处' },
      { name: '法理学 - 舒国滢', type: '核心教材', desc: '708法学综合一指定教材' },
      { name: '宪法学 - 焦洪昌', type: '核心教材', desc: '708法学综合一指定教材' },
      { name: '民法学（第三版）- 李永军', type: '核心教材', desc: '808法学综合二指定教材' },
      { name: '证据法学（第三版）- 张保生', type: '重要参考', desc: '刑诉方向复试重点' },
    ]
  },
  {
    category: '公共课资料',
    items: [
      { name: '政治：肖秀荣1000题 + 肖四肖八', type: '必备', desc: '考研政治经典备考资料' },
      { name: '政治：徐涛核心考案', type: '推荐', desc: '配合视频课使用效果好' },
      { name: '英语一：张剑黄皮书（历年真题）', type: '必备', desc: '英语真题是最好的复习资料' },
      { name: '英语一：红宝书考研英语词汇', type: '推荐', desc: '词汇是英语的基础' },
    ]
  },
  {
    category: '学术期刊与论文',
    items: [
      { name: '《法学研究》', type: '权威期刊', desc: '法学领域最高水平期刊之一' },
      { name: '《中国法学》', type: '权威期刊', desc: '关注法大教授在该刊发表的文章' },
      { name: '《中国刑事法杂志》', type: '专业期刊', desc: '刑事法学领域核心期刊' },
      { name: '《政法论坛》', type: '学校期刊', desc: '法大主办，了解法大学术风格' },
    ]
  },
  {
    category: '线上学习平台',
    items: [
      { name: 'B站 - 罗翔说刑法', type: '免费视频', desc: '入门刑法的最佳选择' },
      { name: 'B站 - 法大研究生课程', type: '免费视频', desc: '部分法大课程录像' },
      { name: '中国知网（CNKI）', type: '论文数据库', desc: '查阅法大导师论文必备' },
      { name: '法信 - 中国法律应用数字网络平台', type: '法律数据库', desc: '查阅案例和法律法规' },
    ]
  }
]
