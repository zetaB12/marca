import { useEffect, useRef, type Ref } from "react";
import { gsap } from "gsap";
import { useWallpaperPeriod } from "../../hooks/useWallpaperPeriod";
import { useSettingsStore } from "../../store/settingsStore";
import wallpaperSvg from "./fondo.svg?raw";
import styles from "./Wallpaper.module.css";

/**
 * CAPA 1: fondo del escritorio. El SVG va en línea (sus <rect> son elementos del DOM),
 * con viewBox 1600×900 y `xMidYMax slice` (equivale a cover, anclado abajo).
 * `layerRef` lo usa el escritorio para el parallax sutil con el mouse.
 */
export default function Wallpaper({
  layerRef,
}: {
  layerRef?: Ref<HTMLDivElement>;
}) {
  const pattern = useSettingsStore((s) => s.pattern);
  const animations = useSettingsStore((s) => s.animations);
  const period = useWallpaperPeriod();
  const box = useRef<HTMLDivElement>(null);

  // Titileo: las estrellas (<rect> de 3-4 px en el cielo) suben y bajan de brillo, sin crear elementos nuevos.
  useEffect(() => {
    const root = box.current;
    if (!root || !animations || period === "morning" || period === "afternoon" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stars = Array.from(root.querySelectorAll<SVGRectElement>("#stars > rect")).filter((r) => {
      const size = Number(r.getAttribute("width"));
      return size > 0 && size <= 4 && Number(r.getAttribute("height")) === size && Number(r.getAttribute("y")) < 640;
    });
    // Cada cambio de opacidad repinta el SVG (ocupa toda la pantalla): pocas estrellas, y en táctil/móvil muchas menos.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const count = coarse ? 5 : 10;
    const ctx = gsap.context(() => {
      gsap.utils.shuffle(stars).slice(0, count).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 1 },
          {
            opacity: gsap.utils.random(0.1, 0.4),
            duration: gsap.utils.random(0.9, 2.4),
            delay: gsap.utils.random(0, 3),
            repeat: -1,
            yoyo: true,
            ease: "steps(5)", // pocos pasos: estética pixel y apenas repintados
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [animations, period]);

  return (
    <div
      ref={layerRef}
      className={`${styles.wall} ${pattern ? styles.dots : ""}`}
      aria-hidden
    >
      <div
        ref={box}
        data-period={period}
        className={`${styles.svg} ${animations ? "" : styles.still}`}
        dangerouslySetInnerHTML={{ __html: wallpaperSvg }}
      />
    </div>
  );
}
