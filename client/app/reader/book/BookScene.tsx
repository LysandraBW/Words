import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getColor, getPalette, RGB } from 'colorthief';

// Adjust path as needed for your project
import * as BOX from './constants'; 
import { CurvePath, Vector3 } from 'three';

export default function BookScene({ coverURL }: { coverURL: string}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const load = async () => {
        const container = containerRef.current;
        if (!container) 
            return;

        function fitOrthoCameraToObject(camera: THREE.OrthographicCamera, object: THREE.Group, container: HTMLDivElement, padding = 0.0) {
            camera.updateMatrixWorld(true);
            object.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(object);
            const min = box.min, max = box.max;

            // all 8 corners of the bounding box
            const corners = [
                [min.x, min.y, min.z], [max.x, min.y, min.z],
                [min.x, max.y, min.z], [max.x, max.y, min.z],
                [min.x, min.y, max.z], [max.x, min.y, max.z],
                [min.x, max.y, max.z], [max.x, max.y, max.z],
            ].map(([x, y, z]) => new THREE.Vector3(x, y, z));

            // project corners into camera-local space
            const inverse = camera.matrixWorldInverse.clone().copy(camera.matrixWorld).invert();
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

            for (const corner of corners) {
                const local = corner.clone().applyMatrix4(inverse);
                minX = Math.min(minX, local.x);
                maxX = Math.max(maxX, local.x);
                minY = Math.min(minY, local.y);
                maxY = Math.max(maxY, local.y);
            }

            const objW = (maxX - minX) * padding;
            const objH = (maxY - minY) * padding;
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            const containerAspect = container.clientWidth / container.clientHeight;
            const objAspect = objW / objH;

            // "cover" mode: object fills container completely, may crop on one axis
            // "contain" mode: whole object visible, may letterbox on one axis
            let width, height;
            const mode = 'cover'; // or 'contain'

            if ((mode === 'cover') === (objAspect > containerAspect)) {
                height = objH;
                width = objH * containerAspect;
            } 
            else {
                width = objW;
                height = objW / containerAspect;
            }

            camera.left = centerX - width / 2;
            camera.right = centerX + width / 2;
            camera.top = centerY + height / 2;
            camera.bottom = centerY - height / 2;
            camera.updateProjectionMatrix();
        }

        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 50));
        renderer.setSize(container.clientWidth, container.clientHeight, true);
        renderer.shadowMap.enabled = true;
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const frustumSize = 0.5;
        const aspect = container.clientWidth / container.clientHeight;
        const camera = new THREE.OrthographicCamera(
            (-frustumSize * aspect) / 2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            -frustumSize / 2,
            0.01,
            10
        );
        camera.position.set(0.1, 0.1, -0.35);
        camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();

        const aLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(aLight);

        const dLight = new THREE.DirectionalLight(0xffffff, 1);
        dLight.position.set(0.15, 0.25, 0.15);
        dLight.castShadow = true;
        dLight.shadow.camera.near = 0.01;
        dLight.shadow.camera.far = 1;
        dLight.shadow.camera.left = -0.3;
        dLight.shadow.camera.right = 0.3;
        dLight.shadow.camera.top = 0.3;
        dLight.shadow.camera.bottom = -0.3;
        scene.add(dLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;

        const pageW = 0.199;
        const pageH = 0.297;
        const pageD = 0.03;
        const bookCoverD = 0.001;
        const bookD = pageD + bookCoverD * 2;
        const bookW = 0.20;
        const bookH = 0.30;
        
        controls.target.set(0, 0, bookD / 2);

        const textureLoader = new THREE.TextureLoader();
        const activecoverURL = coverURL || 'https://m.media-amazon.com/images/I/71bamGNpoQL._AC_UF1000,1000_QL80_.jpg';

        const coverTexture = textureLoader.load(activecoverURL);
        coverTexture.colorSpace = THREE.SRGBColorSpace;
        coverTexture.generateMipmaps = true;
        coverTexture.minFilter = THREE.LinearMipmapLinearFilter;
        coverTexture.magFilter = THREE.LinearFilter;

        const coverMaterial = new THREE.MeshStandardMaterial({ map: coverTexture });
        const bookMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const bookBorderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });


        function getDarkerColor({ r, g, b }: { r: number, g: number, b: number }, factor = 0.6) {
            const color = new THREE.Color().setRGB(r / 255, g / 255, b / 255);
            const hsl: {h: number, s: number, l: number} = {} as any;
            color.getHSL(hsl);
            color.setHSL(hsl.h, hsl.s, hsl.l * factor);
            return color;
        }

        async function getColorPairFromURL(imageURL: string): Promise<{primary: RGB, secondary: RGB}> {
            return new Promise(async (resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = async () => {
                    try {
                        const primary = await getColor(img);
                        if (primary == null) {
                            reject('No Primary Color');
                            return;
                        }
                        
                        const {r, g, b} = primary.rgb();
                        const pR = r;
                        const pG = g;
                        const pB = b;

                        const palette = await getPalette(img) || [primary];
                        if (palette == null) {
                            reject('No Palette');
                            return;
                        }

                        const getLuminance = ([r, g, b]: [number, number, number]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
                        const priLuminance = getLuminance([pR, pG, pB]);

                        let secondary = palette[0];
                        let maxContrast = -1;

                        for (const color of palette) {
                            const {r, g, b} = color.rgb();
                            if (r === pR && g === pG && b === pB) 
                                continue;

                            const contrast = Math.abs(getLuminance([r, g, b]) - priLuminance);
                            if (contrast > maxContrast) {
                                maxContrast = contrast;
                                secondary = color;
                            }
                        }

                        resolve({
                            primary: { r: pR, g: pG, b: pB },
                            secondary: secondary.rgb(),
                        });
                    } 
                    catch (err) {
                        reject(err);
                    }
                };
                img.onerror = () => reject(new Error(`Failed to Load Image: ${imageURL}`));
                img.src = imageURL;
            });
        }

        const {primary, secondary} = await getColorPairFromURL(activecoverURL);
        bookMaterial.color.setRGB(primary.r / 255, primary.g / 255, primary.b / 255);
        bookBorderMaterial.color.copy(getDarkerColor(primary));


        function BookCover(material: THREE.Material) {
            const geometry = new RoundedBoxGeometry(bookW, bookH, bookCoverD, 2, 0.05);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            return mesh;
        }

        function BookBorder(points: number[][]) {
            const path: CurvePath<Vector3> = new THREE.CurvePath();
            const p1 = new THREE.Vector3(...points[0]);
            const p2 = new THREE.Vector3(...points[1]);
            const p3 = new THREE.Vector3(...points[2]);
            const p4 = new THREE.Vector3(...points[3]);

            path.add(new THREE.LineCurve3(p1, p2));
            path.add(new THREE.LineCurve3(p2, p3));
            path.add(new THREE.LineCurve3(p3, p4));
            path.add(new THREE.LineCurve3(p4, p1));

            const geometry = new THREE.TubeGeometry(path, 1000, bookCoverD * 1.5, 16, true);
            const mesh = new THREE.Mesh(geometry, bookBorderMaterial);
            mesh.castShadow = true;
            return mesh;
        }

        function BookSpine() {
            const geometry = new THREE.BoxGeometry(bookCoverD, bookH, bookD);
            const mesh = new THREE.Mesh(geometry, bookMaterial);
            mesh.castShadow = true;
            return mesh;
        }

        function BookPages() {
            const geometry = new RoundedBoxGeometry(pageW, pageH, pageD, 2, 0);
            const material = new THREE.MeshStandardMaterial({ color: 0xf0ede6 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            return mesh;
        }

        const bookCover1 = BookCover(coverMaterial);
        bookCover1.position.set(0, 0, 0);
        // scene.add(bookCover1);

        const bookPages = BookPages();
        bookPages.position.set((bookW - pageW) / 2, 0, bookCover1.position.z + bookCoverD / 2 + pageD / 2);
        // scene.add(bookPages);

        const bookBorder1 = BookBorder([
            [-bookW / 2, -bookH / 2, 0],
            [+bookW / 2, -bookH / 2, 0],
            [+bookW / 2, +bookH / 2, 0],
            [-bookW / 2, +bookH / 2, 0],
        ]);
        // scene.add(bookBorder1);

        const bookBorder2 = BookBorder([
            [-bookW / 2, -bookH / 2, bookD - bookCoverD],
            [+bookW / 2, -bookH / 2, bookD - bookCoverD],
            [+bookW / 2, +bookH / 2, bookD - bookCoverD],
            [-bookW / 2, +bookH / 2, bookD - bookCoverD],
        ]);
        // scene.add(bookBorder2);

        const bookBorder3 = BookBorder([
            [+bookW / 2, +bookH / 2, 0],
            [+bookW / 2, +bookH / 2, bookD - bookCoverD],
            [+bookW / 2, -bookH / 2, bookD - bookCoverD],
            [+bookW / 2, -bookH / 2, 0],
        ]);
        // scene.add(bookBorder3);

        const bookCover2 = BookCover(bookMaterial);
        bookCover2.position.set(0, 0, pageD + (bookCoverD / 2) * 2);
        // scene.add(bookCover2);

        const bookSpine = BookSpine();
        bookSpine.position.set(bookW / 2, 0, (bookCover1.position.z + bookCover2.position.z) / 2);
        // scene.add(bookSpine);

        const bookGroup = new THREE.Group();
        bookGroup.add(bookCover1, bookPages, bookBorder1, bookBorder2, bookBorder3, bookCover2, bookSpine);
        scene.add(bookGroup);

        fitOrthoCameraToObject(camera, bookGroup, container, 1.1);

        if (cancelled) {
            renderer.dispose();
            controls.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            return;
        }

        let animationFrameID: number = -1;
        function animate() {
            animationFrameID = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        cleanup = () => {
            cancelAnimationFrame(animationFrameID);
            controls.dispose();
            renderer.dispose();

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }

    load();
    return () => {
        cancelled = true;
        cleanup?.();
    };

  }, [coverURL]);

  return (
        <div 
            ref={containerRef} 
            style={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative', 
                overflow: 'hidden' 
            }} 
        />
    );
}