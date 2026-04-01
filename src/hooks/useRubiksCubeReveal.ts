import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface TwitchingMesh extends THREE.Mesh {
    isTwitching?: boolean;
}

interface RubiksCubeApp {
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    composer: EffectComposer | null;
    rubiksCube: THREE.Group | null;
    cubeletOriginalPositions: THREE.Vector3[];
    animationFrameId: number | null;
    container: HTMLElement | null;
    boundOnWindowResize: (() => void) | null;
    init: (containerElement: HTMLElement) => void;
    createRubiksCube: () => void;
    onWindowResize: () => void;
    animate: () => void;
    start: () => void;
    stop: () => void;
    dispose: () => void;
}

const createRubiksCubeApp = (): RubiksCubeApp => ({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    composer: null,
    rubiksCube: null,
    cubeletOriginalPositions: [],
    animationFrameId: null,
    container: null,
    boundOnWindowResize: null,

    init(containerElement) {
        this.container = containerElement;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x18350e);

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

        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 5, 200);
        pointLight.position.set(10, 15, 10);
        this.scene.add(pointLight);

        this.createRubiksCube();

        const renderScene = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
            1.5,
            0.4,
            0.85,
        );
        bloomPass.threshold = 0.6;
        bloomPass.strength = 0.5;
        bloomPass.radius = 0;

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);

        this.boundOnWindowResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.boundOnWindowResize, false);
    },

    createRubiksCube() {
        this.rubiksCube = new THREE.Group();
        const cubeSize = 1;
        const spacing = 0.1;
        const count = 3;
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xdbbb7a, roughness: 0.5, metalness: 0.5 });
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xeeeeee });

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                for (let z = 0; z < count; z++) {
                    const cube = new THREE.Mesh(geometry, cubeMaterial.clone()) as TwitchingMesh;
                    const position = new THREE.Vector3(
                        (x - (count - 1) / 2) * (cubeSize + spacing),
                        (y - (count - 1) / 2) * (cubeSize + spacing),
                        (z - (count - 1) / 2) * (cubeSize + spacing),
                    );

                    cube.position.copy(position);
                    cube.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial));
                    cube.isTwitching = false;

                    this.rubiksCube.add(cube);
                    this.cubeletOriginalPositions.push(position.clone());
                }
            }
        }

        this.scene?.add(this.rubiksCube);
    },

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer || !this.composer) {
            return;
        }

        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.composer.setSize(this.container.clientWidth, this.container.clientHeight);
    },

    animate() {
        if (!this.rubiksCube || !this.controls || !this.composer) {
            return;
        }

        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
        const time = Date.now() * 0.001;
        this.rubiksCube.rotation.y += 0.002;

        this.rubiksCube.children.forEach((child, index) => {
            const cubelet = child as THREE.Mesh;
            const originalPos = this.cubeletOriginalPositions[index];

            if (!originalPos) {
                return;
            }

            const direction = originalPos.clone().normalize();
            const offset = Math.sin(time * 2 + originalPos.length() * 0.5) * 0.05;
            cubelet.position.copy(originalPos).add(direction.multiplyScalar(offset));
        });

        if (Math.random() > 0.965) {
            const randomCubelet = this.rubiksCube.children[
                Math.floor(Math.random() * this.rubiksCube.children.length)
            ] as TwitchingMesh;

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
                    },
                });
            }
        }

        this.controls.update();
        this.composer.render();
    },

    start() {
        if (!this.animationFrameId) {
            this.animate();
        }
    },

    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    },

    dispose() {
        this.stop();

        if (this.boundOnWindowResize) {
            window.removeEventListener('resize', this.boundOnWindowResize);
        }

        this.controls?.dispose();
        this.composer?.dispose();
        this.renderer?.dispose();

        this.rubiksCube?.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) {
                return;
            }

            child.geometry.dispose();

            if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
            } else {
                child.material.dispose();
            }
        });

        if (this.container && this.renderer?.domElement && this.container.contains(this.renderer.domElement)) {
            this.container.removeChild(this.renderer.domElement);
        }
    },
});

export const useRubiksCubeReveal = (containerRef: RefObject<HTMLDivElement | null>) => {
    const appRef = useRef<RubiksCubeApp | null>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const scrollAnimation = gsap.to('.top-layer', {
            y: '-100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.reveal-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
            },
        });

        const cubeContainer = containerRef.current;
        if (!cubeContainer) {
            return () => {
                scrollAnimation.kill();
            };
        }

        const app = createRubiksCubeApp();
        app.init(cubeContainer);
        appRef.current = app;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        appRef.current?.start();
                    } else {
                        appRef.current?.stop();
                    }
                });
            },
            { threshold: 0.01 },
        );

        observer.observe(cubeContainer);

        return () => {
            observer.disconnect();
            scrollAnimation.kill();
            appRef.current?.dispose();
            appRef.current = null;
        };
    }, [containerRef]);
};
