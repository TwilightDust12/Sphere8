export type Category = "Industrial" | "Residential" | "Institutional"
export interface Project {
  id: string
  title: string
  location: string
  category: Category
  discipline: string
  status?: string
  imageSrc?: string
  imageAlt: string
}
export const projects: Project[] = [
  {
    id: "01",
    title: "Glacier South Cold Storage — Phase 3",
    location: "Sucat, Parañaque City",
    category: "Industrial",
    discipline: "Structural design & consultancy",
    status: "Proposed",
    imageAlt: "Glacier South Cold Storage",
  },
  {
    id: "02",
    title: "WAM Warehouse Complex",
    location: "San Pedro City, Laguna",
    category: "Industrial",
    discipline: "Structural design & consultancy",
    status: "Proposed",
    imageAlt: "WAM Warehouse Complex",
  },
  {
    id: "03",
    title: "3-Storey Magallanes Residence",
    location: "Magallanes Village, Makati City",
    category: "Residential",
    discipline: "Structural design & consultancy",
    imageAlt: "Magallanes Residence",
  },
  {
    id: "04",
    title: "Three-Unit, Three-Storey Townhouse",
    location: "Kamuning, Quezon City",
    category: "Residential",
    discipline: "Residential project & design experience",
    status: "Proposed",
    imageAlt: "Three-unit townhouse",
  },
  {
    id: "05",
    title: "International Student Dormitory & Staff / Transient Quarters",
    location: "Camp Gen. Emilio Aguinaldo, Quezon City",
    category: "Institutional",
    discipline: "Engineering design",
    status: "Proposed",
    imageAlt: "International Student Dormitory",
  },
  {
    id: "06",
    title: "National Defense College Academic Building",
    location: "Camp Gen. Emilio Aguinaldo, Quezon City",
    category: "Institutional",
    discipline: "Engineering design",
    status: "Proposed",
    imageAlt: "National Defense College Academic Building",
  },
]
export const additionalProjects = [
  ["Calumpit RCDG Bridge", "Calumpit, Bulacan"],
  ["Visa Building", "Mamalateo Land Inc. · Structural design & consultancy"],
  ["Proposed Alsons Processing Plant", "Pueblo de Panay, Roxas City, Capiz"],
  ["Young Achiever’s School of Caloocan", "Bagumbong, Caloocan City"],
  ["Proposed Sta. Ana Poultry", "Sta. Maria, Sta. Ana, Pampanga"],
  ["Proposed VecoPaper Warehouse", "Buli, Muntinlupa City"],
  ["MCVI Warehouse with Office", "Brgy. Bancal, Meycauayan City, Bulacan"],
  ["Proposed CW Home Depot Warehouse", "GT Natural, Ortigas Center"],
  ["AISAT Fairview School Building", "Quezon City"],
  ["5-Storey Apartment with Penthouse", "Sta. Clara Street, City of Manila"],
  ["Theresa M-48 Townhouse", "2-storey townhouse · JMAX Builders"],
  ["Gantuanco Residence", "Quezon City"],
  ["Tamonte Residence", "Parañaque City"],
  ["Proposed Two-Storey Residence", "Citta Grande Subdivision, Lucena City"],
  [
    "Proposed Renovation of Two-Storey Residence",
    "Cambria Subdivision, Laguna",
  ],
  ["Proposed One-Storey Residence", "Pandi, Bulacan"],
  ["Proposed Three-Bedroom Unit", "RGR Subdivision, Lucena City"],
]
