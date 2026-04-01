import artworkImage from '../assets/images/1-1.png';
import avatarImage from '../assets/images/avatar.png';
import image2_1 from '../assets/images/2-1.jpg';
import image2_2 from '../assets/images/2-2.jpg';
import image2_3 from '../assets/images/2-3.jpg';

export const fixedOverlayContent = {
    topRight: '千丈阴崖百丈溪 孤桐枝上凤偏宜',
    bottomLeft: 'TO LEARN AND CREATE,\nFOR A MEANINGFUL LIFE AND A BETTER WORLD',
    bottomRight: 'chivalrycieux@qq.com 2025',
};

export const heroContent = {
    title: '兹暂客',
    image: artworkImage,
    imageAlt: 'Artwork',
};

export const stackCardContent = [
    { text: 'ATTENDED ZUNYI AEROSPACE SENIOR HIGH SCHOOL', className: 'stack-card-1' },
    { text: "NOW IN THE DUAL BACHELOR'S DEGREE PROGRAM", className: 'stack-card-2' },
    { text: 'OF VISUAL COMMUNICATION DESIGN AND AI', className: 'stack-card-3' },
    { text: 'AT TONGJI UNIVERSITY, SHANGHAI', className: 'stack-card-4' },
];

export const typographyBackgroundLines = [
    'LITERATURE',
    'POETRY OR DESIGN',
    'ARTIFICIAL INTELLIGENCE',
    'THE FUTURE',
];

export const typographyForegroundLines = [
    'tempsyche',
    'Je suis qui je suis',
    'Ich bin wer ich bin',
    'I am who i am',
];

export const aboutContent = {
    title: 'About Me',
    image: avatarImage,
    imageAlt: 'Avatar',
    text: '不能像器物一样只有一种功用。我在这里。',
};

export const marqueeText =
    'ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ';

export interface RegardingSectionContent {
    id: string;
    englishTitle: string;
    englishBody: string;
    chineseTitle: string;
    chineseBody: string;
    image: string;
    reverse?: boolean;
}

export const regardingSections: RegardingSectionContent[] = [
    {
        id: 'regarding-literature',
        englishTitle: 'Regarding Literature',
        englishBody:
            `I began writing classical Chinese regulated verse at age 13, simultaneously composing and studying texts. My greatest inspirations came from the Book of Songs, Yuefu poetry, and Xin Qiji. Some of my poems have been published. I started studying philosophy in high school, but only after extensive exploration of politics, economics, and history. My philosophical journey began with S.T. Stumpf's thick History of Western Philosophy, progressing all the way to Lacanian psychoanalysis. The spirit of Marx has profoundly influenced me. By university, my prose writing finally broke free from the shackles of established writing styles, as I practiced the principle that "there is no fixed form in writing, with vividness being the most valuable." During moments of inspiration, I even won Tongji University's top literary prize. However, I no longer read poetry, philosophy, or prose. Currently, I am focusing on learning fiction writing.`,
        chineseTitle: '关于文学',
        chineseBody:
            '我13岁开始写中国古典的格律诗，边写边读，最爱《诗经》乐府辛弃疾。诗作偶有发表。高中开始学哲学，但先广泛涉猎政治经济与历史，而后才从斯通普夫厚厚的《西方哲学史》开始，一直学到拉康精神分析。前人的气概对我影响颇深。到大学之后，散文创作不再受桎梏，躬行"文无定格，贵在鲜活"之道。灵光乍现的时候，也曾得过同济的第一。诗歌、哲学、散文，现在都不读了。现在学习小说。',
        image: image2_1,
    },
    {
        id: 'regarding-design',
        englishTitle: 'Regarding Design',
        englishBody:
            'Lacking innate musical talent or foundational fine arts training, I can only progress in design through persistent ideation and practice. While I have created numerous posters in graphic design, most have been ordinary, though I did produce main visuals for several international academic conferences. My video editing skills remain underdeveloped, and creating animations would likely be inefficient. Fortunately, my philosophical background provides theoretical grounding for discussing semiotics and signifiers in design thinking. Game design is currently in my learning phase - its connection with coding particularly fascinates me, and I look forward to exploring this field. As for front-end web design - interactive posters and user-controlled animations - the results of my work are presented here before you.',
        chineseTitle: '关于设计',
        chineseBody:
            '鄙人无音韵之天赋，亦无美术之基础，设计一途，只能靠多想多做。平面设计，海报做了不少，大都普普通通，好在曾为几场国际会议做过主视觉。视屏剪辑，学艺不精，要做动画，恐怕效率难以差强人意。设计思维，符号与能指，幸亏有些哲学基础，可供我夸夸其谈。游戏设计尚在学习中，大可期待一番。至于前端网页设计——可交互的海报，由你控制的动画——我所做的，就在你眼前了。',
        image: image2_2,
        reverse: true,
    },
    {
        id: 'regarding-ai',
        englishTitle: 'Regarding Artificial Intelligence',
        englishBody:
            ' Calculus, linear algebra, and probability theory formed my initial mathematical foundation. Discrete mathematics, signal systems, and optimization theory became essential tools for deeper exploration. Combined with computer science and programming languages, these enabled my entry into machine learning. By integrating matrix multiplication with non-affine functions, I constructed artificial neural networks. Utilizing Gradient Boosting Decision Trees and Multilayer Perceptrons, I have won awards in domestic and international competitions. Later, I expanded into financial machine learning, quantitative finance, blockchain, and Web3 technologies. Future advanced studies remain open for further exploration.',
        chineseTitle: '关于人工智能',
        chineseBody:
            '微积分、线性代数、概率论，都是最开始掌握的基础。离散数学、信号与系统、最优化理论，都是深入其中必须借助的工具。再加上计算机科学与编程语言，就可以进入机器学习的世界。再结合矩阵乘法与非仿射函数，就可以搭建起人工神经网络。借助梯度提升决策树与多层感知机，我也在国内国外各比赛、平台拿过一些奖。如今在涉猎时序分析、量化金融与区块链。更深入的学习，就交给未来了。',
        image: image2_3,
    },
];
