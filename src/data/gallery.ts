export type RoleKey = "construction" | "subcontract" | "engineering" | "fitout" | "interior" | "design"
export type FilterKey = "all" | "construction" | "interiors" | "engineering" | "design"

export const roles: Record<RoleKey, {
  label: string
  filter: Exclude<FilterKey, "all">
}> = {
  construction: { label: "Construction contract", filter: "construction" },
  subcontract: { label: "Sub-contract works", filter: "construction" },
  engineering: {
    label: "Structural design and value engineering",
    filter: "engineering",
  },
  fitout: { label: "Interior fit-out", filter: "interiors" },
  interior: { label: "Interior project", filter: "interiors" },
  design: { label: "Architectural and engineering design", filter: "design" },
}

export interface FilterOption {
  key: FilterKey
  label: string
}

export const filters: FilterOption[] = [
  { key: "all", label: "All" },
  { key: "construction", label: "Construction" },
  { key: "interiors", label: "Interiors" },
  { key: "engineering", label: "Engineering" },
  { key: "design", label: "Design renders" },
]

export interface Photo {
  id: string
  width: number
  height: number
  alt: string
  title: string
  role: RoleKey
  label?: string
  location?: string
  discipline?: string
  credit?: string
  status?: string
  placeholder?: boolean
}

/** The first FEATURED_COUNT photos are the curated set shown by default.
 * They are ordered strongest first and cover every group; the rest sit behind "Show all". */
export const FEATURED_COUNT = 12

