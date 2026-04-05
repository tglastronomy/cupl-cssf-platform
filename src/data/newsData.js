export const platforms = [
  { id: 'all', name: '全部', icon: '🌐' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕', color: '#FE2C55' },
  { id: 'bilibili', name: 'B站', icon: '📺', color: '#00A1D6' },
  { id: 'zhihu', name: '知乎', icon: '💡', color: '#0066FF' },
  { id: 'tieba', name: '贴吧', icon: '💬', color: '#4E6EF2' },
  { id: 'wechat', name: '公众号', icon: '💚', color: '#07C160' },
  { id: 'weibo', name: '微博', icon: '🔥', color: '#FF8200' },
  { id: 'douyin', name: '抖音', icon: '🎵', color: '#000000' },
]

// 后端启动后会用真实抓取数据替换
export const mockNewsItems = [
  {
    id: 1, platform: 'zhihu',
    title: '研究生想去中国政法大学刑法/刑诉，应该如何准备？',
    summary: '从专业选择、参考书目、备考时间规划到复试准备的全方位解答，多位法大在读研究生和上岸学长分享真实经验。',
    fullContent: '核心观点汇总：\n\n1. 专业选择：刑法学和刑事诉讼法学都是国家重点学科，2025年两个专业复试线均为370分。\n\n2. 核心教材：刑法方向以曲新久《刑法学》为灵魂，刑诉方向以陈光中《刑事诉讼法》为核心。\n\n3. 备考节奏：3-6月通读教材，7-8月暑期强化做真题，9-11月反复背诵冲刺。\n\n4. 2025年最新变化：法大自命题改革，法学学科精简幅度最大。2026年新增招生计划的80%投放到专业学位。',
    author: '白糖', time: '2025年最新',
    likes: 892, comments: 134,
    tags: ['备考攻略', '刑法学', '2025最新'],
    url: 'https://www.zhihu.com/question/456190820/answer/3068673098'
  },
  {
    id: 2, platform: 'zhihu',
    title: '中国政法大学刑事诉讼法学考研该怎么准备？',
    summary: '811刑事诉讼法学备考核心：教材精读+真题反复+司法改革热点关注。',
    fullContent: '刑事诉讼法学的复习核心在于教材和基础知识的扎实掌握。\n\n【核心教材】陈光中《刑事诉讼法》第七版。\n【高频考点】辩护制度（8次）、强制措施（7次）、证据规则（6次）。\n【2025年分数线】诉讼法学：总分≥370。',
    author: '法学考研指南', time: '2025年更新',
    likes: 1567, comments: 203,
    tags: ['刑事诉讼法', '811', '高频考点'],
    url: 'https://www.zhihu.com/question/451848091'
  },
  {
    id: 3, platform: 'zhihu',
    title: '中国政法大学的研究生有多难考？',
    summary: '2025年刑事司法学院刑法学和诉讼法学复试线均为370分，报录比约15:1。',
    fullContent: '【2025年最新数据】\n刑法学(030104)：总分≥370\n诉讼法学(030106)：总分≥370\n\n【报录比】刑法学统招约10人，推免比例约40%。刑事诉讼法2024年扩招至24人。\n\n【2026年重大变化】自命题改革、专业学位扩招、刑法学纳入援藏计划。',
    author: '法学教育观察', time: '2025年3月更新',
    likes: 3456, comments: 289,
    tags: ['考研难度', '2025分数线', '2026新政策'],
    url: 'https://www.zhihu.com/question/313675188'
  },
  {
    id: 4, platform: 'bilibili',
    title: '中国法制史 | 中国政法大学 张晋藩教授 64讲完整版',
    summary: '法大顶级教授张晋藩主讲的中国法制史完整课程录像。',
    author: '法学资料库', time: '持续更新',
    likes: 45000, comments: 2300,
    tags: ['法制史', '法大课程', '张晋藩'],
    url: 'https://www.bilibili.com/video/BV1ue4y1z75e/'
  },
  {
    id: 5, platform: 'bilibili',
    title: '2025年法考客观题精讲 | 刑法 众合柏浪涛 字幕完结版',
    summary: '117集完整刑法精讲，法考+考研通用。',
    author: '法考资料站', time: '2025年最新',
    likes: 89200, comments: 4500,
    tags: ['刑法', '法考', '柏浪涛'],
    url: 'https://www.bilibili.com/video/BV1r8mxYNECZ/'
  },
  {
    id: 6, platform: 'xiaohongshu',
    title: '法大刑法学上岸经验｜从双非到法大390+',
    summary: '本科双非法学专业，一战上岸法大刑法学，初试390+复试第三。分享备考时间线、用书、踩坑经历。',
    fullContent: '【时间安排】\n3-6月基础阶段：通读曲新久《刑法学》+舒国滢《法理学》+焦洪昌《宪法学》\n7-8月强化阶段：暑假留校每天10小时做真题\n9-11月冲刺：反复背诵+模拟考试\n12月：肖四肖八+专业课第三轮\n\n【参考书心得】\n曲新久的《刑法学》是灵魂教材，至少读5遍。',
    author: '法学小透明', time: '最近',
    likes: 2341, comments: 156,
    tags: ['考研经验', '刑法学', '上岸'],
    url: 'https://www.xiaohongshu.com/search_result?keyword=%E6%B3%95%E5%A4%A7%E8%80%83%E7%A0%94%20%E5%88%91%E6%B3%95%E5%AD%A6%20%E4%B8%8A%E5%B2%B8'
  },
  {
    id: 7, platform: 'xiaohongshu',
    title: '法大刑诉复试现场实录｜面试真题+全流程',
    summary: '面试分三个环节：英语口语+专业问答+综合面试，分享我的复试全过程。',
    fullContent: '【英语口语5分钟】先英文自我介绍2分钟，然后问了两个英文问题。\n【专业课问答15分钟】抽题+追问，我抽到非法证据排除规则。\n【综合面试5分钟】问了毕业论文选题、未来研究兴趣。\n\n建议：英语口语提前准备，关注司法改革热点，读几篇心仪导师论文。',
    author: '刑诉上岸er', time: '最近',
    likes: 3456, comments: 278,
    tags: ['复试经验', '面试真题', '刑事诉讼法'],
    url: 'https://www.xiaohongshu.com/search_result?keyword=%E6%B3%95%E5%A4%A7%20%E5%A4%8D%E8%AF%95%20%E5%88%91%E4%BA%8B%E8%AF%89%E8%AE%BC%E6%B3%95'
  },
  {
    id: 8, platform: 'xiaohongshu',
    title: '708法学综合一背诵框架（法理+宪法）',
    summary: '花两个月整理的背诵框架，法理学按法律本体论-价值论-方法论框架梳理。',
    fullContent: '【法理学框架】\n一、法律本体论\n二、法律价值论\n三、法律方法论\n四、法律运行论\n五、法律发展论\n\n【宪法学框架】\n一、宪法基本理论\n二、基本权利\n三、国家机构\n四、宪法实施与保障\n\n每个知识点标注了真题出现次数。',
    author: '背书达人', time: '最近',
    likes: 5678, comments: 432,
    tags: ['背诵框架', '法理学', '宪法学', '708'],
    url: 'https://www.xiaohongshu.com/search_result?keyword=%E6%B3%95%E5%A4%A7%20708%20%E8%83%8C%E8%AF%B5%E6%A1%86%E6%9E%B6'
  },
  {
    id: 9, platform: 'xiaohongshu',
    title: '在法大读研是什么体验？研一日常分享',
    summary: '研一课程比较多，有刑法专题研究、犯罪学、刑事政策等，上课以研讨为主。',
    fullContent: '导师每两周开一次组会，指导论文选题。同学们背景多元，学术氛围很好。最近法大请了实务界大咖做讲座，收获很大。',
    author: '法大在读小姐姐', time: '最近',
    likes: 4230, comments: 312,
    tags: ['读研体验', '日常分享', '校园生活'],
    url: 'https://www.xiaohongshu.com/search_result?keyword=%E6%B3%95%E5%A4%A7%20%E8%AF%BB%E7%A0%94%20%E6%97%A5%E5%B8%B8'
  },
  {
    id: 10, platform: 'wechat',
    title: '央视报道 | 法大研究生招生工作改革新举措',
    summary: '自命题科目大幅精简，新增招生计划80%投放专业学位。',
    author: '澎湃新闻', time: '2025年',
    likes: 8900, comments: 1200,
    tags: ['央视报道', '招生改革', '重大变化'],
    url: 'https://m.thepaper.cn/newsDetail_forward_32222055'
  },
  {
    id: 11, platform: 'zhihu',
    title: '中国政法大学刑法学考研经验及备考指导',
    summary: '详细的刑法学备考指南，含参考书优先级、真题使用方法。',
    author: '法大学长说', time: '2025年更新',
    likes: 4500, comments: 670,
    tags: ['刑法学', '备考指导', '参考书'],
    url: 'https://zhuanlan.zhihu.com/p/371458390'
  },
  {
    id: 12, platform: 'zhihu',
    title: '非法本考中国政法大学研究生的难度？',
    summary: '非法学本科跨考法大的真实难度分析，附成功案例。',
    author: '跨考成功者', time: '2025年',
    likes: 1890, comments: 234,
    tags: ['跨考', '非法本', '难度分析'],
    url: 'https://www.zhihu.com/question/38127643'
  },
]

export const newsCategories = [
  { id: 'all', name: '全部动态' },
  { id: 'experience', name: '上岸经验' },
  { id: 'policy', name: '招生政策' },
  { id: 'review', name: '复习资料' },
  { id: 'retest', name: '复试信息' },
  { id: 'life', name: '校园生活' },
  { id: 'advisor', name: '导师相关' },
]
