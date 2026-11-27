import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ComputerIcon } from "../../components/PixelIcon/pixelIcons";
import { useDesktopStore } from "../../store/desktopStore";
import styles from "./WelcomeScene.module.css";

/** Barra de título de las ventanitas (solo decorativa: los tres botones no hacen nada). */
function TitleBar({ title }: { title: string }) {
  return (
    <span className={styles.titlebar}>
      <ComputerIcon size={16} />
      <span className={styles.title}>{title}</span>
      <span className={styles.controls} aria-hidden>
        <i className={styles.min} />
        <i className={styles.max} />
        <i className={styles.close} />
      </span>
    </span>
  );
}

/** Puntero clásico en pixel art. */
function Pointer() {
  return (
    <svg
      className={styles.pointer}
      viewBox="0 0 12 19"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <path
        fill="#0a0f2c"
        d="M0 0h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1H8v2h1v2h1v2H9v1H7v-1H6v-2H5v-1H4v1H3v1H2v1H0z"
      />
      <path
        fill="#fff"
        d="M1 2h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1H6v2h1v2h1v2h1v1H7v-2H6v-2H5v-1H4v1H3v1H2v1H1z"
      />
    </svg>
  );
}

/** Ventana "Proyecto destacado.exe" con dos ventanas en cascada detrás.
    Las medidas siguen la referencia image/image.png (lienzo de 404 × 304). */
export default function WelcomeScene() {
  const launch = useDesktopStore((s) => s.launch);
  const ref = useRef<HTMLDivElement>(null);

  // Una sola secuencia: la cascada se despliega, el puntero llega y hace clic.
  useLayoutEffect(() => {
    const el = ref.current;
    const motionOff =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "off";
    if (!el || motionOff) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.25, defaults: { ease: "expo.out" } })
        .from(`.${styles.front}`, { opacity: 0, y: 18, duration: 0.5 })
        .from(`.${styles.ghostNear}`, { x: -26, y: -16, duration: 0.45 }, "-=0.2")
        .from(`.${styles.ghostFar}`, { x: -48, y: -26, duration: 0.55 }, "<")
        .from(`.${styles.pointer}`, { opacity: 0, x: 70, y: 60, duration: 0.8 }, "-=0.25")
        .to(`.${styles.pointer}`, { scale: 0.82, duration: 0.09, yoyo: true, repeat: 1 })
        .from(
          `.${styles.spark} path`,
          { opacity: 0, scale: 0.2, transformOrigin: "0% 100%", duration: 0.35, stagger: 0.06 },
          "<",
        );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={styles.scene}>
      <div className={styles.canvas}>
        <svg
          className={styles.spark}
          viewBox="0 0 34 30"
          shapeRendering="crispEdges"
          aria-hidden
        >
          <path d="M3 4h5l2 17H5z" />
          <path d="M18 9l5 1-6 13-4-2z" />
          <path d="M31 19l3 4-12 7-2-4z" />
        </svg>

        <button
          type="button"
          className={styles.stack}
          onClick={() => launch("projects")}
          aria-label="Proyecto destacado: Uyara, Medicina Estética Integral. Ver proyectos"
        >
          <span className={`${styles.window} ${styles.ghost} ${styles.ghostFar}`} aria-hidden>
            <TitleBar title="" />
            <span className={styles.ghostBody} />
          </span>
          <span className={`${styles.window} ${styles.ghost} ${styles.ghostNear}`} aria-hidden>
            <TitleBar title="" />
            <span className={styles.ghostBody} />
          </span>
          <span className={`${styles.window} ${styles.front}`}>
            <TitleBar title="Proyecto destacado.exe" />
            <span className={styles.site}>
              <span className={styles.siteNav}>
                <span className={styles.siteBrand}>
                  Uyara
                  <small>Medicina Estética Integral</small>
                </span>
                <span>Inicio</span>
                <span>Tratamientos</span>
                <span>Contacto</span>
              </span>
              <span className={styles.siteHero}>
                <img
                  className={styles.photo}
                  src="/image/uyara-rostro.png"
                  alt=""
                  width={160}
                  height={133}
                  draggable={false}
                />
                <span className={styles.siteTitle}>
                  Resalta tu
                  <br />
                  belleza natural
                </span>
                <span className={styles.siteButton}>Agendar cita →</span>
              </span>
            </span>
          </span>
          <Pointer />
        </button>
      </div>
    </div>
  );
}
