import type { ComponentType } from 'react'

/** Props comunes de los iconos de aplicación (compatibles con los de Lucide usados en el resto de la UI). */
export interface IconProps {
  size?: number
  strokeWidth?: number
  'aria-hidden'?: boolean | 'true' | 'false'
  className?: string
}
export type IconComponent = ComponentType<IconProps>

const PALETTE: Record<string, string> = {'K': '#202124', 'W': '#ffffff', 'G': '#d4d4ce', 'D': '#858580', 'N': '#243b5a', 'A': '#b99a70', 'L': '#dccbaa', 'l': '#ecece8', 'M': '#b4b4ae', 'E': '#55554f', 'R': '#3f7d4e', 'r': '#2a5a36', 'X': '#e02020', 'Y': '#ffe600'}

/** Convierte una cuadrícula de píxeles en un icono SVG nítido (un trazo por color). */
function createPixelIcon(rows: string[], label: string): IconComponent {
  const width = rows[0].length
  const height = rows.length
  const paths = Object.entries(PALETTE).map(([char, fill]) => {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) if (row[x] === char) d += `M${x} ${y}h1v1h-1z`
    })
    return d ? { fill, d } : null
  })
  const Icon: IconComponent = ({ size = height, className, 'aria-hidden': hidden = true }) => (
    <svg
      className={className}
      width={(size * width) / height}
      height={size}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden={hidden}
    >
      {paths.map((p) => p && <path key={p.fill} fill={p.fill} d={p.d} />)}
    </svg>
  )
  Icon.displayName = label
  return Icon
}

export const HomeIcon = createPixelIcon(
  [
    '................',
    '.......KK.......',
    '......KNNK......',
    '.....KNNNNK.....',
    '....KNNNNNNK....',
    '...KNNNNNNNNK...',
    '..KNNNNNNNNNNK..',
    '.KNNNNNNNNNNNNK.',
    'KKKKKKKKKKKKKKKK',
    '.KWWWWWWWWWWWWK.',
    '.KWKKKKWWWWWWWK.',
    '.KWKDDKWWKKKKWK.',
    '.KWKDDKWWKAAKWK.',
    '.KWKKKKWWKAAKWK.',
    '.KKKKKKKKKKKKKK.',
    '................',
  ],
  'HomeIcon',
)

export const FolderIcon = createPixelIcon(
  [
    '................',
    '................',
    '.KKKKKKK........',
    '.KLLLLLKKKKKKK..',
    '.KLLLLLLLLLLLLK.',
    '.KLAAAAAAAAAAAK.',
    '.KLAAAAAAAAAAAK.',
    '.KLAAAAAAAAAAAK.',
    '.KLAAAAAAAAAAAK.',
    '.KLAAAAAAAAAAAK.',
    '.KLAAAAAAAAAAAK.',
    '.KLAAAAAAAAAAAK.',
    '.KAAAAAAAAAAAAK.',
    '.KKKKKKKKKKKKKK.',
    '................',
    '................',
  ],
  'FolderIcon',
)

export const ServicesIcon = createPixelIcon(
  [
    '................',
    '.KKKKKKKKKKKKKK.',
    '.KNNNNNNNNNNNWK.',
    '.KNNNNNNNNNNNNK.',
    '.KKKKKKKKKKKKKK.',
    '.KWWWWWWWWWWWWK.',
    '.KWDDDDDDDDDDWK.',
    '.KWWWWWWWWWWWWK.',
    '.KWDDDDDDDDWWWK.',
    '.KWWWWWWWWWWWWK.',
    '.KWDDDDDDDDDDWK.',
    '.KWWWWWWWWWWWWK.',
    '.KKKKKKKKKKKKKK.',
    '................',
    '................',
    '................',
  ],
  'ServicesIcon',
)

