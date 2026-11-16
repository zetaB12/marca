import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import SystemDialog from '../../components/SystemDialog/SystemDialog'
import parts from '../../components/SystemDialog/dialogParts.module.css'
import { ArrowIcon, ComputerIcon, RefreshIcon } from '../../components/PixelIcon/pixelIcons'
import { TYPE_LABEL, findNode, nodesOf, pathLabel, type FsNode } from '../../data/filesystem'
import { selectPath, useExplorerStore, type ExplorerSort, type ExplorerView } from '../../store/explorerStore'
import { useWindowStore } from '../../store/windowStore'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import ExplorerMenu, { type MenuEntry } from './ExplorerMenu'
import styles from './MyComputerApp.module.css'

const isTouch = () => window.matchMedia('(pointer: coarse)').matches
const LARGE = 48
const SMALL = 16

const sortNodes = (nodes: FsNode[], sort: ExplorerSort) =>
  [...nodes].sort((a, b) => {
    const folders = Number(!!b.children) - Number(!!a.children)
    if (folders) return folders
    if (sort === 'type') {
      const t = TYPE_LABEL[a.type].localeCompare(TYPE_LABEL[b.type])
      if (t) return t
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  })

interface MenuState {
  x: number
  y: number
  node: FsNode | null
}

/** Explorador de archivos de N. Digital Studio (C:\N-DIGITAL-STUDIO). */
export default function MyComputerApp() {
  const path = useExplorerStore(selectPath)
  const canBack = useExplorerStore((s) => s.index > 0)
  const canForward = useExplorerStore((s) => s.index < s.history.length - 1)
  const view = useExplorerStore((s) => s.view)
  const sort = useExplorerStore((s) => s.sort)
  const selectedId = useExplorerStore((s) => s.selectedId)
  const { back, forward, up, navigate, select, setView, setSort, openNode, refresh } = useExplorerStore.getState()
  const openWindow = useWindowStore((s) => s.openWindow)

  const [menu, setMenu] = useState<MenuState | null>(null)
  const [propsOf, setPropsOf] = useState<FsNode | null>(null)
  const press = useRef<{ timer: number; x: number; y: number } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const trail = nodesOf(path)
  const current = trail[trail.length - 1]
  const items = sortNodes(current?.children ?? [], sort)
  const selected = items.find((n) => n.id === selectedId) ?? null
  const label = pathLabel(path)

  // Al cambiar de carpeta, el contenido vuelve arriba.
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 })
  }, [label])

  const cancelPress = () => {
    if (press.current) window.clearTimeout(press.current.timer)
    press.current = null
  }

  const onItemClick = (e: MouseEvent, node: FsNode) => {
    // Teclado (detail 0) y táctil abren de inmediato; con ratón un clic selecciona y el doble clic abre.
    if (e.detail === 0 || isTouch()) openNode(node)
    else select(node.id)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (menu || propsOf) return
    if (e.altKey && e.key === 'ArrowLeft') back()
    else if (e.altKey && e.key === 'ArrowRight') forward()
    else if (e.key === 'Backspace') up()
    else if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !e.altKey) {
      const buttons = [...(listRef.current?.querySelectorAll<HTMLButtonElement>('[data-item]') ?? [])]
      const i = buttons.indexOf(document.activeElement as HTMLButtonElement)
      if (i < 0) return
      const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
      buttons[(i + step + buttons.length) % buttons.length]?.focus()
    } else return
    e.preventDefault()
  }

  const viewEntries = (): MenuEntry[] => [
    { kind: 'heading', label: 'View' },
    ...(['icons', 'list'] as ExplorerView[]).map<MenuEntry>((v) => ({
      kind: 'item',
      label: v === 'icons' ? 'Large Icons' : 'List',
      checked: view === v,
      onSelect: () => setView(v),
    })),
    { kind: 'sep' },
    { kind: 'heading', label: 'Sort by' },
    ...(['name', 'type'] as ExplorerSort[]).map<MenuEntry>((k) => ({
      kind: 'item',
      label: k === 'name' ? 'Name' : 'Type',
      checked: sort === k,
      onSelect: () => setSort(k),
    })),
  ]

  const menuEntries = (): MenuEntry[] => {
    const node = menu?.node
    if (node) {
      return [
        { kind: 'item', label: 'Open', onSelect: () => openNode(node) },
        { kind: 'sep' },
        { kind: 'item', label: 'Properties', onSelect: () => setPropsOf(node) },
      ]
    }
    return [{ kind: 'item', label: 'Refresh', icon: <RefreshIcon size={16} />, onSelect: refresh }, { kind: 'sep' }, ...viewEntries()]
  }

  return (
    <div className={shared.app} onKeyDown={onKeyDown}>
      <div className={styles.toolbar} role="toolbar" aria-label="Navigation">
        <button type="button" className={styles.tool} disabled={!canBack} onClick={back} title="Back (Alt+Left)">
          <ArrowIcon size={16} className={styles.flip} />
          <span className={styles.toolText}>Back</span>
        </button>
        <button type="button" className={styles.tool} disabled={!canForward} onClick={forward} title="Forward (Alt+Right)">
          <span className={styles.toolText}>Forward</span>
          <ArrowIcon size={16} />
        </button>
        <button type="button" className={styles.tool} disabled={path.length < 2} onClick={up} title="Up (Backspace)">
          <ArrowIcon size={16} className={styles.rotUp} />
          <span className={styles.toolText}>Up</span>
        </button>
        <span className={styles.gap} aria-hidden />
        <button
          type="button"
          className={styles.tool}
          aria-pressed={view === 'icons'}
          onClick={() => setView('icons')}
          title="Large Icons"
        >
          Icons
        </button>
        <button type="button" className={styles.tool} aria-pressed={view === 'list'} onClick={() => setView('list')} title="List">
          List
        </button>
        <span className={styles.gap} aria-hidden />
        <button type="button" className={styles.tool} onClick={() => openWindow('sysprops')} title="System Properties">
          <ComputerIcon size={16} />
          <span className={styles.toolText}>Properties</span>
        </button>
      </div>

      <div className={styles.address}>
        <span className={styles.addressLabel}>Address</span>
        <nav className={styles.crumbs} aria-label="Current path">
          {trail.map((n, i) => (
            <span key={n.id} className={styles.crumbWrap}>
              {i > 0 && <span aria-hidden>{'\\'}</span>}
              <button
                type="button"
                className={styles.crumb}
                aria-current={i === trail.length - 1 ? 'page' : undefined}
                onClick={() => navigate(path.slice(0, i + 1))}
              >
                {n.name}
              </button>
            </span>
          ))}
        </nav>
      </div>

      <div
        ref={listRef}
        className={`${styles.content} ${view === 'icons' ? styles.icons : styles.list}`}
        role="listbox"
        aria-label={`Contents of ${label}`}
        onPointerDown={(e) => {
          if (e.target !== e.currentTarget) return
          select(null)
          if (e.pointerType === 'touch') {
            const { clientX: x, clientY: y } = e
            cancelPress()
            press.current = {
              x,
              y,
              timer: window.setTimeout(() => {
                press.current = null
                setMenu({ x, y, node: null })
              }, 550),
            }
          }
        }}
        onPointerMove={(e) => {
          const p = press.current
          if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) cancelPress()
        }}
        onPointerUp={cancelPress}
        onPointerCancel={cancelPress}
        onContextMenu={(e) => {
          e.preventDefault()
          const el = (e.target as HTMLElement).closest<HTMLElement>('[data-item]')
          const node = el?.dataset.item ? findNode(el.dataset.item) : null
          if (node) select(node.id)
          setMenu({ x: e.clientX, y: e.clientY, node })
        }}
      >
        {items.length === 0 && <p className={styles.empty}>This folder is empty.</p>}
        {items.map((node) => {
          const Icon = node.icon
          const active = node.id === selectedId
          return (
            <button
              key={node.id}
              type="button"
              role="option"
              aria-selected={active}
              data-item={node.id}
              title={node.description}
              className={`${styles.item} ${active ? styles.selected : ''}`}
              onClick={(e) => onItemClick(e, node)}
              onFocus={() => select(node.id)}
              onDoubleClick={() => openNode(node)}
            >
              <span className={styles.glyph}>
                <Icon size={view === 'icons' ? LARGE : SMALL} />
              </span>
              <span className={styles.name}>{node.name}</span>
            </button>
          )
        })}
      </div>

      <Statusbar>
        <span className={styles.stat}>{items.length} object(s)</span>
        <span className={`${styles.stat} ${styles.statGrow}`}>
          {selected ? `${selected.name} — ${TYPE_LABEL[selected.type]}` : current?.name}
        </span>
        <span className={`${styles.stat} ${styles.statPath}`}>{label}</span>
      </Statusbar>

      {menu && <ExplorerMenu x={menu.x} y={menu.y} label="Explorer" entries={menuEntries()} onClose={() => setMenu(null)} />}

      {propsOf && <PropertiesDialog node={propsOf} location={label} onClose={() => setPropsOf(null)} />}
    </div>
  )
}

function PropertiesDialog({ node, location, onClose }: { node: FsNode; location: string; onClose: () => void }) {
  const Icon = node.icon
  return (
    <SystemDialog title={`${node.name} Properties`} icon={<Icon size={16} />} onClose={onClose}>
      <div className={parts.body}>
        <div className={styles.propHead}>
          <Icon size={32} />
          <strong>{node.name}</strong>
        </div>
        <dl className={styles.propList}>
          <dt>Type</dt>
          <dd>{TYPE_LABEL[node.type]}</dd>
          <dt>Location</dt>
          <dd>{location}</dd>
          {node.children && (
            <>
              <dt>Contains</dt>
              <dd>{node.children.length} object(s)</dd>
            </>
          )}
          <dt>Description</dt>
          <dd>{node.description}</dd>
        </dl>
        <div className={parts.buttons}>
          <button type="button" className={parts.btn} data-autofocus onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </SystemDialog>
  )
}