export const photos: Photo[] = [
  {
    id: "05-07",
    width: 1600,
    height: 1200,
    alt: "Two-storey house with dark stone cladding, a glass balcony and a timber door",
    title: "Two-Storey Residence with Stone Cladding",
    role: "construction",
  },
  {
    id: "02-03",
    width: 1200,
    height: 896,
    alt: "Two-storey house with a basement garage and a pickup truck parked in front",
    title: "Two-Storey Residence with Basement",
    role: "construction",
    location: "Ayala Greenfields Estates, Laguna",
  },
  {
    id: "09-04",
    width: 1468,
    height: 755,
    alt: "Beachfront resort pool with a clubhouse and palm trees",
    title: "Beachfront Resort Pool and Clubhouse",
    role: "construction",
  },
  {
    id: "22-04",
    width: 1200,
    height: 1600,
    alt: "Dining room with a long timber table, upholstered chairs and a lit ceiling",
    title: "Dining Room Interior",
    role: "interior",
  },
  {
    id: "17-04",
    width: 1004,
    height: 596,
    alt: "Steel roof framing of a warehouse with office, inside a half-built shell",
    title: "MCVI Warehouse with Office",
    role: "engineering",
    location: "Brgy. Bancal, Meycauayan City, Bulacan",
    discipline: "Structural design",
  },
  {
    id: "29-08",
    width: 1072,
    height: 992,
    alt: "Rendered corner residence with timber screens, a car port and landscaped yard",
    title: "Corner Residence",
    role: "design",
  },
  {
    id: "06-03",
    width: 1600,
    height: 1200,
    alt: "Two-storey house with a stone wall, timber gate and wide driveway",
    title: "Two-Storey Residence",
    role: "construction",
  },
  {
    id: "20-04",
    width: 1600,
    height: 1200,
    alt: "Dental clinic reception with a timber counter, an arched alcove and rattan chairs",
    title: "Dr. Pauline Lucero Dental Clinic",
    role: "fitout",
    location: "Lucena City",
  },
  {
    id: "23-10",
    width: 1600,
    height: 1200,
    alt: "Open timber staircase rising from a double-height hall with large windows",
    title: "Staircase and Double-Height Hall",
    role: "interior",
  },
  {
    id: "31-06",
    width: 1600,
    height: 1178,
    alt: "Rendered two-storey house with black columns and a timber entrance",
    title: "Two-Storey Residence",
    role: "design",
  },
  {
    id: "07-10",
    width: 1200,
    height: 896,
    alt: "Two-storey house with a glass-walled ground floor and a roof terrace",
    title: "Two-Storey Residence with Glass Facade",
    role: "construction",
  },
  {
    id: "33-07",
    width: 1600,
    height: 900,
    alt: "Rendered hillside villa with a swimming pool and palm trees",
    title: "Hillside Pool Villa",
    role: "design",
  },
  {
    id: "10-04",
    width: 1200,
    height: 896,
    alt: "Single-storey house with stone cladding, a timber deck and wide glass doors",
    title: "Single-Storey Residence with Pool",
    role: "construction",
  },
  {
    id: "11-07",
    width: 1600,
    height: 1200,
    alt: "Bright living area with arched openings, a white sofa and a kitchen bar",
    title: "Living Area Interior",
    role: "construction",
  },
  {
    id: "03-07",
    width: 1548,
    height: 1161,
    alt: "Two-storey corner house with a tall glazed stair window and landscaped front",
    title: "Two-Storey Corner Residence",
    role: "construction",
  },
  {
    id: "30-03",
    width: 1168,
    height: 912,
    alt: "Rendered modern house with a roof deck, timber cladding and a car in the drive",
    title: "Modern Residence with Roof Deck",
    role: "design",
  },
  {
    id: "21-09",
    width: 1200,
    height: 896,
    alt: "Clinic reception with a timber slat ceiling and a curved wooden counter",
    title: "Dental Clinic Reception",
    role: "fitout",
  },
  {
    id: "32-06",
    width: 1600,
    height: 900,
    alt: "Rendered pool house with a timber roof overhang and palm trees",
    title: "Pool Residence",
    role: "design",
  },
  {
    id: "31-04",
    width: 1600,
    height: 900,
    alt: "Rendered single-storey house with a dark roof and a paved courtyard",
    title: "Single-Storey Residence",
    role: "design",
  },
  {
    id: "03-11",
    width: 928,
    height: 1152,
    alt: "Rendered elevation of a three-unit, three-storey townhouse with garage doors",
    title: "Three-Unit, Three-Storey Townhouse",
    role: "construction",
    location: "Kamuning, Quezon City",
    status: "Render",
    credit: "Architect: Donica Elden Reyes, Sphere8",
  },
  {
    id: "16-04",
    width: 907,
    height: 698,
    alt: "Steel frame of a cold storage building with a crane, above a structural model",
    title: "Glacier South Cold Storage, Phase 4",
    role: "engineering",
    location: "AMVEL Business Park, Sucat, Parañaque City",
    discipline: "Structural design and consultancy",
    credit: "Client: Phil-Nippon Kyoei Corporation",
  },
  {
    id: "15-05",
    width: 862,
    height: 405,
    alt: "Structural models of warehouse buildings beside a site photograph",
    title: "WWAM Warehouse Complex",
    role: "engineering",
    location: "San Pedro City, Laguna",
    discipline: "Structural design and consultancy",
    credit: "Client: Worldwide Apparel Mfg. Inc.",
  },
  {
    id: "14-03",
    width: 721,
    height: 380,
    alt: "Rendered view of a student dormitory building in a green setting",
    title: "International Student Dormitory",
    role: "engineering",
    label: "Engineering design",
    location: "Camp Gen. Emilio Aguinaldo, Quezon City",
    discipline:
      "Structural, electrical, mechanical, fire protection and plumbing design",
    status: "Proposed",
  },
  {
    id: "15-03",
    width: 444,
    height: 237,
    alt: "Rendered view of an academic building with a blue glass facade",
    title: "National Defense College Academic Building",
    role: "engineering",
    label: "Engineering design",
    location: "Camp Gen. Emilio Aguinaldo, Quezon City",
    discipline:
      "Structural, electrical, mechanical, fire protection and plumbing design",
    status: "Proposed",
  },
  {
    id: "13-08",
    width: 510,
    height: 348,
    alt: "Green steel frame under erection with a crane beside it",
    title: "Steel Frame Erection",
    role: "subcontract",
  },
]

export function roleLabel(photo: Photo): string {
  return photo.label ?? roles[photo.role].label
}

export function filterPhotos(list: Photo[], key: FilterKey): Photo[] {
  if (key === "all") return list
  return list.filter((photo) => roles[photo.role].filter === key)
}

export function countByFilter(list: Photo[]): Record<FilterKey, number> {
  return {
    all: list.length,
    construction: filterPhotos(list, "construction").length,
    interiors: filterPhotos(list, "interiors").length,
    engineering: filterPhotos(list, "engineering").length,
    design: filterPhotos(list, "design").length,
  }
}