export const AboutIcon = createPixelIcon(
  [
    '................',
    '.....KKKKKK.....',
    '...KKNNNNNNKK...',
    '..KNNNNNNNNNNK..',
    '.KNNNNNWWNNNNNK.',
    '.KNNNNNWWNNNNNK.',
    '.KNNNNNNNNNNNNK.',
    '.KNNNNWWWNNNNNK.',
    '.KNNNNNWWNNNNNK.',
    '.KNNNNNWWNNNNNK.',
    '.KNNNNNWWNNNNNK.',
    '.KNNNNWWWWNNNNK.',
    '..KNNNNNNNNNNK..',
    '...KKNNNNNNKK...',
    '.....KKKKKK.....',
    '................',
  ],
  'AboutIcon',
)

export const ComputerIcon = createPixelIcon(
  [
    '................',
    '..KKKKKKKKKKKK..',
    '..KGGGGGGGGGGK..',
    '..KGNNNNNNNNGK..',
    '..KGNWNNNNNNGK..',
    '..KGNNNNNNNNGK..',
    '..KGNNNNNNNNGK..',
    '..KGNNNNNNNNGK..',
    '..KGNNNNNNNNGK..',
    '..KGGGGGGGGGGK..',
    '..KKKKKKKKKKKK..',
    '.....KGGGGK.....',
    '...KKKKKKKKKK...',
    '...KGGGGGGGGK...',
    '...KKKKKKKKKK...',
    '................',
  ],
  'ComputerIcon',
)

export const MailIcon = createPixelIcon(
  [
    '................',
    '................',
    '................',
    '................',
    '.KKKKKKKKKKKKKK.',
    '.KWWWWWWWWWWWWK.',
    '.KKWWWWWWWWWWKK.',
    '.KWKKWWWWWWKKWK.',
    '.KWWWKKWWKKWWWK.',
    '.KWWWWWKKWWWWWK.',
    '.KWWWWWWWWWWWWK.',
    '.KWWWWWWWWWWWWK.',
    '.KKKKKKKKKKKKKK.',
    '................',
    '................',
    '................',
  ],
  'MailIcon',
)

export const SettingsIcon = createPixelIcon(
  [
    '................',
    '.......KK.......',
    '..KK..KGGK..KK..',
    '..KGKKKGGKKKGK..',
    '...KGGGGGGGGK...',
    '..KKGGGKKGGGKK..',
    '.KGGGGKWWKGGGGK.',
    '.KGGGKWWWWKGGGK.',
    '.KGGGKWWWWKGGGK.',
    '.KGGGGKWWKGGGGK.',
    '..KKGGGKKGGGKK..',
    '...KGGGGGGGGK...',
    '..KGKKKGGKKKGK..',
    '..KK..KGGK..KK..',
    '.......KK.......',
    '................',
  ],
  'SettingsIcon',
)

export const PowerIcon = createPixelIcon(
  [
    '................',
    '.......NN.......',
    '.......NN.......',
    '...NN..NN..NN...',
    '..NNN..NN..NNN..',
    '.NNN...NN...NNN.',
    '.NN....NN....NN.',
    '.NN..........NN.',
    '.NN..........NN.',
    '.NNN........NNN.',
    '..NNN......NNN..',
    '...NNN....NNN...',
    '....NNNNNNNN....',
    '................',
    '................',
    '................',
  ],
  'PowerIcon',
)

export const RefreshIcon = createPixelIcon(
  [
    '................',
    '................',
    '.....NNNN..NNNN.',
    '...NNNNNN...NNN.',
    '...NNN.......NN.',
    '..NNN.........N.',
    '..NN........NN..',
    '..NN........NN..',
    '..NN........NN..',
    '..NN........NN..',
    '..NNN......NNN..',
    '...NNN....NNN...',
    '...NNNNNNNNNN...',
    '.....NNNNNN.....',
    '................',
    '................',
  ],
  'RefreshIcon',
)

export const ShieldIcon = createPixelIcon(
  [
    '..KKKKKKKKKKKK..',
    '.KNNNNNNNNNNNNK.',
    '.KNNNNNNNNNNNNK.',
    '.KNNNNNNNNNNNNK.',
    '.KNNNNNNNNNWNNK.',
    '.KNNNNNNNNWNNNK.',
    '.KNNNWNNNWNNNNK.',
    '.KNNNNWNWNNNNNK.',
    '.KNNNNNWNNNNNNK.',
    '..KNNNNNNNNNNK..',
    '...KNNNNNNNNK...',
    '....KNNNNNNK....',
    '.....KNNNNK.....',
    '......KNNK......',
    '.......KK.......',
    '................',
  ],
  'ShieldIcon',
)

