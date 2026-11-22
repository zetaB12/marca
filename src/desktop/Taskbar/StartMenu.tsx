import { useEffect, useRef } from "react";
import { APPS, START_MENU_ITEMS } from "../../data/apps";
import { useDesktopStore } from "../../store/desktopStore";
import styles from "./StartMenu.module.css";

export default function StartMenu() {
  const { launch, closeStart } = useDesktopStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();

    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (
        ref.current?.contains(t) ||
        document.getElementById("start-button")?.contains(t)
      )
        return;
      closeStart();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeStart();
        document.getElementById("start-button")?.focus();
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const items = [
          ...(ref.current?.querySelectorAll<HTMLButtonElement>("button") ?? []),
        ];
        const i = items.indexOf(document.activeElement as HTMLButtonElement);
        const next =
          (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
        e.preventDefault();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [closeStart]);

  return (
    <div
      ref={ref}
      id="start-menu"
      className={styles.menu}
      role="menu"
      aria-label="Menú Inicio"
      onMouseOver={(e) => (e.target as HTMLElement).closest("button")?.focus()}
    >
      <div className={styles.banner} aria-hidden>
        <span>
          Neal<b>OS</b>
        </span>
      </div>
      <div className={styles.panel}>
        <div className={styles.header}>
          <img
            src="/icon-192.png"
            width={40}
            height={40}
            alt=""
            className={styles.mark}
          />
          <div className={styles.who}>
            <strong>Deyvi Neal</strong>
            <span>Software Engineer | Maxelit</span>
          </div>
        </div>
        <ul className={styles.list}>
          {START_MENU_ITEMS.map((id) => {
            const { title, icon: Icon } = APPS[id];
            return (
              <li
                key={id}
                role="none"
                className={
                  id === "shutdown"
                    ? `${styles.divider} ${styles.mono}`
                    : undefined
                }
              >
                <button
                  type="button"
                  role="menuitem"
                  className={styles.item}
                  onClick={() => launch(id)}
                >
                  <Icon size={28} aria-hidden />
                  {title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
