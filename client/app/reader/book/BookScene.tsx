import * as ColorThief from "colorthief";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import clsx from "clsx";

function eqColors(a: ColorThief.RGB, b: ColorThief.RGB) {
    return (
        a.r === b.r &&
        a.g === b.g &&
        a.b === b.b
    );
}

function getLuminance(color: ColorThief.RGB) {
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

function getColorsFromImage(imageURL: string): Promise<{primary: ColorThief.Color, secondary: ColorThief.Color, tertiary: ColorThief.Color, quaternary: ColorThief.Color}> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';

        image.onload = async () => {
            try {
                const primary = await ColorThief.getColor(image);
                if (!primary) {
                    return null;
                }
                const primaryRGB = primary.rgb();
                const primaryLuminance = getLuminance(primaryRGB);

                const palette = await ColorThief.getPalette(image);
                if (!palette) {
                    return null;
                }

                let secondary = palette[0];
                let secondaryRGB = palette[0].rgb();
                let minContrast = Infinity;

                for (const color of palette) {
                    const colorRGB = color.rgb();
                    if (eqColors(primaryRGB, colorRGB))
                        continue;
                    
                    const contrast = Math.abs(primaryLuminance - getLuminance(colorRGB));
                    if (contrast <= minContrast) {
                        minContrast = contrast;
                        secondary = color;
                        secondaryRGB = colorRGB;
                    }
                }

                let tertiary = palette[0];
                let tertiaryRGB = palette[0].rgb();

                const secondaryLuminance = getLuminance(secondaryRGB);
                let maxContrast = -1;
                
                for (const color of palette) {
                    const colorRGB = color.rgb();
                    if (eqColors(primaryRGB, colorRGB))
                        continue;

                    if (eqColors(secondaryRGB, colorRGB))
                        continue;

                    const contrast = Math.abs(secondaryLuminance - getLuminance(colorRGB));
                    if (contrast >= maxContrast) {
                        maxContrast = contrast;
                        tertiary = color;
                        tertiaryRGB = colorRGB;
                    }
                }

                let quaternary = palette[0];
                let quaternaryRGB = palette[0].rgb();

                const tertiaryLuminance = getLuminance(tertiaryRGB);
                maxContrast = -1;
                
                for (const color of palette) {
                    const colorRGB = color.rgb();
                    if (eqColors(primaryRGB, colorRGB))
                        continue;

                    if (eqColors(secondaryRGB, colorRGB))
                        continue;

                    if (eqColors(tertiaryRGB, colorRGB))
                        continue;

                    const contrast = Math.abs(tertiaryLuminance - getLuminance(colorRGB));
                    if (contrast >= maxContrast) {
                        maxContrast = contrast;
                        quaternary = color;
                        quaternaryRGB = colorRGB;
                    }
                }

                resolve({
                    primary,
                    secondary,
                    tertiary,
                    quaternary
                });
            }
            catch (err) {
                reject(err);
            }
        }

        image.onerror = () => reject(new Error(`Failed to Load Image: ${imageURL}`));
        image.src = imageURL;
    });
}


function getDarkerColor(color: ColorThief.RGB, factor = 0.4) {
    const darkerColor = new THREE.Color().setRGB(color.r / 255, color.g / 255, color.b / 255);
    const hsl: any = {};
    darkerColor.getHSL(hsl);
    darkerColor.setHSL(hsl.h, hsl.s, hsl.l * factor);
    return darkerColor;
}

function updateCameraFrustum(camera: THREE.OrthographicCamera, width: number, height: number, frustumSize: number = 200) {
    const aspect = width / height;
    camera.left = (-frustumSize * aspect) / 2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    camera.updateProjectionMatrix();
}

interface BookSceneProps {
    coverImage: string;
    rawCoverImage: string;
}