export const ChatIcon = createPixelIcon(
  [
    '................',
    '..KKKKKKKKKKKK..',
    '.KWWWWWWWWWWWWK.',
    '.KWWWWWWWWWWWWK.',
    '.KWWWWWWWWWWWWK.',
    '.KWWWNWWNWWNWWK.',
    '.KWWWWWWWWWWWWK.',
    '.KWWWWWWWWWWWWK.',
    '.KWWWWWWWWWWWWK.',
    '.KWWWWWWWWWWWWK.',
    '..KWWKKKKKKKKK..',
    '..KWK...........',
    '...K............',
    '................',
    '................',
    '................',
  ],
  'ChatIcon',
)

export const DocumentIcon = createPixelIcon(
  [
    '...KKKKKKK......',
    '..KWWWWWWWKK....',
    '..KWWWWWWWGGK...',
    '..KWWWWWWWGGK...',
    '..KWWWWWWWWWWK..',
    '..KWWWWWWWWWWK..',
    '..KWWDDDDDDWWK..',
    '..KWWWWWWWWWWK..',
    '..KWWDDDDDDWWK..',
    '..KWWWWWWWWWWK..',
    '..KWWDDDDDDWWK..',
    '..KWWWWWWWWWWK..',
    '..KWWDDDDDDWWK..',
    '..KWWWWWWWWWWK..',
    '..KWWWWWWWWWWK..',
    '...KKKKKKKKKK...',
  ],
  'DocumentIcon',
)

export const OpenFolderIcon = createPixelIcon(
  [
    '................',
    '................',
    '.KKKKKKK........',
    '.KLLLLLLKKKKKK..',
    '.KLLLLLLLLLLLLK.',
    '.KLLLLLLLLLLLLK.',
    '.KLLKKKKKKKKKKKK',
    '.KLKAAAAAAAAAAAK',
    '.KKAAAAAAAAAAAAK',
    '..KAAAAAAAAAAAAK',
    '..KAAAAAAAAAAAAK',
    '..KAAAAAAAAAAAAK',
    '..KAAAAAAAAAAAAK',
    '..KKKKKKKKKKKKKK',
    '................',
    '................',
  ],
  'OpenFolderIcon',
)

export const ArrowIcon = createPixelIcon(
  [
    '................',
    '................',
    '................',
    '................',
    '.........KK.....',
    '..........KK....',
    '...........KK...',
    '..KKKKKKKKKKKK..',
    '..KKKKKKKKKKKK..',
    '...........KK...',
    '..........KK....',
    '.........KK.....',
    '................',
    '................',
    '................',
    '................',
  ],
  'ArrowIcon',
)

export const WebIcon = createPixelIcon(
  [
    '................',
    '.....KKKKKK.....',
    '....KNNWWNNK....',
    '...KNWNWWNWNK...',
    '..KNWWWWWWWWNK..',
    '.KNNWNNWWNNWNNK.',
    '.KNNWNNWWNNWNNK.',
    '.KWWWWWWWWWWWWK.',
    '.KWWWWWWWWWWWWK.',
    '.KNNWNNWWNNWNNK.',
    '.KNNWNNWWNNWNNK.',
    '..KNWWWWWWWWNK..',
    '...KNWNWWNWNK...',
    '....KNNWWNNK....',
    '.....KKKKKK.....',
    '................',
  ],
  'WebIcon',
)

export const CartIcon = createPixelIcon(
  [
    '................',
    '................',
    'KK..............',
    '..K.............',
    '...KKKKKKKKKKKK.',
    '....KAAAAAAAAAK.',
    '.....KAAAAAAAK..',
    '.....KAAAAAAAK..',
    '......KAAAAAK...',
    '.......KKKKK....',
    '................',
    '......KK...KK...',
    '......KK...KK...',
    '................',
    '................',
    '................',
  ],
  'CartIcon',
)

