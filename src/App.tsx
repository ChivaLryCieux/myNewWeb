import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import MapComponent from './components/MapComponent';

import artworkImage from './assets/images/1-1.png';
import avatarImage from './assets/images/avatar.png'; 
import image2_1 from './assets/images/2-1.jpg';
import image2_2 from './assets/images/2-2.jpg';
import image2_3 from './assets/images/2-3.jpg';
import image3_1 from './assets/images/3-1.png';
import image3_2 from './assets/images/3-2.png';
import image3_3 from './assets/images/3-3.png';

// 魔方页面悬浮文字组件
const FloatingText: React.FC<{
    targetSectionId: string;
    lines: string[]; // 传入的文字行数组
}> = ({ targetSectionId, lines }) => {
    const floatingRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    // 初始化目标元素引用
    useEffect(() => {
        targetRef.current = document.getElementById(targetSectionId) as HTMLDivElement;
        handlePositionUpdate();
    }, [targetSectionId]);

    // 监听滚动事件
    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => setScrollY(window.scrollY));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 处理位置更新
    const handlePositionUpdate = () => {
        const floatingEl = floatingRef.current;
        const targetEl = targetRef.current;
        if (!floatingEl || !targetEl) return;

        const targetRect = targetEl.getBoundingClientRect();
        const targetTop = targetRect.top + window.scrollY;
        const targetBottom = targetTop + targetRect.height;
        const floatingHeight = floatingEl.offsetHeight || lines.length * 30; // 动态计算高度
        const stopOffset = targetRect.height - floatingHeight - 20;
        const currentScroll = scrollY;
        const scrollInTarget = currentScroll - targetTop;

        floatingEl.style.position = '';
        floatingEl.style.top = '';
        floatingEl.style.left = '';

        if (currentScroll < targetTop) {
            floatingEl.style.position = 'absolute';
            floatingEl.style.top = '20px';
            floatingEl.style.left = '20px';
        } else if (currentScroll >= targetTop && currentScroll < targetBottom - floatingHeight) {
            if (scrollInTarget < stopOffset) {
                floatingEl.style.position = 'fixed';
                floatingEl.style.top = '20px';
                floatingEl.style.left = `${targetRect.left + 20}px`;
            } else {
                floatingEl.style.position = 'absolute';
                floatingEl.style.top = `${stopOffset}px`;
                floatingEl.style.left = '20px';
            }
        } else {
            floatingEl.style.position = 'absolute';
            floatingEl.style.top = `${stopOffset}px`;
            floatingEl.style.left = '20px';
        }
    };

    // 滚动和窗口大小变化时更新位置
    useEffect(() => {
        handlePositionUpdate();
    }, [scrollY, lines]); // 当文字内容变化时重新计算

    useEffect(() => {
        const handleResize = () => handlePositionUpdate();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [lines]);

    return (
        <div
            ref={floatingRef}
            style={{
                pointerEvents: 'none',
                zIndex: 100,
                lineHeight: 1.6, // 行高
            }}
        >
            {lines.map((line, index) => (
                // 用React.Fragment包裹每行和换行符（最后一行不需要换行）
                <React.Fragment key={index}>
          <span
              style={{
                  color: 'white',
                  fontWeight: 200,
                  // 奇数行（index从0开始，所以用index % 2 === 0判断）使用字体A
                  // 偶数行使用字体B
                  fontFamily: index % 2 === 0
                      ? 'ke, sans-serif'  // 奇数行字体
                      : 'serif, helvetica',  // 偶数行字体
                  fontSize: index % 2 === 0
                      ? '2rem'  // 奇数行字大小
                      : '1.5rem',  // 偶数行字大小
              }}
          >
            {line}
          </span>
                    {/* 最后一行不添加换行 */}
                    {index !== lines.length - 1 && <br />}
                </React.Fragment>
            ))}
        </div>
    );
};

