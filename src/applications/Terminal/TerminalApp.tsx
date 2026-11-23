import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ABOUT_PROFILE } from "../../data/about";
import { APPS, isWindowApp, type WindowAppId } from "../../data/apps";
import { PROJECTS } from "../../data/projects";
import { SERVICES } from "../../data/services";
import { useDesktopStore } from "../../store/desktopStore";
import styles from "./TerminalApp.module.css";

type Kind = "cmd" | "out" | "head" | "info" | "err" | "banner";
interface Line {
  kind: Kind;
  text: string;
}

const PROMPT = "C:\\NEAL>";

const BANNER = String.raw` _   _ _____    _    _
| \ | | ____|  / \  | |
|  \| |  _|   / _ \ | |
| |\  | |___ / ___ \| |___
|_| \_|_____/_/   \_\_____|`;

const INTRO: Line[] = [
  { kind: "banner", text: BANNER },
  {
    kind: "info",
    text: "Terminal de Neal OS [Versión 1.0]  —  un shell de portafolio, no uno real",
  },
  {
    kind: "info",
    text: "Escribe help para ver los comandos. Prueba: neofetch, proyectos, open contacto",
  },
];

/** Nombres que acepta `open` (sin tildes ni mayúsculas) → ventana. */
const OPEN_ALIASES: Record<string, WindowAppId> = {
  bienvenida: "home",
  home: "home",
  proyectos: "projects",
  projects: "projects",
  servicios: "services",
  services: "services",
  nosotros: "about",
  about: "about",
  pc: "mycomputer",
  mipc: "mycomputer",
  contacto: "contact",
  contact: "contact",
  papelera: "recyclebin",
  configuracion: "settings",
  config: "settings",
  notas: "notepad",
};

const COMMANDS: [name: string, help: string][] = [
  ["help", "lista los comandos"],
  ["about", "quién soy"],
  ["servicios", "lista los servicios"],
  ["proyectos", "lista los proyectos"],
  ["contacto", "cómo escribirme"],
  ["whoami", "usuario actual"],
  ["neofetch", "resumen del sistema"],
  ["date", "fecha y hora"],
  ["open <app>", "abre una ventana (por ejemplo: open servicios)"],
  ["clear", "limpia la pantalla"],
];

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const out = (...texts: string[]): Line[] =>
  texts.map((text) => ({ kind: "out", text }));
const pad = (s: string, n = 16) => s.padEnd(n, " ");

export default function TerminalApp() {
  const launch = useDesktopStore((s) => s.launch);
  const [lines, setLines] = useState<Line[]>(INTRO);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function run(raw: string): Line[] | "clear" {
    const [cmdRaw, ...rest] = raw.trim().split(/\s+/);
    const cmd = norm(cmdRaw);
    const arg = norm(rest.join(" "));

    switch (cmd) {
      case "help":
      case "ayuda":
        return [
          { kind: "head", text: "Comandos:" },
          ...COMMANDS.map(([n, h]) => ({
            kind: "out" as const,
            text: `  ${pad(n)}${h}`,
          })),
        ];
      case "about":
      case "nosotros":
        return ABOUT_PROFILE.sections.flatMap((s) => [
          { kind: "head" as const, text: s.title },
          ...out(s.body || "Pendiente.", ""),
        ]);
      case "servicios":
      case "services":
        return [
          { kind: "head", text: "Servicios:" },
          ...SERVICES.map((s) => ({
            kind: "out" as const,
            text: `  ${pad(s.name, 20)}${s.description}`,
          })),
        ];
      case "proyectos":
      case "projects":
        return [
          { kind: "head", text: "Proyectos (open proyectos para verlos):" },
          ...PROJECTS.map((p) => ({
            kind: "out" as const,
            text: `  ${pad(p.name, 28)}${p.demo ? "[DEMO]" : ""}`,
          })),
          {
            kind: "info",
            text: "Los marcados DEMO son ejemplos, no proyectos reales.",
          },
        ];
      case "contacto":
      case "contact":
        return [
          { kind: "head", text: "Contacto:" },
          ...out(
            "  Escríbenos por WhatsApp desde Contacto.exe.",
            "  Prueba: open contacto",
          ),
        ];
      case "whoami":
        return out("Deyvi Neal · Digital Studio · Trujillo, Perú");
      case "neofetch":
        return [
          { kind: "head", text: "deyvi@neal" },
          ...out(
            "-----------",
            "SO        Neal OS 1.0.1",
            "Estudio   Digital Studio",
            "Lugar     Trujillo, Perú",
            "Shell     Terminal de Neal OS",
            "Fuente    W95FA",
          ),
        ];
      case "date":
      case "fecha":
        return out(new Date().toLocaleString("es-PE"));
      case "clear":
      case "cls":
        return "clear";
      case "open":
      case "abrir": {
        if (!arg)
          return [
            { kind: "err", text: "Uso: open <app>. Ejemplo: open servicios" },
          ];
        const id = OPEN_ALIASES[arg.replace(/\s+/g, "")];
        if (!id || !isWindowApp(id)) {
          return [
            {
              kind: "err",
              text: `No encuentro "${rest.join(" ")}". Prueba: ${Object.keys(OPEN_ALIASES).slice(0, 6).join(", ")}…`,
            },
          ];
        }
        launch(id);
        return out(`Abriendo ${APPS[id].title}…`);
      }
      default:
        return [
          {
            kind: "err",
            text: `"${cmdRaw}" no se reconoce como comando. Escribe help.`,
          },
        ];
    }
  }

  function submit() {
    const raw = value.trim();
    const echo: Line = { kind: "cmd", text: raw };
    setValue("");
    setCursor(null);
    if (!raw) {
      setLines((l) => [...l, echo]);
      return;
    }
    setHistory((h) => [...h, raw]);
    const result = run(raw);
    setLines((l) =>
      result === "clear"
        ? []
        : [...l, echo, ...result, { kind: "out", text: "" }],
    );
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const i = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown" && cursor !== null) {
      e.preventDefault();
      const i = cursor + 1;
      if (i >= history.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(i);
        setValue(history[i]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMANDS.map(([n]) => n.split(" ")[0]).find(
        (n) => value && n.startsWith(norm(value)),
      );
      if (match) setValue(match);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div className={styles.term} onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) => (
        <div key={i} className={`${styles.line} ${styles[l.kind]}`}>
          {l.kind === "cmd" ? (
            <>
              <span className={styles.prompt}>{PROMPT}</span> {l.text}
            </>
          ) : (
            l.text || " "
          )}
        </div>
      ))}
      <label className={`${styles.line} ${styles.inputRow}`}>
        <span className={styles.prompt}>{PROMPT}</span>
        <input
          ref={inputRef}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Línea de comandos"
        />
      </label>
      <div ref={endRef} />
    </div>
  );
}