export const AutomationIcon = createPixelIcon(
  [
    '.KKKKK....KKKKK.',
    'KNNNNNK..KNNNNNK',
    'KNNNNNK..KNNNNNK',
    'KNNNNNKKKKNNNNNK',
    'KNNNNNK..KNNNNNK',
    'KNNNNNK..KNNNNNK',
    '.KKKKK....KKKKK.',
    '...K........K...',
    '...KKKKKKKKKK...',
    '.....KKKKKK.....',
    '....KAAAAAAK....',
    '....KAAAAAAK....',
    '....KAAAAAAK....',
    '....KAAAAAAK....',
    '....KAAAAAAK....',
    '.....KKKKKK.....',
  ],
  'AutomationIcon',
)

export const AIIcon = createPixelIcon(
  [
    '................',
    '.......KK.......',
    '......KAAK......',
    '...KKKKAAKKKK...',
    '..KNNNNNNNNNNK..',
    '..KNNNNNNNNNNK..',
    '.KKNNNNNNNNNNKK.',
    'KGGNNWWNNWWNNGGK',
    'KGGNNWWNNWWNNGGK',
    'KGGNNNNNNNNNNGGK',
    'KGGNNNNNNNNNNGGK',
    '.KKNNWWWWWWNNKK.',
    '..KNNNNNNNNNNK..',
    '..KNNNNNNNNNNK..',
    '...KKKKKKKKKK...',
    '................',
  ],
  'AIIcon',
)

export const MegaphoneIcon = createPixelIcon(
  [
    '................',
    '.............K..',
    '...........KKAK.',
    '.........KKAAAK.',
    '.......KKAAAAAK.',
    '..KKKKKAAAAAAAK.',
    '.KNNNNAAAAAAAAK.',
    '.KNNNNAAAAAAAAK.',
    '.KNNNNAAAAAAAAK.',
    '.KNNNNAAAAAAAAK.',
    '..KDDDKAAAAAAAK.',
    '..KDDDKKKAAAAAK.',
    '..KDDDK..KKAAAK.',
    '...KKK.....KKAK.',
    '.............K..',
    '................',
  ],
  'MegaphoneIcon',
)

export const SearchIcon = createPixelIcon(
  [
    '................',
    '.....KKKK.......',
    '...KKWWWWK......',
    '..KWWWWWWWK.....',
    '..KWWWWWWWWK....',
    '.KWWWWWWWWWK....',
    '.KWWWWWWWWWK....',
    '.KWWWWWWWWWK....',
    '.KWWWWWWWWWK....',
    '..KWWWWWWAAK....',
    '...KWWWWWAAAK...',
    '....KKKKKKAAAK..',
    '..........KAAAK.',
    '...........KAAAK',
    '............KAAK',
    '.............KK.',
  ],
  'SearchIcon',
)

/* Glifos de los botones de la barra de título (cuadrícula propia, tamaño nativo en píxeles). */
export const CloseGlyph = createPixelIcon(
  [
    'KK....KK',
    '.KK..KK.',
    '..KKKK..',
    '...KK...',
    '...KK...',
    '..KKKK..',
    '.KK..KK.',
    'KK....KK',
  ],
  'CloseGlyph',
)

export const MaximizeGlyph = createPixelIcon(
  [
    'KKKKKKKKKK',
    'KKKKKKKKKK',
    'K........K',
    'K........K',
    'K........K',
    'K........K',
    'K........K',
    'K........K',
    'K........K',
    'KKKKKKKKKK',
  ],
  'MaximizeGlyph',
)

export const RestoreGlyph = createPixelIcon(
  [
    '...KKKKKKK',
    '...KKKKKKK',
    '...K.....K',
    'KKKKKKK..K',
    'KKKKKKK..K',
    'K.....K..K',
    'K.....KKKK',
    'K.....K...',
    'K.....K...',
    'KKKKKKK...',
  ],
  'RestoreGlyph',
)

export const MinimizeGlyph = createPixelIcon(
  [
    'KKKKKKKK',
    'KKKKKKKK',
  ],
  'MinimizeGlyph',
)

