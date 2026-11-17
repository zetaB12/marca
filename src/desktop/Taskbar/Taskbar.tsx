import { PowerIcon } from "../../components/PixelIcon/pixelIcons";
import { APPS, QUICK_LAUNCH } from "../../data/apps";
import { useClock } from "../../hooks/useClock";
import { useDesktopStore } from "../../store/desktopStore";
import { selectOpenWindows, useWindowStore } from "../../store/windowStore";
import StartMenu from "./StartMenu";
import VolumeControl from "./VolumeControl";
import styles from "./Taskbar.module.css";

export default function Taskbar() {
  const startOpen = useDesktopStore((s) => s.startOpen);
  const toggleStart = useDesktopStore((s) => s.toggleStart);
  const windows = useWindowStore((s) => s.windows);
  const toggleWindow = useWindowStore((s) => s.toggleWindow);
  const launch = useDesktopStore((s) => s.launch);
  const clock = useClock();

  return (
    <nav className={styles.taskbar} aria-label="Barra de tareas">
      {startOpen && <StartMenu />}

      <button
        type="button"
        id="start-button"
        className={`${styles.btn} ${styles.start} ${startOpen ? styles.pressed : ""}`}
        aria-haspopup="menu"
        aria-expanded={startOpen}
        aria-controls="start-menu"
        onClick={toggleStart}
      >
        <PowerIcon size={16} />
        <span>Start</span>
      </button>

      <span className={`${styles.grip} ${styles.gripQuick}`} aria-hidden />

      <ul className={styles.quick} aria-label="Inicio rápido">
        {QUICK_LAUNCH.map((id) => {
          const { title, icon: Icon } = APPS[id];
          return (
            <li key={id}>
              <button
                type="button"
                className={styles.qbtn}
                title={title}
                aria-label={title}
                onClick={() => launch(id)}
              >
                <Icon size={28} aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>

      <span className={styles.grip} aria-hidden />

      <ul className={styles.tasks}>
        {selectOpenWindows(windows).map((w) => {
          const { title } = APPS[w.appId];
          const Icon = w.icon;
          // Activa y visible = pulsada. Minimizada o inactiva = en relieve.
          const active = w.isActive && !w.isMinimized;
          return (
            <li key={w.id}>
              <button
                type="button"
                className={`${styles.btn} ${styles.task} ${active ? styles.pressed : ""}`}
                aria-pressed={active}
                aria-label={w.isMinimized ? `${title} (minimizada)` : title}
                onClick={() => toggleWindow(w.appId)}
              >
                <Icon size={16} aria-hidden />
                <span>{title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.tray}>
        <VolumeControl />
        <time className={styles.clock} dateTime={clock.iso}>
          {clock.text}
        </time>
      </div>
    </nav>
  );
}