const App: React.FC = () => {
    const rubiksCubeRef = useRef<HTMLDivElement>(null);
    const rubiksCubeAppRef = useRef<any>(null);
    const [literatureShifted, setLiteratureShifted] = useState(false);
    const [designShifted, setDesignShifted] = useState(false);
    const [aiShifted, setAiShifted] = useState(false);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const scrollAnimation = gsap.to(".top-layer", {
            y: "-100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".reveal-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            },
        });

        const RubiksCubeApp = {
            scene: null as THREE.Scene | null,
            camera: null as THREE.PerspectiveCamera | null,
            renderer: null as THREE.WebGLRenderer | null,
            controls: null as OrbitControls | null,
            composer: null as EffectComposer | null,
            rubiksCube: null as THREE.Group | null,
            cubeletOriginalPositions: [] as THREE.Vector3[],
            animationFrameId: null as number | null,
            container: null as HTMLElement | null,
            boundOnWindowResize: null as (() => void) | null,

            init: function(containerElement: HTMLElement) {
                this.container = containerElement;
                this.scene = new THREE.Scene();

                this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
                this.camera.position.z = 15;
                this.camera.position.y = 5;

                this.renderer = new THREE.WebGLRenderer({ antialias: true });
                this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.container.appendChild(this.renderer.domElement);

                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.enableZoom = false;

                const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
                this.scene.add(ambientLight);
                const pointLight = new THREE.PointLight(0xffffff, 1.5, 200);
                pointLight.position.set(10, 15, 10);
                this.scene.add(pointLight);

                this.createRubiksCube();

                const renderScene = new RenderPass(this.scene!, this.camera!);
                const bloomPass = new UnrealBloomPass(new THREE.Vector2(this.container.clientWidth, this.container.clientHeight), 1.5, 0.4, 0.85);
                bloomPass.threshold = 0;
                bloomPass.strength = 0.5;
                bloomPass.radius = 0;

                this.composer = new EffectComposer(this.renderer);
                this.composer.addPass(renderScene);
                this.composer.addPass(bloomPass);

                this.boundOnWindowResize = this.onWindowResize.bind(this);
                window.addEventListener('resize', this.boundOnWindowResize, false);
            },

            createRubiksCube: function() {
                this.rubiksCube = new THREE.Group();
                const cubeSize = 1, spacing = 0.1, N = 3;
                const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.5 });
                const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xeeeeee });

                for (let x = 0; x < N; x++) {
                    for (let y = 0; y < N; y++) {
                        for (let z = 0; z < N; z++) {
                            const cube = new THREE.Mesh(geometry, cubeMaterial.clone());
                            const position = new THREE.Vector3(
                                (x - (N - 1) / 2) * (cubeSize + spacing),
                                (y - (N - 1) / 2) * (cubeSize + spacing),
                                (z - (N - 1) / 2) * (cubeSize + spacing)
                            );
                            cube.position.copy(position);

                            const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
                            cube.add(edges);
                            (cube as any).isTwitching = false;
                            this.rubiksCube.add(cube);
                            this.cubeletOriginalPositions.push(position.clone());
                        }
                    }
                }
                this.scene!.add(this.rubiksCube);
            },

            onWindowResize: function() {
                if (!this.container || !this.camera || !this.renderer || !this.composer) return;
                this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
                this.composer.setSize(this.container.clientWidth, this.container.clientHeight);
            },

            animate: function() {
                if (!this.rubiksCube || !this.controls || !this.composer) return;
                this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
                const time = Date.now() * 0.001;
                this.rubiksCube.rotation.y += 0.002;

                const breathAmplitude = 0.05, breathSpeed = 2;
                this.rubiksCube.children.forEach((cubelet, i) => {
                    const originalPos = this.cubeletOriginalPositions[i];
                    if (!originalPos) return;
                    const direction = originalPos.clone().normalize();
                    const offset = Math.sin(time * breathSpeed + originalPos.length() * 0.5) * breathAmplitude;
                    cubelet.position.copy(originalPos).add(direction.multiplyScalar(offset));
                });

                if (Math.random() > 0.965) {
                    const randomCubelet = this.rubiksCube.children[Math.floor(Math.random() * this.rubiksCube.children.length)] as THREE.Mesh & { isTwitching?: boolean };
                    if (randomCubelet && !randomCubelet.isTwitching) {
                        randomCubelet.isTwitching = true;
                        gsap.to(randomCubelet.rotation, {
                            x: `+=${(Math.random() - 0.5) * Math.PI * 0.5}`,
                            y: `+=${(Math.random() - 0.5) * Math.PI * 0.5}`,
                            duration: 0.3,
                            ease: 'power2.out',
                            yoyo: true,
                            repeat: 1,
                            onComplete: () => {
                                randomCubelet.rotation.set(0, 0, 0);
                                randomCubelet.isTwitching = false;
                            }
                        });
                    }
                }

                this.controls.update();
                this.composer.render();
            },

            start: function() {
                if (!this.animationFrameId) this.animate();
            },

            stop: function() {
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }
            }
        };

        const cubeContainer = rubiksCubeRef.current;
        if (cubeContainer) {
            RubiksCubeApp.init(cubeContainer);
            rubiksCubeAppRef.current = RubiksCubeApp;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        rubiksCubeAppRef.current?.start();
                    } else {
                        rubiksCubeAppRef.current?.stop();
                    }
                });
            }, { threshold: 0.01 });

            observer.observe(cubeContainer);

            return () => {
                scrollAnimation.kill();
                observer.disconnect();
                rubiksCubeAppRef.current?.stop();

                if (rubiksCubeAppRef.current?.boundOnWindowResize) {
                    window.removeEventListener('resize', rubiksCubeAppRef.current.boundOnWindowResize);
                }

                if (cubeContainer && rubiksCubeAppRef.current?.renderer) {
                    if (cubeContainer.contains(rubiksCubeAppRef.current.renderer.domElement)) {
                        cubeContainer.removeChild(rubiksCubeAppRef.current.renderer.domElement);
                    }
                }
            };
        }
    }, []);

    // 3D Scroll Effect useEffect
    useEffect(() => {
        // Dynamically import Three.js modules
        let THREE: any;
        let textureLoader: any;
        
        const initThreeJs = async () => {
            // Dynamically import Three.js
            const threeModule = await import('three');
            THREE = threeModule;
            
            // Initialize the 3D scroll effect
            initScrollEffect();
        };
        
        const initScrollEffect = () => {
            if (!THREE) return;
            
            // Configuration
            const STAGES = [
                { type: 'image', path: image3_1, duration: 150 },
                { type: 'text',  stageIndex: 1, duration: 100 },
                { type: 'image', path: image3_2, duration: 150 },
                { type: 'text',  stageIndex: 3, duration: 100 },
                { type: 'image', path: image3_3, duration: 150 },
                { type: 'text',  stageIndex: 5, duration: 100 },
            ];
            
            // Scene setup
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            
            const renderer = new THREE.WebGLRenderer({
                canvas: document.querySelector('#three-canvas'),
                antialias: true,
                alpha: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // DOM Elements
            const scrollContainer = document.querySelector('.scroll-container') as HTMLElement;
            const textSections = document.querySelectorAll('.text-section');
            
            // Set Scroll Container Height
            const totalDuration = STAGES.reduce((acc, stage) => acc + stage.duration, 0);
            if (scrollContainer) {
                scrollContainer.style.height = `${totalDuration}vh`;
            }
            
            // Three.js Objects and Texture Loading
            let paperMesh: any;
            const textures: any = {}; // Cache for loaded textures
            
            // Preload all textures
            let loadedTextures = 0;
            const imageStages = STAGES.filter((s: any) => s.type === 'image');
            
            // Create texture loader
            textureLoader = new THREE.TextureLoader();
            
            imageStages.forEach((stage: any) => {
                textureLoader.load(stage.path, (texture: any) => {
                    textures[stage.path] = texture;
                    loadedTextures++;
                    if (loadedTextures === imageStages.length) {
                        initPaperMesh(); // Initialize with the first texture
                        animate();
                    }
                });
            });
            
            // GLSL (Shaders)
            const simplexNoise = `
                vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
                float snoise(vec2 v){ const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439); vec2 i  = floor(v + dot(v, C.yy) ); vec2 x0 = v -   i + dot(i, C.xx); vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0); vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1.xy; x12.zw -= 1.0 - i1.xy; i = mod(i, 289.0); vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 )); vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0); m = m*m; m = m*m; vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h ); vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw; return 130.0 * dot(m, g); }
            `;
            
            function initPaperMesh() {
                const firstStage = STAGES[0];
                const firstTexture = firstStage.path ? textures[firstStage.path] : null;
                
                if (!firstTexture || !firstTexture.image) return;
                
                const aspectRatio = firstTexture.image.width / firstTexture.image.height;
                const planeWidth = 4;
                const planeHeight = planeWidth / aspectRatio;
                
                const paperGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 64, 64);
                const paperMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        u_time: { value: 0.0 },
                        u_progress: { value: 0.0 },
                        u_texture: { value: firstTexture }
                    },
                    vertexShader: `
                        uniform float u_time;
                        uniform float u_progress;
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            vec3 pos = position;
                            // Reverse the float animation: it starts collapsed and floats as it appears
                            float floatIntensity = 0.06 * u_progress;
                            pos.x += sin(u_time * 0.5 + pos.y * 3.0) * floatIntensity;
                            pos.y += cos(u_time * 0.7 + pos.x * 2.0) * floatIntensity;
                            pos.z += sin(u_time * 1.2 + pos.y * 4.0) * floatIntensity;
                            // The main animation is now reversed: from center to original position
                            float easedProgress = smoothstep(0.0, 1.0, 1.0 - u_progress);
                            pos = mix(pos, vec3(0.0), easedProgress);
                            pos.z -= easedProgress * 2.0;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                        }
                    `,
                    fragmentShader: `
                        ${simplexNoise}
                        uniform float u_time;
                        uniform float u_progress;
                        
                        // ================== FIX WAS HERE ==================
                        uniform sampler2D u_texture; // Corrected from samplerD to sampler2D
                        // ================================================
                        
                        varying vec2 vUv;
                        float fbm(vec2 st) {
                            float value = 0.0; float amplitude = 0.5;
                            for (int i = 0; i < 4; i++) {
                                value += amplitude * snoise(st); st *= 2.0; amplitude *= 0.5;
                            }
                            return value;
                        }
                        void main() {
                            vec4 textureColor = texture2D(u_texture, vUv);
                            float noiseVal = fbm(vUv * 2.5);
                            noiseVal = (noiseVal + 1.0) * 0.5;
                            // Reversed the burn effect
                            float burnThreshold = 1.0 - u_progress;
                            if (noiseVal < burnThreshold) { discard; }
                            float burnEdge = smoothstep(burnThreshold - 0.1, burnThreshold, noiseVal);
                            textureColor.a *= burnEdge;
                            if (textureColor.a < 0.1) { discard; }
                            gl_FragColor = textureColor;
                        }
                    `,
                    side: THREE.DoubleSide,
                    transparent: true
                });
                
                paperMesh = new THREE.Mesh(paperGeometry, paperMaterial);
                scene.add(paperMesh);
            }
            
            // Scroll event listener (core logic)
            let currentStageIndex = 0;
            let lastStageIndex = -1;
            
            const handleScroll = () => {
                const scrollY = window.scrollY;
                const vh = window.innerHeight;
                let accumulatedHeight = 0;
                
                for (let i = 0; i < STAGES.length; i++) {
                    const stage = STAGES[i];
                    const stageHeight = stage.duration * vh / 100;
                    
                    if (scrollY < accumulatedHeight + stageHeight) {
                        currentStageIndex = i;
                        const stageScrollY = scrollY - accumulatedHeight;
                        const stageProgress = stageScrollY / stageHeight;
                        
                        updateScene(currentStageIndex, stageProgress);
                        break;
                    }
                    accumulatedHeight += stageHeight;
                }
            };
            
            window.addEventListener('scroll', handleScroll);
            
            function updateScene(stageIndex: number, stageProgress: number) {
                const stage = STAGES[stageIndex];
                
                textSections.forEach(section => {
                    const sectionStageIndex = parseInt((section as HTMLElement).dataset.stage || '0');
                    if (stage.type === 'text' && sectionStageIndex === stage.stageIndex) {
                        section.classList.add('is-visible');
                    } else {
                        section.classList.remove('is-visible');
                    }
                });
                
                if (!paperMesh) return;
                
                if (stage.type === 'image') {
                    if (lastStageIndex !== stageIndex && stage.path) {
                        const texture = textures[stage.path];
                        if (texture) {
                            paperMesh.material.uniforms.u_texture.value = texture;
                            lastStageIndex = stageIndex;
                        }
                    }
                    
                    const start = 0.2;
                    const end = 0.8;
                    
                    let shaderProgress = (stageProgress - start) / (end - start);
                    shaderProgress = Math.max(0, Math.min(1, shaderProgress));
                    
                    paperMesh.visible = true;
                    paperMesh.material.uniforms.u_progress.value = shaderProgress;
                } else {
                    paperMesh.visible = false;
                }
            }
            
            // Animation loop
            const clock = new THREE.Clock();
            function animate() {
                if (!paperMesh) {
                    requestAnimationFrame(animate);
                    return;
                }
                const elapsedTime = clock.getElapsedTime();
                paperMesh.material.uniforms.u_time.value = elapsedTime;
                paperMesh.rotation.z = Math.sin(elapsedTime * 0.1) * 0.05;
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            
            // Window resize handler
            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
            
            window.addEventListener('resize', handleResize);
            
            // Cleanup function
            return () => {
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleResize);
            };
        };
        
        // Initialize Three.js when component mounts
        initThreeJs();
        
        // Cleanup function for useEffect
        return () => {
            // Any necessary cleanup can be done here
        };
    }, []);



    // regarding部分图片左右移动效果
    const handleLiteratureMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const containerRect = container.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;
        const containerWidth = containerRect.width;
        
        // 如果鼠标在左半部分
        if (mouseX < containerWidth / 2) {
            if (literatureShifted) {
                setLiteratureShifted(false);
            }
        } else {
            // 如果鼠标在右半部分
            if (!literatureShifted) {
                setLiteratureShifted(true);
            }
        }
    };

    const handleDesignMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const containerRect = container.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;
        const containerWidth = containerRect.width;
        
        // 对于reverse布局，逻辑应该相反
        // 如果鼠标在左半部分，应该显示中文（图片左移）
        if (mouseX < containerWidth / 2) {
            if (!designShifted) {
                setDesignShifted(true);
            }
        } else {
            // 如果鼠标在右半部分，应该显示英文（图片右移回原位）
            if (designShifted) {
                setDesignShifted(false);
            }
        }
    };

    const handleAiMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const containerRect = container.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;
        const containerWidth = containerRect.width;
        
        // 如果鼠标在左半部分
        if (mouseX < containerWidth / 2) {
            if (aiShifted) {
                setAiShifted(false);
            }
        } else {
            // 如果鼠标在右半部分
            if (!aiShifted) {
                setAiShifted(true);
            }
        }
    };

    return (
        <>
            {/* 三个角落固定悬浮元素 */}
            <div className="fixed-overlay top-right">千丈阴崖百丈溪 孤桐枝上凤偏宜</div>
            <div className="fixed-overlay bottom-left">TO LEARN AND CREATE,<br/>FOR A MEANINGFUL LIFE AND A BETTER WORLD</div>
            <div className="fixed-overlay bottom-right">chivalrycieux@qq.com 2025</div>

            <div className="reveal-container">
                <div className="sticky-wrapper">
                    <div className="reveal-layer" id="rubiks-cube-container">
                        {/* 悬浮文字组件 */}
                        <FloatingText
                            targetSectionId="rubiks-cube-container"
                            lines={[
                                "高中就读于遵义航天高级中学",
                                "Attended Zunyi Aerospace Senior High School",
                                "现就读于同济大学",
                                "Currently enrolled in the dual bachelor's degree program",
                                "视觉传达设计与人工智能",
                                "In Visual Communication Design and Artificial Intelligence",
                                "双学士学位项目",
                                "At Tongji University, Shanghai"
                            ]}

                        />
                        <div ref={rubiksCubeRef} className="rubiks-cube-right"></div>
                    </div>

                    <div className="reveal-layer top-layer">
                        <div className="first-page-layout">
                            <div className="first-page-text">
                                <h1>兹暂客：徐梦瑜，别看了</h1>
                            </div>
                            <div className="first-page-image">
                                <img src={artworkImage} alt="Artwork" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 嵌入地图组件 */}
            <div className="map-section" style={{ width: '100%', height: '100vh' }}>
                {/* 地图组件 */}
                <MapComponent />
            </div>


            {/* About Me部分 */}
            <div className="content" id="about-me">
                <h1>About Me</h1>
                <div className="avatar-container">
                    <img src={avatarImage} alt="Avatar" className="avatar-image" />
                </div>
                <p>不能像器物一样只有一种功用。我在这里。</p>
            </div>

            <div className="marquee-container">
                <div className="marquee-track">
                    <span>ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ </span>
                    <span>ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ ChivaLry Cieux ★ </span>
                </div>
            </div>

            {/* regarding部分 */}
            <div className="regarding-container" id="regarding-literature" onMouseMove={handleLiteratureMouseMove}>
                <div className={`regarding-background ${literatureShifted ? 'shifted' : ''}`} style={{ backgroundImage: `url(${image2_1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="regarding-text">
                    <div className="text-wrapper">
                        <h1>Regarding Literature</h1>
                        <p>I began writing classical Chinese regulated verse at age 13, simultaneously composing and studying texts. My greatest inspirations came from the Book of Songs, Yuefu poetry, and Xin Qiji. Some of my poems have been published. I started studying philosophy in high school, but only after extensive exploration of politics, economics, and history. My philosophical journey began with S.T. Stumpf's thick History of Western Philosophy, progressing all the way to Lacanian psychoanalysis. The spirit of Marx has profoundly influenced me. By university, my prose writing finally broke free from the shackles of established writing styles, as I practiced the principle that "there is no fixed form in writing, with vividness being the most valuable." During moments of inspiration, I even won Tongji University's top literary prize. However, I no longer read poetry, philosophy, or prose. Currently, I am focusing on learning fiction writing.</p>
                    </div>
                </div>
                <div className={`regarding-chinese ${literatureShifted ? 'visible' : ''}`}>
                    <div className="text-wrapper">
                        <h1>关于文学</h1>
                        <p>我13岁开始写中国古典的格律诗，边写边读，最爱《诗经》乐府辛弃疾。诗作偶有发表。高中开始学哲学，但先广泛涉猎政治经济与历史，而后才从斯通普夫厚厚的《西方哲学史》开始，一直学到拉康精神分析。马克思的气概对我影响颇深。到大学之后，散文创作终于打破文风枷锁，躬行"文无定格，贵在鲜活"之道。灵光乍现的时候，也曾得过同济的第一。诗歌、哲学、散文，现在都不读了。现在学习小说。</p>
                    </div>
                </div>
            </div>

            <div className="regarding-container reverse" id="regarding-design" onMouseMove={handleDesignMouseMove}>
                <div className={`regarding-background ${designShifted ? 'shifted' : ''}`} style={{ backgroundImage: `url(${image2_2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="regarding-text">
                    <div className="text-wrapper">
                        <h1>Regarding Design</h1>
                        <p>Lacking innate musical talent or foundational fine arts training, I can only progress in design through persistent ideation and practice. While I have created numerous posters in graphic design, most have been ordinary, though I did produce main visuals for several international academic conferences. My video editing skills remain underdeveloped, and creating animations would likely be inefficient. Fortunately, my philosophical background provides theoretical grounding for discussing semiotics and signifiers in design thinking. Game design is currently in my learning phase – its connection with coding particularly fascinates me, and I look forward to exploring this field. As for front-end web design – interactive posters and user-controlled animations – the results of my work are presented here before you.</p>
                    </div>
                </div>
                <div className={`regarding-chinese ${designShifted ? 'visible' : ''}`}>
                    <div className="text-wrapper">
                        <h1>关于设计</h1>
                        <p>鄙人无音韵之天赋，亦无美术之基础，设计一途，只能靠多想多做。平面设计，海报做了不少，大都普普通通，好在曾为几场国际会议做过主视觉。视屏剪辑，学艺不精，要做动画，恐怕效率难以差强人意。设计思维，符号与能指，幸亏有些哲学基础，可供我夸夸其谈。游戏设计尚在学习中。不过其与代码有联系，我也饶有兴趣，大可期待一番。至于前端网页设计——可交互的海报，由你控制的动画——我所做的，就在你眼前了。</p>
                    </div>
                </div>
            </div>

            <div className="regarding-container" id="regarding-ai" onMouseMove={handleAiMouseMove}>
                <div className={`regarding-background ${aiShifted ? 'shifted' : ''}`} style={{ backgroundImage: `url(${image2_3})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="regarding-text">
                    <div className="text-wrapper">
                        <h1>Regarding Artificial Intelligence</h1>
                        <p> Calculus, linear algebra, and probability theory formed my initial mathematical foundation. Discrete mathematics, signal systems, and optimization theory became essential tools for deeper exploration. Combined with computer science and programming languages, these enabled my entry into machine learning. By integrating matrix multiplication with non-affine functions, I constructed artificial neural networks. Utilizing Gradient Boosting Decision Trees and Multilayer Perceptrons, I have won awards in domestic and international competitions. Later, I expanded into financial machine learning, quantitative finance, blockchain, and Web3 technologies. Future advanced studies remain open for further exploration.</p>
                    </div>
                </div>
                <div className={`regarding-chinese ${aiShifted ? 'visible' : ''}`}>
                    <div className="text-wrapper">
                        <h1>关于人工智能</h1>
                        <p>微积分、线性代数、概率论，都是最开始掌握的基础。离散数学、信号与系统、最优化理论，都是深入其中必须借助的工具。再加上计算机科学与编程语言，就可以进入机器学习的世界。再结合矩阵乘法与非仿射函数，就可以搭建起人工神经网络。借助梯度提升决策树与多层感知机，我也在国内国外各比赛、平台拿过一些奖。后来又涉猎了金融机器学习和量化金融，区块链与Web3。更深入的学习，就交给未来了。</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;