export const SpeakerIcon = createPixelIcon(
  [
    '................',
    '................',
    '.......K........',
    '......KGK.......',
    '.....KGGK...K...',
    '..KKKGGGK..KK...',
    '.KGGGGGGK.K.K...',
    '.KGGGGGGK.K.K...',
    '.KGGGGGGK.K.K...',
    '.KGGGGGGK.K.K...',
    '..KKKGGGK..KK...',
    '.....KGGK...K...',
    '......KGK.......',
    '.......K........',
    '................',
    '................',
  ],
  'SpeakerIcon',
)

export const SpeakerMuteIcon = createPixelIcon(
  [
    '................',
    '................',
    '.......K........',
    '......KGK.......',
    '.....KGGK.......',
    '..KKKGGGK.K...K.',
    '.KGGGGGGK..K.K..',
    '.KGGGGGGK...K...',
    '.KGGGGGGK..K.K..',
    '.KGGGGGGK.K...K.',
    '..KKKGGGK.......',
    '.....KGGK.......',
    '......KGK.......',
    '.......K........',
    '................',
    '................',
  ],
  'SpeakerMuteIcon',
)

/* Papelera de reciclaje: 32×32 para el escritorio (48px, ×1,5) y 16×16 para tamaños pequeños. */
export const RecycleBinEmpty32Icon = createPixelIcon(
  [
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '...............DDDDDDDDDD.......',
    '.....DDDDDDDDDDlllllllEElK......',
    '....DllllllEEEEEEEEEEEEEllK.....',
    '...DlllllEEEEEEEEEEElllllllK....',
    '....KlllllllllllllllllllEKK.....',
    '.....KWWllGGGGGGMlllDDEEEK......',
    '.....DWWllGGGGGGMMMDDDEEEK......',
    '.....DWWllGrGrGGMMMDDDEEEK......',
    '.....DWWllRrGRRrMMMDDDEEEK......',
    '......KWWlRrGRRRrMMDDDEEEK......',
    '......DWRRrGGrrrMMDDDDEEEK......',
    '......DWRRRrGGGRrMDDDEEEK.......',
    '......DWRrrGGGGrrMDDDEEEK.......',
    '......DWrlGGGrGMrMDDDEEEK.......',
    '......DWlRRRRRRrMMDDDEEEK.......',
    '.......KWrrrrRrrMMDDDEEEK.......',
    '.......DWllGGrGGMMDDDEEEK.......',
    '.......DWllGGGGGMMDDDEEEK.......',
    '........KWllGGGGMMDDEEKK........',
    '.........KKKKKWGGMDKKK..........',
    '..............KKKKK.............',
    '................................',
  ],
  'RecycleBinEmpty32Icon',
)

export const RecycleBinFull32Icon = createPixelIcon(
  [
    '................................',
    '................................',
    '................................',
    '.................DDD............',
    '...........D....DWWWKD..........',
    '..........DWK..DWMWWWWK.........',
    '.........DWWWKDWWMWWWWWK........',
    '........DMWWWWKWWWWWWWWK........',
    '.......DWMWWWWKWWWWWWWWK........',
    '.......DWWWWWWWWWWWWWMWWK.......',
    '.......DWWWWWWWWWWWWWWWWK.......',
    '.....DDDWWWWWWWlllllllEElK......',
    '....DllllllEEEEEEEEEEEEEllK.....',
    '...DlllllEEEEEEEEEEElllllllK....',
    '....KlllllllllllllllllllEKK.....',
    '.....KWWllGGGGGGMlllDDEEEK......',
    '.....DWWllGGGGGGMMMDDDEEEK......',
    '.....DWWllGrGrGGMMMDDDEEEK......',
    '.....DWWllRrGRRrMMMDDDEEEK......',
    '......KWWlRrGRRRrMMDDDEEEK......',
    '......DWRRrGGrrrMMDDDDEEEK......',
    '......DWRRRrGGGRrMDDDEEEK.......',
    '......DWRrrGGGGrrMDDDEEEK.......',
    '......DWrlGGGrGMrMDDDEEEK.......',
    '......DWlRRRRRRrMMDDDEEEK.......',
    '.......KWrrrrRrrMMDDDEEEK.......',
    '.......DWllGGrGGMMDDDEEEK.......',
    '.......DWllGGGGGMMDDDEEEK.......',
    '........KWllGGGGMMDDEEKK........',
    '.........KKKKKWGGMDKKK..........',
    '..............KKKKK.............',
    '................................',
  ],
  'RecycleBinFull32Icon',
)

