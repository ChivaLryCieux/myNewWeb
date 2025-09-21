import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
// 导入上面创建的常规CSS文件
import './XinshiPage.css';

const createGlowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 240, 196, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 200, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
};

export const XinshiPage: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const reportDataRef = useRef<HTMLDivElement>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const selectedObjectRef = useRef<THREE.Object3D | null>(null);

    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [panelContent, setPanelContent] = useState('');

    // Hook for managing body theme class
    useEffect(() => {
        document.body.classList.add('xinshi-theme');
        return () => {
            document.body.classList.remove('xinshi-theme');
        };
    }, []);

    // Hook for managing Three.js scene
    useEffect(() => {
        const mountNode = mountRef.current;
        if (!mountNode) return;

        let animationFrameId: number;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0); // 设置背景透明
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountNode.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xfff0c4, 1.5, 100);
        scene.add(pointLight);

        const starVertices: number[] = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        const celestialGroup = new THREE.Group();
        scene.add(celestialGroup);

        const sunGeometry = new THREE.SphereGeometry(4, 64, 64);
        const sunMaterial = new THREE.MeshStandardMaterial({
            emissive: 0xfff0c4, emissiveIntensity: 1.2, color: 0xffd700
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.userData = { isSun: true, contentId: 'data-intro' };
        celestialGroup.add(sun);

        const spriteMaterial = new THREE.SpriteMaterial({
            map: createGlowTexture(), color: 0xfff0c4, transparent: true,
            opacity: 0.8, blending: THREE.AdditiveBlending
        });
        const glowSprite = new THREE.Sprite(spriteMaterial);
        glowSprite.scale.set(18, 18, 1.0);
        sun.add(glowSprite);

        const planets: THREE.Group[] = [];
        const planetData = [
            { color: 0x87ceeb, size: 1, distance: 10, speed: 0.005, contentId: 'data-part-1' },
            { color: 0x98fb98, size: 1.2, distance: 15, speed: 0.003, contentId: 'data-part-2' },
            { color: 0xffa07a, size: 1.1, distance: 20, speed: 0.002, contentId: 'data-part-3' },
            { color: 0xdda0dd, size: 0.9, distance: 25, speed: 0.001, contentId: 'data-part-4' }
        ];

        planetData.forEach(data => {
            const planetGroup = new THREE.Group();
            const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
            const planetMaterial = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.8 });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.position.x = data.distance;
            planet.userData = { isPlanet: true, contentId: data.contentId };
            planetGroup.add(planet);

            const orbitGeometry = new THREE.TorusGeometry(data.distance, 0.05, 16, 100);
            const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            celestialGroup.add(orbit);

            (planetGroup.userData).speed = data.speed;
            celestialGroup.add(planetGroup);
            planets.push(planetGroup);
        });

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const showContentPanel = (contentId: string) => {
            const dataElement = reportDataRef.current?.querySelector(`#${contentId}`);
            if (dataElement) {
                setPanelContent(dataElement.innerHTML);
                setIsPanelVisible(true);
            }
        };

        const focusOnPlanet = (planet: THREE.Object3D) => {
            const worldPosition = new THREE.Vector3();
            planet.getWorldPosition(worldPosition);

            gsap.to(camera.position, {
                duration: 1.5,
                x: worldPosition.x > 0 ? worldPosition.x + 5 : worldPosition.x - 5,
                y: worldPosition.y,
                z: worldPosition.z + 5,
                ease: "power2.inOut",
                onUpdate: () => camera.lookAt(worldPosition),
                onComplete: () => showContentPanel(planet.userData.contentId),
            });
        };

        const onClick = (event: MouseEvent) => {
            if (isPanelVisible) return;
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(celestialGroup.children, true);

            if (intersects.length > 0) {
                const firstIntersect = intersects[0].object;
                if (firstIntersect.userData.isPlanet) {
                    selectedObjectRef.current = firstIntersect;
                    focusOnPlanet(firstIntersect);
                } else if (firstIntersect.userData.isSun) {
                    selectedObjectRef.current = null;
                    showContentPanel(firstIntersect.userData.contentId);
                }
            }
        };

        // Simplified drag detection logic
        let isDragging = false;
        const previousMousePos = { x: 0, y: 0 };
        const onMouseDown = (event: MouseEvent) => {
            isDragging = false;
            previousMousePos.x = event.clientX;
            previousMousePos.y = event.clientY;
        };
        const onMouseUp = (event: MouseEvent) => { if (!isDragging) onClick(event); };
        const onMouseMove = (event: MouseEvent) => {
            if (event.buttons === 0) return;
            isDragging = true;
            const deltaX = event.clientX - previousMousePos.x;
            const deltaY = event.clientY - previousMousePos.y;

            if (!isPanelVisible) {
                const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(
                        THREE.MathUtils.degToRad(deltaY * 0.2),
                        THREE.MathUtils.degToRad(deltaX * 0.2),
                        0, 'XYZ')
                );
                celestialGroup.quaternion.multiplyQuaternions(deltaRotationQuaternion, celestialGroup.quaternion);
            }
            previousMousePos.x = event.clientX;
            previousMousePos.y = event.clientY;
        };

        mountNode.addEventListener('mousedown', onMouseDown);
        mountNode.addEventListener('mousemove', onMouseMove);
        mountNode.addEventListener('mouseup', onMouseUp);

        const clock = new THREE.Clock();
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            sun.rotation.y += 0.001;
            planets.forEach(pg => {
                const speed = (pg.userData).speed || 0;
                pg.rotation.y = elapsedTime * speed * 0.5;
            });
            stars.rotation.y += 0.0001;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            mountNode.removeEventListener('mousedown', onMouseDown);
            mountNode.removeEventListener('mousemove', onMouseMove);
            mountNode.removeEventListener('mouseup', onMouseUp);
            if (mountNode.contains(renderer.domElement)) {
                mountNode.removeChild(renderer.domElement);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPanelVisible]);

    const handleClosePanel = useCallback(() => {
        setIsPanelVisible(false);
        const cam = cameraRef.current;
        if (cam) {
            gsap.to(cam.position, {
                duration: 1.5,
                x: 0, y: 0, z: 30,
                ease: "power2.inOut",
                onUpdate: () => cam.lookAt(0, 0, 0)
            });
        }
        selectedObjectRef.current = null;
    }, []);

    return (
        <div className="xinshi-page-container">
            <div id="canvas-container" ref={mountRef}></div>
            <div id="title-overlay">
                <h1 id="main-title">传媒革命视域下<br/>中国诗歌生态位的嬗变</h1>
                <p className="subtitle-line">兹暂客</p>
                <p className="subtitle-line">视觉传达设计与人工智能双学士学位</p>
            </div>
            <div id="instructions" style={{display: isPanelVisible ? 'none' : 'block'}}>
                <p>点击恒星/行星以阅读章节内容 | 拖动鼠标以旋转视角</p>
            </div>
            <div id="content-panel" className={isPanelVisible ? 'visible' : ''}>
                <button id="close-button" onClick={handleClosePanel}>&times;</button>
                <div className="content-body" dangerouslySetInnerHTML={{__html: panelContent}}></div>
            </div>
            <div id="report-data" style={{ display: 'none' }} ref={reportDataRef}>
                <div id="data-intro">
                    <h2>引言：从印刷机到服务器</h2>
                    <h3>媒介、记忆与诗歌的“生态位”</h3>
                    <p>本报告中，我所强调的核心概念“生态位”（Ecological
                        Niche）借用自生态学，意指一种文学体裁在特定文化环境中所扮演的功能角色、其赖以生存的传播媒介、其创作者的社会身份及其与受众的互动模式。本报告旨在论证，媒介技术的革命是驱动当今诗歌生态位嬗变的最根本动力。人类历史上，从手抄、印刷到数字网络，每一次传播革命都深刻地重塑了文化形态，改变了知识与情感的生产和传播方式。</p>
                    <p>本报告将聚焦于两次关键的传媒革命：以报刊为代表的近代印刷革命，以及当下的互联网新媒体革命。工业印刷术与西方诗歌共同催生了新诗，赋予其前所未有的形式实验与个人化表达的自由。</p>
                    <p>如今，互联网革命再一次掀起波澜，它将诗歌从纸页的束缚中解放出来，却也使其不得不遵循算法、病毒式传播和短视频内容的逻辑。</p>
                    <p className="key-sentence">报告的核心论点是：印刷革命催生了“新诗”这一现代文学体裁，并将其从古典诗词的吟唱传统中剥离，使其成为一种精英化的、以阅读为核心的文本艺术；而互联网革命则通过其“多模态”和“强互动”的特性，正在将诗歌的生态位重新归还给“歌”，使得流行歌手在事实上继承了传统诗人的文化功能与社会影响力。</p>
                    <p>本报告将遵循四部分结构，首先回溯近代传媒革命对新诗的塑造作用，以此为历史参照，引出当下的互联网传媒革命；其次，通过对比古代诗人与当代流行歌手的文化角色，提出“诗歌生态位被流行歌手占据”的论点；再次，通过深入剖析“诗歌同源”的历史事实，对前述论点进行深化；最后，在综合分析的基础上，展望诗歌在未来与流行音乐融合发展的可能性，即“文学性的流行歌曲”将成为新时代诗歌的重要形态。</p>
                </div>
                <div id="data-part-1">
                    <h2>第一章：印刷资本主义与“新诗”的诞生</h2>
                    <h3>1.1 媒介革命与文学革命的共振</h3>
                    <p>清末民初，西方印刷技术与报刊体制的引入，不仅是一次技术革新，更是一场深刻的社会思想传播方式的革命。报章作为读书人与社会发生联系的关键媒介，承担起推介西学、阐发新思想的重任，极大地改变了中国的文体生态。这一媒介基础为即将到来的文学革命铺平了道路。在此背景下，梁启超、黄遵宪等人提出的“诗界革命”，已经敏锐地意识到“我手写我口，古岂能拘牵”，旧有的诗歌形式已难以承载变革时代的新思想与新感情，他们的“新歌行”体尝试，为后来的白话诗运动埋下了伏笔。</p>
                    <h3>1.2 《新青年》：白话诗的孵化器与扩音器</h3>
                    <p>1917年，胡适在《新青年》第2卷第6号上发表《白话诗八首》，与陈独秀的《文学革命论》同期刊出，这被公认为中国新诗诞生的标志。以《新青年》为核心，加之其与北京大学形成的“一校一刊”的紧密结合，迅速构筑了新文化运动的核心阵地。</p>
                    <p>《新青年》、《新潮》以及北京、上海等地的“四大副刊”，为白话新诗提供了前所未有的发表平台和公共空间，使之迅速蔚然成风，成为五四文学革命最早显示创作实绩的部门。尤其在五四运动之后，全国白话报刊数量激增至约四百种，极大地推动了白话文与新诗的普及。这些报刊的编辑，如胡适、陈独秀、鲁迅、周作人等，本身就是新文化运动的旗手。他们利用媒介“把关人”的权力，有意识地选择和推广新诗，同时猛烈攻击古文为“死文学”，从而在与旧文学的竞争中，成功夺取并主导了新的诗学话语权。</p>
                </div>
                <div id="data-part-2">
                    <h2>第二章：桂冠的易主？</h2>
                    <h3>2.1 古代诗人的文化生态位：士大夫、代言人与不朽者</h3>
                    <p>在中国传统社会，尤其是在唐宋时期，诗人占据着文化生态系统的核心位置，拥有崇高的社会地位与不可替代的文化功能。唐代诗人多为士大夫阶层，他们以诗歌为载体，实现“致君尧舜上，再使风俗淳”的政治抱负，同时也反映社会现实与民间疾苦。杜甫之所以被尊为“诗圣”，正是因为其作品中蕴含的深沉的现实主义关怀和以天下为己任的忧患意识。诗歌作为构建民族文化认同和集体情感的最高效媒介，使得诗人的作品能够超越时空，成为不朽的文化遗产。</p>
                    <p>又比如“诗魔”白居易，就连唐宣宗李忱都作诗纪念他的逝去：</p>
                    <blockquote>
                        <p>缀玉联珠六十年，谁教冥路作诗仙。</p>
                        <p>浮云不系名居易，造化无为字乐天。</p>
                        <p>童子解吟长恨曲，胡儿能唱琵琶篇。</p>
                        <p>文章已满行人耳，一度思卿一怆然。</p>
                    </blockquote>
                    <p>作为一国之君为一位诗人作悼亡诗，且称赞白居易诗作妇孺皆知、扬名四海，可谓是“国际巨星”。当时的诗人都影响力、诗作的传唱度可见一斑。</p>
                    <p>到了宋代，“以文化成天下”的国策进一步巩固了文人士大夫的中心地位。作为可供演唱的文学形式，词的兴盛使其创作者（词人）获得了巨大的社会影响力。除了本就是政坛明星的晏殊、王安石、苏轼和辛弃疾等，像柳永、李清照等无显赫政治地位者也凭此青史留名。他们的作品通过歌妓的演唱在宫廷、士大夫宴饮乃至市井勾栏中广泛流传，成为当时社会文化生活的重要组成部分，词人也因此扮演了文化宗主和风尚引领者的角色。</p>
                    <h3>2.2 新媒体时代的“桂冠诗人”：流行歌手的崛起</h3>
                    <p>进入21世纪，以互联网、智能手机和社交媒体为主导的新传播环境，彻底重塑了文化权力的版图。传播的便捷性特征，意味着大量信息向能够凝聚海量注意力的个体转移。在这一过程中，能够获得足够信任的“意见领袖”将成为新的“权力中心”。</p>
                    <p>流行歌手，特别是具备创作能力的歌手，凭借其作品与生俱来的强传播性和情感穿透力，完美地契合了新媒体的传播逻辑。他们通过微博等社交平台与数以千万计的粉丝直接互动，构建起庞大的线上社群，其文化影响力远远超过了当代的任何一位纯文学诗人。一个典型的例子是诗人余秀华，她被诗刊社力荐、借助微博和微信公众号走红，成为备受关注的“文学博主”。然而，其微博粉丝数（143万），与薛之谦（超5700万）等一线流行歌手相比，依然存在着数量级的巨大鸿沟。这直观地反映出，在新的媒介生态中，诗歌的桂冠似乎已经易主。</p>
                    <p>为了更清晰地展示这一权力转移，下表对比了唐宋诗人与当代流行歌手在文化生态位上的关键指标。</p>
                    <table>
                        <thead>
                        <tr>
                            <th>指标</th>
                            <th>唐宋诗人</th>
                            <th>当代流行歌手</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>主要媒介</td>
                            <td>手抄本、石刻、口头吟诵</td>
                            <td>数字音频/视频、流媒体、短视频平台、社交媒体</td>
                        </tr>
                        <tr>
                            <td>受众规模与构成</td>
                            <td>士大夫阶层、宫廷、部分市民</td>
                            <td>跨阶层、跨年龄、全球化大众</td>
                        </tr>
                        <tr>
                            <td>社会地位</td>
                            <td>文化精英、道德楷模、潜在官员</td>
                            <td>商业明星、意见领袖、青年偶像</td>
                        </tr>
                        <tr>
                            <td>经济模式</td>
                            <td>官俸、权贵资助</td>
                            <td>版税、演出、代言、粉丝经济</td>
                        </tr>
                        <tr>
                            <td>文化功能</td>
                            <td>记录历史、针砭时弊、言志抒情、社交媒介</td>
                            <td>反应时代、凝聚社群、表达集体情绪、定义潮流、提供情感慰藉</td>
                        </tr>
                        </tbody>
                    </table>
                    <h3>2.3 传播机制的根本差异</h3>
                    <p>这种文化权力的转移，根源在于传播机制的根本性变革。纯文本新诗的传播高度依赖于文字识读能力和精英化的教育体系。而流行歌曲借助新媒体，先是MP3等音乐播放器、再是网易云音乐等音乐平台、后是当下以抖音为代表的短视频平台，通过“歌词+音乐+视觉+互动”的多模态传播，极大地降低了接受门槛，实现了全民化的覆盖。</p>
                    <p>抖音等平台的算法推荐和用户参与机制（如使用同款背景音乐进行二次创作）能够迅速制造出“热歌”，形成几何级数的病毒式传播。一首歌曲的片段可以在短短数日内触达上亿用户。这种传播效能，是任何依赖文字阅读的纯文学诗歌所无法想象的。因此，流行歌曲的歌词，已无可争议地成为当代社会中覆盖面最广、影响力最大、最能体现大众情感的“诗性文本”。文学性与音乐性的双重感官刺激，显然获得了更多的共鸣。</p>
                </div>
                <div id="data-part-3">
                    <h2>第三章：诗与歌的古老盟约</h2>
                    <h3>3.1 诗歌本身的同一性</h3>
                    <p>“诗”与“歌”本来就不是两种相互分离甚至对立的艺术形式。本部分旨在说明，从更宏大的历史视野来看，当今流行歌曲承载诗歌的核心功能，并非一种外来的“占据”或“侵蚀”，而是诗歌在新的媒介条件下，向其“歌唱”本源的一次盛大“回归”。《尚书・舜典》有言：“诗言志，歌咏言，声依永，律和声”，诗与歌的同一，本就是中国乃至世界文艺的古老传统。</p>
                    <h3>3.2 案例一：宋词——可供传唱的文学高峰</h3>
                    <p>宋词是中国文学史上的高峰，但其本质并非案头默读的文本，而是活色生香的“音乐文学”。词的创作被称为“填词”，即依照既有的曲谱（词牌）来填充文辞。词牌名，如《念奴娇》、《水调歌头》，本身就规定了作品的音乐旋律、句式长短和节奏韵律，是词的音乐基因。</p>
                    <p>宋词的生命在于演唱，其主要传播方式是“听”，而非“读”。它的生态场景与今天的流行音乐文化高度相似：在官私宴饮的社交场合，由专业的歌妓进行表演，以佐酒助兴、烘托气氛。柳永的词之所以能风靡一个时代，正是因为其作品高度契合市井勾栏的演唱需求，以至于有“凡有井水饮处，即能歌柳词”的盛况。这一案例雄辩地证明，在中国文学史上，诗歌最辉煌的成就之一，其生态位与今天的流行音乐几乎完全重合：由精英文人（词人/作词人）创作，交由专业表演者（歌妓/歌手）演唱，在社交娱乐场合（宴席/流媒体平台）中传播，并获得跨阶层的喜爱。只是问题在于：由于多种原因，如古代落后的媒介储存技术、对音乐文化的漠视，未能保留词的“唱法”，只保留了“歌词”。</p>
                    <h3>3.3 案例二：《国际歌》与《我的祖国》——音乐赋能的社会动员力</h3>
                    <p>《国际歌》是诠释诗歌与音乐结合力量的经典范例。其歌词原作是法国诗人欧仁·鲍狄埃的诗作，本身充满了战斗的激情和崇高的理想，具有诗的结构与力量。后来，这些文字与皮埃尔·狄盖特谱写的激昂旋律相结合时，它才真正获得了响彻全球、动员亿万无产者投身革命的巨大能量。如果写的正经的诗可以成为歌词，便已经指明诗与歌词的创作过程存在潜在的同一性。</p>
                    <p>又比如乔羽作词、刘炽作曲的经典歌曲《我的祖国》。这首歌创作于 1956 年，是电影《上甘岭》的插曲：</p>
                    <blockquote>
                        <p>一条大河波浪宽，风吹稻花香两岸。</p>
                        <p>我家就在岸上住，听惯了艄公的号子，看惯了船上的白帆。</p>
                    </blockquote>
                    <p>开篇写景的诗性语言将家国情怀融入日常景象，通过 “大河”“稻花”“号子”
                        等具象意象，让听众感受到祖国的温暖与厚重，成为传唱半个多世纪的经典之作。这两首歌，前者本身歌词就是诗作，后者则是纯粹的歌词（从创作目的来看），但二者的传播史都证明，音乐的翅膀能让诗歌的理念飞得更高、更远，抵达最广泛的人群。这恰恰呼应了《诗经》中的“风、雅、颂”所承担的政治、社会与仪式功能，即诗歌通过“歌唱”的形式参与并塑造社会进程。</p>
                    <h3>3.4 案例三：鲍勃·迪伦——诺贝尔奖认可的“行吟诗人”</h3>
                    <p>2016年，美国音乐人鲍勃·迪伦荣获诺贝尔文学奖，瑞典学院的官方授奖词是表彰他“在伟大的美国歌曲传统中创造了新的诗意表达”
                        。这一决定在全球范围内引发了关于“文学”边界的激烈讨论，但也为本报告的论点提供了最强有力的国际佐证。</p>
                    <p>瑞典学院常任秘书萨拉·达尼乌斯在解释该决定时，特意援引了古希腊的荷马与萨福为例，指出他们的史诗和抒情诗在诞生之时，本就是与音乐相伴，为表演而生的口头文学。这与中国“诗乐舞”三位一体的传统不谋而合。诺贝尔奖将桂冠授予一位歌手，实际上是世界最高文学殿堂对“歌词即诗”这一古老观念的权威追认，它宣告了在当代社会，最具影响力和文学价值的“诗人”，完全可以以“歌手”的身份存在。近年来，中国也有类似的有意识的跨界，如韩红最近出版的诗集《我与蒙面诗人》。其文学性暂且不论，但已经指明了诗歌合流的可能。</p>
                    <h3>3.5 案例四：陈粒《望穿》、马雁水泥柱体与昌耀《紫金冠》的比较：歌词中可有的文学性</h3>
                    <p>歌手陈粒，毕业于上海对外经贸大学，其歌曲《望穿》歌词如下：</p>
                    <blockquote>
    <pre>
      {/* 关键：将所有文本用花括号和反引号包裹起来 */}
        {`云沉重的脚踩在粘稠的风里
雨水舍不得天空不愿意落地
平原永恒地延伸到回忆边际
时间扬起尘沙看不见你在哪

云沉重的脚踩在粘稠的风里
雨水舍不得天空不愿意落地
平原永恒地延伸到回忆边际
日月模糊悬挂照不到你在哪

......

你是不是在云的脚下，在等雨落下
你是不是在平原尽头望穿海峡
你是不是在阴天出发，在车窗画画
你是不是在列车尾端告别晚霞`}
    </pre>
                    </blockquote>
                    <p>开篇字数整齐，形如马雁“水泥柱体”，而副歌部分则运用反复、排比，又如同昌耀《紫金冠》中的笔法。我无意在此分析这首歌曲在文学上如何，而是意在阐明，歌词本就可以运用诗歌的技法，使之在脱离音乐后与现代诗无异。只是囿于流行歌曲发展早期这个阶段的固有弊端，而未能落实。</p>
                    <p>该弊端在于，早期的，包含现在的，歌手，大都缺乏相应的文学教育经理背景，甚至连音乐背景都缺乏，如薛之谦毕业于格里昂酒店管理学院，周深则毕业于乌克兰利沃夫国立立谢科音乐科学院声乐歌剧专业。但也有一些歌手有着优秀的教育背景，在歌手身份之外，同时也获得了一定的文化地位，比如毕业于复旦大学法语系的尚雯婕。2013
                        年，尚雯婕担任中法文化交流大使，并献唱中法国宴。2019
                        年，她荣获法国艺术与文学骑士勋章。他们中的大多数本来只是“演唱者”而非“填词人”，却因为传媒革命获取了古代“填词人”，即诗人的社会地位。而兼有“填词人”身份的歌手，或缺乏一定的文学素养的填词人，夹杂一些社会观念等因素，其作品也未被视作能登上大雅之堂的艺术作品。这也与宋词早期不入流、格调低的发展路径类似。</p>
                    <h3>3.6 新媒体：诗歌同源的现代黏合剂</h3>
                    <p>如果否认诗歌的音乐性，则割断了语言与文字的辩证关系，那诗就成了仅仅依靠识别进而想象的一组符号，甚至可以说与涂鸦无异。如果承认诗歌的音乐性，那就是承认诗与歌的同一，也必然导出这样的结论：流行歌曲里也有文学意义上的诗意。只是其中依然有“诗意”含量高低的问题。如此一来，“是不是”的问题就变成了“好不好”的问题。毕竟李白的诗和乾隆的诗也有“诗意”含量的差异，而歌手中目前也只有鲍勃迪伦获得诺贝尔文学奖。</p>
                    <p>没有配乐的现代诗是牺牲了音乐性换取更加自由的文学性，而流行音乐则向音乐性妥协，主动接受配乐带来的“格律”限制，失去了这种自由，也自然损失了一定的、潜在的文学性。但从市场反响来看，以一定的音乐性换取文学性收益是极大的，反而更难打动大众的心，获得共鸣。</p>
                    <p>印刷术催生新诗，新诗也过度依赖印刷术，忘记了古代诗歌同一的传统，完全着眼于报刊上安安静静的文字。如果说印刷术的发明在某种程度上导致了诗与歌的分离，那么当下的新媒体技术，则成为了促使二者再度融合的强力黏合剂。以流媒体音乐平台和短视频平台为代表的新媒体，其核心是多模态、视听结合的传播和即时互动。这种媒介特性天然地成为了“歌”的扩音器和放大器。它使得“被演唱的诗”（歌词）相比于“被阅读的诗”（文本），拥有了指数级的传播优势。</p>
                    <p>这种媒介环境的变迁，也正在深刻地重塑“文化素养”的定义。传统的文化素养核心是阅读和阐释复杂书面文本的能力。而在新媒体时代，文化素养扩展为创造和解读多模态内容（文本、图像、音频、视频）的能力。一首“文学性流行曲”的成功，说明了当代最有效的诗意交流，需要创作者和受众都具备这种新的、更广阔的文化素养。要完全“读懂”一首现代“诗歌”，不仅要理解其字面歌词，更要能感受其旋律、体察演唱者的情绪，并理解其背后关联的社会语境。这是一种立体的、沉浸式的“阅读”。因此，诗歌的生态位不仅在回归其“歌唱”的本源，其对创作者和欣赏者的能力要求，也在媒介的驱动下悄然升级。</p>
                </div>
                <div id="data-part-4">
                    <h2>第四章：未来的回响</h2>
                    <h3>4.1 综合论述：生态位的重构而非消亡</h3>
                    <p>综合前文分析，本报告的结论是：中国诗歌的生态位在互联网时代正在经历一场深刻的、根本性的重构。诗歌的核心功能——以凝练的语言承载个体情感与集体记忆——依然稳固，但其实现形式、创作者身份和传播渠道已经发生了翻天覆地的变化。在新的媒介生态中，诗歌的生命力将主要体现在与音乐的深度融合之中，即“更有文学性的流行歌曲”。这既是向“诗歌同源”古老传统的创造性回归，也是对新媒体环境的积极适应。</p>
                    <h3>4.2 未来趋势的现实佐证</h3>
                    <p>这一趋势并非空想，而已在当下的文化实践中获得诸多现实佐证。“新古典主义”的流行（以方文山为例）：词人方文山为歌手周杰伦创作的一系列“中国风”歌曲，是文学性与流行性成功结合的典范。如《青花瓷》、《东风破》、《兰亭序》等作品，其歌词在遣词造句、意象营造和典故运用上，展现了深厚的古典文学功底。然而，这些富含古典美学的文本，并非被束之高阁，而是与现代R&B、摇滚等曲风完美融合，通过周杰伦的演唱，成为传遍大江南北的流行金曲。这一现象雄辩地证明，高文学性的歌词不仅没有成为传播的障碍，反而能够赋予流行音乐独特的文化魅力和巨大的市场价值，并引领一种文化潮流。“现实主义”的共鸣（以毛不易、吴青峰为例）：毛不易的歌词以其贴近生活的叙事性和对现实的白描，精准地触动了无数普通人的心弦，扮演了“为时代画像，为人民立传”的角色。而苏打绿乐团主唱吴青峰的创作，则以其深厚的文学底蕴、对社会议题的批判性介入以及对人性幽微之处的关怀，展现了流行歌词所能达到的思想深度与诗性美感。这些案例表明，流行歌词这一体裁，完全有能力承载严肃的文学主题和深刻的社会关怀，延续诗歌的现实主义传统。这些成功的文化实践清晰地表明：在供给侧，华语乐坛拥有将经典诗歌文本转化为优质流行音乐的创作能力；在需求侧，广大观众对这种兼具文学性与音乐性的高品质文化产品，抱有强烈的消费热情。这为“文学性流行曲”的蓬勃发展，提供了坚实的市场和文化基础。</p>
                    <h3>4.3 21世纪的“诗人”：一个协作的、多媒介的身份</h3>
                    <p>基于以上分析，21世纪的“诗人”形象正在被重新定义。他/她很可能不再是传统意义上那个孤身在书斋中进行纯文字创作的作家，而更可能是一个协作网络中的关键节点。这个网络囊括了作词人、作曲家、编曲家、歌手、MV导演、社交媒体运营者等多元角色。在这个协作体系中，“作词人”直接对应了传统诗人的角色，但其最终作品的呈现和影响力，则依赖于整个团队的共同创造。</p>
                    <p>相应地，“诗集”的形态也在发生改变。它可能不再是一本纸质书籍，而是一张精心制作的数字专辑、一个融合了视觉艺术的音乐视频（MV），甚至是一系列在短视频平台引发大众模仿、解构和再创作的“文化Meme”。诗歌的文学性，将通过旋律的起伏、画面的渲染和大众的互动参与，得到更加立体、丰富和沉浸式的呈现与解读。</p>
                    <h3>4.4 结论：在流动的媒介中，诗歌生生不息</h3>
                    <p>诗歌本生就自带生命力。但与配了音乐的流行歌曲相比，纯文本的、依靠朗诵发声的新诗的音乐性太弱了。大众传媒的第一次革命报刊催生了新诗，第二次革命新媒体互联网则催生了流行歌曲。新诗居于文化正统地位，而吊诡的是，现如今的新诗所代表的诗歌俨然变成了一种小众爱好、一种时尚单品、一种传播面窄的文化体验。在中国识字率逐渐升高、已经将近百分之百的今天，这是一种反常。诗歌失去生命力了吗？没有，因为流行歌曲正在诗歌的生态位上茁壮地生长着。</p>
                    <p>21世纪才二十五年。一千三百多年前“王杨卢骆当时体，轻薄为文哂未休。尔曹身与名俱灭，不废江河万古流。”的诗句依然亮堂。现在的人认为流行歌曲“俗”、难登大雅，或许有的确实存在这种现象，但并不意味着未来也如此。随着中国经济文化的复兴，未来将会出现怎样的文化巨擘仍然拭目以待。若是中国再复出白居易那样国内外闻名的文化领袖，恐怕有很大概率会是一个精通文学与音乐的歌手。媒介形态的演进是文化变迁的底层驱动力。中国诗歌的生态位，正在经历一场从“印刷-文本”时代向“数字-声像”时代的根本性迁移。这并非预示着诗歌的衰落或死亡，恰恰相反，这是其强大生命力的生动体现。历史已经证明，只要人类还保有以凝练的、富有韵律的语言来抒发最深刻的情感、记录最鲜活的时代、构建最广泛的共鸣这一根本需求，诗歌就永远不会消亡。它只会不断地寻找并适应那个时代最高效、最具影响力的媒介形态，并以新的面貌生生不息。</p>
                    <p className="key-sentence">在当下这个由算法、流量和多媒体主导的互联网时代，更有文学性的流行歌曲，正是诗歌在“适者生存”的法则下，选择的最佳生态位。它继承了诗的灵魂，插上了歌的翅膀，在新的媒介革命浪潮中，继续履行着它古老而不朽的文化使命。</p>
                    <p>文学院的学生或许也该学点音乐，歌手们则要多读读书。</p>
                </div>
            </div>
        </div>
    );
};