export default function BookScene(props: BookSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [failed, setFailed] = useState(true);
    
    useEffect(() => {
        let cleanup: (() => void) | undefined;
        let cancelled = false;

        const load = async () => {
            const container = containerRef.current;
            if (!container || !props.coverImage) 
                return;

            // Renderer
            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true, 
            });
            renderer.setSize(110, 156);
            renderer.setPixelRatio(2);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.VSMShadowMap;
            container.appendChild(renderer.domElement);

            // Camera
            const camera = new THREE.OrthographicCamera(-100, 100, 100, -100);
            camera.position.set(-150, 50, 450);
            camera.lookAt(0, 0, 0);
            camera.zoom = 0.9;
            camera.updateProjectionMatrix();
            updateCameraFrustum(camera, 110, 156);

            // Scene
            const scene = new THREE.Scene();

            // Light
            const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 2);
            scene.add(hemiLight);

            const directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 1.2);
            directionalLight1.position.set(-100, 100, 1000);
            directionalLight1.castShadow = true;
            scene.add(directionalLight1);

            const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.8);
            directionalLight2.position.set(0, 200, 1000);
            directionalLight2.castShadow = true;
            scene.add(directionalLight2);

            // Controls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 0, 0);
            controls.enableDamping = true;
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.update();

            const loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous');

            // Textures
            const paperNormalMap1 = await loader.loadAsync('/textures/paper-rough-9-NORM.png');
            paperNormalMap1.colorSpace = THREE.NoColorSpace;
            paperNormalMap1.wrapS = paperNormalMap1.wrapT = THREE.RepeatWrapping;
            paperNormalMap1.repeat.set(4, 4);

            const paperNormalMap2 = await loader.loadAsync('/textures/texture5.jpg');
            paperNormalMap2.colorSpace = THREE.NoColorSpace;
            paperNormalMap2.wrapS = THREE.RepeatWrapping;
            paperNormalMap2.repeat.set(1, 1);
            
            // Textures: Cover Image
            const imageTexture = await loader.loadAsync(props.coverImage);
            imageTexture.colorSpace = THREE.SRGBColorSpace;
            const imageMaterial = new THREE.MeshPhysicalMaterial({ 
                map: imageTexture,
                normalMap: paperNormalMap1,
                normalScale: new THREE.Vector2(1, 1),
                clearcoat: 0.4,
                clearcoatRoughness: 0.3,
                roughness: 0.4
            });
            
            // Materials
            const colors = await getColorsFromImage(props.coverImage);

            // Material: Primary Color
            const primaryMaterial = new THREE.MeshPhysicalMaterial({
                normalMap: paperNormalMap1,
                normalScale: new THREE.Vector2(1, 2),
            });
            
            const primaryRGB = getDarkerColor(colors.primary.rgb());
            primaryMaterial.color.setRGB(primaryRGB.r, primaryRGB.g, primaryRGB.b);
            
            // Material: Secondary Color
            const secondaryMaterial = new THREE.MeshPhysicalMaterial({
                normalMap: paperNormalMap1,
                normalScale: new THREE.Vector2(1, 2),
            });

            const secondaryRGB = colors.secondary.rgb();
            secondaryMaterial.color.setRGB(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255);

            // Material: Tertiary Color
            const tertiaryMaterial = new THREE.MeshPhysicalMaterial({
                normalMap: paperNormalMap1,
                normalScale: new THREE.Vector2(1, 2),
                metalness: 0,
                roughness: 0.5
            });

            const tertiaryRGB = colors.tertiary.rgb();
            tertiaryMaterial.color.setRGB(tertiaryRGB.r / 255, tertiaryRGB.g / 255, tertiaryRGB.b / 255);

            // Material: Quaternary Color
            const quaternaryMaterial = new THREE.MeshPhysicalMaterial({
                normalMap: paperNormalMap1,
                normalScale: new THREE.Vector2(1, 2),
                metalness: 0,
                roughness: 0.5
            });

            const quaternaryRGB = colors.tertiary.rgb();
            quaternaryMaterial.color.setRGB(quaternaryRGB.r / 255, quaternaryRGB.g / 255, quaternaryRGB.b / 255);

            // Parameters
            const textureAspect = imageTexture.source.data.width / imageTexture.source.data.height;
            const bookInteriorH = 152;
            const bookInteriorW = Math.min(bookInteriorH * textureAspect, 100);
            const bookInteriorD = 30;
            const bookCoverD = 3;
            const bookH = 156;
            const bookW = Math.min(bookH * textureAspect, 103);
            const bookD = bookInteriorD + bookCoverD * 2;
            const bookBorderL = 3;


            function BookCover(isFront: boolean) {
                // Background
                const meshBackground = new THREE.Mesh(
                    new RoundedBoxGeometry(bookW, bookH, bookCoverD, 100, 100),
                    primaryMaterial
                );
                meshBackground.castShadow = true;
                meshBackground.receiveShadow = true;

                // Foreground
                const meshForeground = new THREE.Mesh(
                    new THREE.BoxGeometry(bookW - (bookBorderL * 2), bookH - (bookBorderL * 2), 1),
                    isFront ? imageMaterial : secondaryMaterial
                );
                meshForeground.castShadow = true;
                meshForeground.receiveShadow = true;
                meshForeground.position.set(0, 0, isFront ? bookCoverD / 2 : -bookCoverD / 2);

                // Group and Return
                const group = new THREE.Group();
                group.add(meshBackground);
                group.add(meshForeground);
                return group;
            }


            function BookSpine() {
                const meshBackground = new THREE.Mesh(
                    new RoundedBoxGeometry(bookCoverD, bookH, bookD, 2, 100),
                    primaryMaterial
                );
                meshBackground.castShadow = true;
                meshBackground.receiveShadow = true;

                const meshForeground = new THREE.Mesh(
                    new THREE.BoxGeometry(0, bookH - (bookBorderL * 2), bookD - (bookBorderL * 2)),
                    primaryMaterial
                );
                meshForeground.castShadow = true;
                meshForeground.receiveShadow = true;
                meshForeground.position.set(-2, 0, 0);

                const group = new THREE.Group();
                group.add(meshBackground, meshForeground);
                return group;
            }


            function BookInterior() {
                const mesh = new THREE.Mesh(
                    new RoundedBoxGeometry(bookInteriorW, bookInteriorH, bookInteriorD, 2, 0.005), 
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFFFFFF,
                        normalMap: paperNormalMap2,
                        normalScale: new THREE.Vector2(10, 15),
                        roughness: 0.5
                    })
                );
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                const meshBookmark = new THREE.Mesh(
                    new RoundedBoxGeometry(bookInteriorW - 5, bookInteriorH + 5, 3, 8, 8), 
                    tertiaryMaterial
                );
                meshBookmark.castShadow = true;
                meshBookmark.receiveShadow = true;

                const group = new THREE.Group();
                group.add(mesh, meshBookmark);
                return group;
            }

            const bookCoverBack = BookCover(false);
            bookCoverBack.position.set(0, 0, 0);
            scene.add(bookCoverBack);

            const bookInterior = BookInterior();
            bookInterior.position.set(-(bookW - bookInteriorW) / 2, 0, bookCoverBack.position.z + bookCoverD / 2 + bookInteriorD / 2);
            scene.add(bookInterior);

            const bookCoverFront = BookCover(true);
            bookCoverFront.position.set(0, 0, bookInteriorD + (bookCoverD / 2) * 2);
            scene.add(bookCoverFront);

            const bookSpine = BookSpine();
            bookSpine.position.set(-bookW / 2 + 0.000, 0, (bookCoverFront.position.z + bookCoverBack.position.z) / 2);
            scene.add(bookSpine);

            // Draw Palette
            // let i = 0;
            // for (const color of [colors.primary, colors.secondary, colors.tertiary, colors.quaternary]) {
            //     const colorRGB = color.rgb();

            //     const geometry = new THREE.BoxGeometry(20, 20, 1);
            //     const material = new THREE.MeshStandardMaterial();
            //     material.color.setRGB(colorRGB.r / 255, colorRGB.g / 255, colorRGB.b / 255);

            //     const mesh = new THREE.Mesh(geometry, material);
            //     mesh.position.set(100, i * -30, 0);
            //     scene.add(mesh);

            //     i += 1;
            // }

            // Light Ray
            const slats: THREE.Mesh[] = [];
            for (let i = 0; i < 2; i++) {
                const material = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
                material.colorWrite = false;

                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(370, 500, 10),
                    material
                );
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                const baseX = i === 1 ? -200 : 200;
                mesh.position.set(baseX, i * 10, 200);
                mesh.userData.baseX = baseX;
                
                mesh.rotation.z = THREE.MathUtils.degToRad(15);
                scene.add(mesh);
                slats.push(mesh);
            }

            const light = new THREE.DirectionalLight(0xFFE8C0, 0.75);
            light.position.set(0, 0, 500);
            light.target.position.set(0, 0, 0);
            light.castShadow = true;
            light.shadow.camera.left = -100;
            light.shadow.camera.right = 100;
            light.shadow.camera.top = 100;
            light.shadow.camera.bottom = -100;
            light.shadow.camera.near = 1;
            light.shadow.camera.far = 500;
            light.shadow.mapSize.set(2048, 2048);
            light.shadow.radius = 120;
            light.shadow.blurSamples = 24; 
            scene.add(light, light.target);

            if (cancelled) {
                renderer.dispose();
                controls.dispose();
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
                return;
            }

            const timer = new THREE.Timer();
            let animationFrameID: number = -1;

            function animate() {
                animationFrameID = requestAnimationFrame(animate);

                const speed = 0.5;
                const amplitude = 100;
                timer.update();
                const t = timer.getElapsed();
                

                slats.forEach(slat => {
                    slat.position.x = slat.userData.baseX + Math.sin(t * speed) * amplitude;
                });

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

        load()
            .then(() => {
                setFailed(false);
            })
            .catch((err) => {
                console.log(err);
                setFailed(true);
            });

        return () => {
            cancelled = true;
            cleanup?.();
        };
    }, [props.coverImage]);

    return (
        <>
            <div
                ref={containerRef} 
                className={clsx(
                    !failed && "w-full h-full relative overflow-hidden",
                    failed && "mx-4 w-[80px] h-[124px] bg-neutral-950 border border-neutral-800 bg-cover bg-center rounded-md shadow",
                )}
                style={{
                    backgroundImage: failed ? `url(${props.rawCoverImage})` : ''
                }}
            >
            </div>
        </>
    )
}