export const RecycleBinEmpty16Icon = createPixelIcon(
  [
    '................',
    '................',
    '................',
    '................',
    '..........DD....',
    '..DDDDDDDDllK...',
    '.DlEEEEEEEEllK..',
    '..KWlllllllEEK..',
    '..DWlGGMMDDEK...',
    '..DWlrGrMDDEK...',
    '..DWrGGrMDDEK...',
    '...KrlrGrDDEK...',
    '...DWrrrMDDEK...',
    '...DWlGGMDDEK...',
    '....KKWGMDKK....',
    '......KKKK......',
  ],
  'RecycleBinEmpty16Icon',
)

export const RecycleBinFull16Icon = createPixelIcon(
  [
    '................',
    '........DDD.....',
    '....DDDDWWWK....',
    '...DMWWWMWMK....',
    '...DWWWWMWMWK...',
    '..DDWWWWWWllK...',
    '.DlEEEEEEEEllK..',
    '..KWlllllllEEK..',
    '..DWlGGMMDDEK...',
    '..DWlrGrMDDEK...',
    '..DWrGGrMDDEK...',
    '...KrlrGrDDEK...',
    '...DWrrrMDDEK...',
    '...DWlGGMDDEK...',
    '....KKWGMDKK....',
    '......KKKK......',
  ],
  'RecycleBinFull16Icon',
)

export const FlaskIcon = createPixelIcon(
  [
    '................',
    '.....KKKKKK.....',
    '......KWWK......',
    '......KWWK......',
    '......KWWK......',
    '.....KWWWWK.....',
    '....KWWWWWWK....',
    '...KWWNNNNWWK...',
    '..KWWNNNNNNWWK..',
    '..KWNNNNNNNNWK..',
    '.KWWNNNNNNNNWWK.',
    '.KWWNNNNNNNNWWK.',
    '.KWWWNNNNNNWWWK.',
    '..KKKKKKKKKKKK..',
    '................',
    '................',
  ],
  'FlaskIcon',
)

export const ArrowUpRightIcon =createPixelIcon(
  [
    '................',
    '................',
    '................',
    '.......KKKKKK...',
    '.......KKKKKK...',
    '..........KKK...',
    '.........KKKK...',
    '........KK.KK...',
    '.......KK..KK...',
    '......KK........',
    '.....KK.........',
    '....KK..........',
    '................',
    '................',
    '................',
    '................',
  ],
  'ArrowUpRightIcon',
)

export const UserIcon = createPixelIcon(
  [
    '................',
    '................',
    '......KKKK......',
    '.....KNNNNK.....',
    '....KNNNNNNK....',
    '....KNNNNNNK....',
    '....KNNNNNNK....',
    '....KNNNNNNK....',
    '.....KNNNNK.....',
    '.....KKKKKK.....',
    '....KNNNNNNK....',
    '...KNNNNNNNNK...',
    '..KNNNNNNNNNNK..',
    '.KNNNNNNNNNNNNK.',
    '.KNNNNNNNNNNNNK.',
    '..KKKKKKKKKKKK..',
  ],
  'UserIcon',
)

export const TerminalIcon = createPixelIcon(
  [
    '................',
    '.EEEEEEEEEEEEEE.',
    '.ENNNNNNNNNNNWE.',
    '.EEEEEEEEEEEEEE.',
    '.EKKKKKKKKKKKKE.',
    '.EKRKKKKKKKKKKE.',
    '.EKKRKKKKKKKKKE.',
    '.EKKKRKKKKKKKKE.',
    '.EKKRKKKKKKKKKE.',
    '.EKRKKKKKKKKKKE.',
    '.EKKKKRRRRKKKKE.',
    '.EKKKKKKKKKKKKE.',
    '.EKKKKKKKKKKKKE.',
    '.EEEEEEEEEEEEEE.',
    '................',
    '................',
  ],
  'TerminalIcon',
)

