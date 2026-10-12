export interface ExperienceItem {
  name: string
  place?: string
  note?: string
}

export interface ExperienceGroup {
  heading: string
  items: ExperienceItem[]
}

export const experienceGroups: ExperienceGroup[] = [
  {
    heading: "Design planning and engineering consultancy",
    items: [
      {
        name: "International Student Dormitory and Staff / Transient Quarters",
        place: "Camp Gen. Emilio Aguinaldo, Quezon City",
        note: "Structural, electrical, mechanical, fire protection and plumbing design",
      },
      {
        name: "National Defense College Academic Building with Amphitheater",
        place: "Camp Gen. Emilio Aguinaldo, Quezon City",
        note: "Structural, electrical, mechanical, fire protection and plumbing design",
      },
      {
        name: "Grand Pavilion 2, Felizza Jazz Compound",
        place: "Malolos, Bulacan",
        note: "Architectural, structural and sanitary / plumbing design",
      },
      {
        name: "Subdivision site development planning",
        place: "Pulong Saging, Silang, Cavite",
        note: "Civil site development for Pacrim Dev. Corporation",
      },
    ],
  },
  {
    heading: "Structural design and consultancy",
    items: [
      { name: "Calumpit RCDG Bridge, 15 meter", place: "Calumpit, Bulacan" },
      {
        name: "Siena Building, 4-storey with roof deck",
        place: "Mabilis St., V. Luna, Quezon City",
        note: "Value engineering. Architect: Archtrike",
      },
      {
        name: "Visa Building, 3-storey residence",
        place: "Mamalateo Land Inc.",
        note: "Architect: Archtrike",
      },
      {
        name: "Glacier South Cold Storage, Phase 3 with mezzanine office",
        place: "AMVEL Business Park, Sucat, Parañaque City",
        note: "Phil-Nippon Kyoei Corporation",
      },
      {
        name: "Glacier South Cold Storage, Phase 4",
        place: "AMVEL Business Park, Sucat, Parañaque City",
        note: "Phil-Nippon Kyoei Corporation",
      },
      {
        name: "Alsons Processing Plant",
        place: "Pueblo de Panay, Roxas City, Capiz",
        note: "Phil-Nippon Kyoei Corporation",
      },
      {
        name: "WWAM Warehouse Complex",
        place: "San Pedro City, Laguna",
        note: "Worldwide Apparel Mfg. Inc.",
      },
      {
        name: "Young Achiever’s School of Caloocan, 4-storey",
        place: "Bagumbong, Caloocan City",
      },
    ],
  },
  {
    heading: "Residential, commercial, office, storage and water tank projects",
    items: [
      {
        name: "Sta. Ana Poultry",
        place: "Sta. Maria, Sta. Ana, Pampanga",
        note: "Redesign and value engineering. Contractor: Building Blocks Construction Corp.",
      },
      {
        name: "VecoPaper Warehouse",
        place: "Concepcion St., Buli, Muntinlupa City",
        note: "Contractor: Building Blocks Construction Corp.",
      },
      { name: "5-Storey Apartment with Penthouse", place: "Sta. Clara St., City of Manila" },
      {
        name: "MCVI Warehouse with Office",
        place: "Brgy. Bancal, Meycauayan City, Bulacan",
        note: "Mandarin Credit Ventures, Inc.",
      },
      { name: "CW Home Depot Warehouse", place: "GT Natural, Ortigas Center" },
      { name: "3-Storey Magallanes Residence", place: "Magallanes Village, Makati City" },
      {
        name: "AISAT Fairview Campus, 4-storey school building",
        place: "Quezon City",
        note: "JMAX Builders",
      },
      { name: "Revision design of a 2-storey commercial building" },
      { name: "Theresa M-48 Townhouse, 11 units, 2-storey", note: "JMAX Builders" },
      { name: "Frenza Commercial, one-storey", note: "JMAX Builders" },
      { name: "Gantuanco Residence", place: "Quezon City", note: "JMAX Builders" },
      { name: "Tamonte Residence", place: "Parañaque City", note: "JMAX Builders" },
      { name: "150 sq.m. Mechanical Deck, steel structure" },
      {
        name: "Two-Storey Residence",
        place: "Citta Grande Subdivision, Lucena City",
        note: "Architect: Donica Elden Reyes",
      },
      {
        name: "Three-Unit, Three-Storey Townhouse",
        place: "Kamuning, Quezon City",
        note: "Architect: Donica Elden Reyes",
      },
      {
        name: "Renovation of a Two-Storey Residence",
        place: "Cambria Subdivision, Laguna",
        note: "Architect: Donica Elden Reyes",
      },
      {
        name: "One-Storey Residence",
        place: "Pandi, Bulacan",
        note: "Architect: Donica Elden Reyes",
      },
      {
        name: "Three-Bedroom Unit",
        place: "RGR Subdivision, Lucena City",
        note: "Architect: Donica Elden Reyes",
      },
    ],
  },
]