export const MinesweeperIcon = createPixelIcon(
  [
    '................',
    '.WWWWWWWWWWWWWD.',
    '.WGGGGGGGGGGGGD.',
    '.WGGGGGKKGGGGGD.',
    '.WGGKGGKKGGKGGD.',
    '.WGGGGXXXXGGGGD.',
    '.WGGGXWXXXXGGGD.',
    '.WGKKXWXXXXKKGD.',
    '.WGKKXXXXXXKKGD.',
    '.WGGGXXXXXXGGGD.',
    '.WGGGGXXXXGGGGD.',
    '.WGGKGGKKGGKGGD.',
    '.WGGGGGKKGGGGGD.',
    '.DDDDDDDDDDDDDD.',
    '................',
    '................',
  ],
  'MinesweeperIcon',
)

export const FaceHappyIcon = createPixelIcon(
  [
    '................',
    '.....KKKKKK.....',
    '...KKYYYYYYKK...',
    '..KYYYYYYYYYYK..',
    '.KYYYYYYYYYYYYK.',
    '.KYYYKYYYYKYYYK.',
    '.KYYYKYYYYKYYYK.',
    '.KYYYYYYYYYYYYK.',
    '.KYYYYYYYYYYYYK.',
    '.KYYKYYYYYYKYYK.',
    '.KYYYKKKKKKYYYK.',
    '..KYYYYYYYYYYK..',
    '...KKYYYYYYKK...',
    '.....KKKKKK.....',
    '................',
    '................',
  ],
  'FaceHappyIcon',
)

export const FaceWowIcon = createPixelIcon(
  [
    '................',
    '.....KKKKKK.....',
    '...KKYYYYYYKK...',
    '..KYYYYYYYYYYK..',
    '.KYYYYYYYYYYYYK.',
    '.KYYYKYYYYKYYYK.',
    '.KYYYKYYYYKYYYK.',
    '.KYYYYYYYYYYYYK.',
    '.KYYYYYYYYYYYYK.',
    '.KYYYYKKKKYYYYK.',
    '.KYYYYKYYKYYYYK.',
    '..KYYYKKKKYYYK..',
    '...KKYYYYYYKK...',
    '.....KKKKKK.....',
    '................',
    '................',
  ],
  'FaceWowIcon',
)

export const FaceWinIcon = createPixelIcon(
  [
    '................',
    '.....KKKKKK.....',
    '...KKYYYYYYKK...',
    '..KYYYYYYYYYYK..',
    '.KYYYYYYYYYYYYK.',
    '.KYKKKKYYKKKKYK.',
    '.KYYKKYYYYKKYYK.',
    '.KYYYYYYYYYYYYK.',
    '.KYYYYYYYYYYYYK.',
    '.KYYKYYYYYYKYYK.',
    '.KYYYKKKKKKYYYK.',
    '..KYYYYYYYYYYK..',
    '...KKYYYYYYKK...',
    '.....KKKKKK.....',
    '................',
    '................',
  ],
  'FaceWinIcon',
)

export const FaceLostIcon = createPixelIcon(
  [
    '................',
    '.....KKKKKK.....',
    '...KKYYYYYYKK...',
    '..KYYYYYYYYYYK..',
    '.KYYYYYYYYYYYYK.',
    '.KYYKYKYYKYKYYK.',
    '.KYYYKYYYYKYYYK.',
    '.KYYKYKYYKYKYYK.',
    '.KYYYYYYYYYYYYK.',
    '.KYYYKKKKKKYYYK.',
    '.KYYKYYYYYYKYYK.',
    '..KYYYYYYYYYYK..',
    '...KKYYYYYYKK...',
    '.....KKKKKK.....',
    '................',
    '................',
  ],
  'FaceLostIcon',
)
