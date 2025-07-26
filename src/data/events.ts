import type { Event, EventMetadata } from "@/types";

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

export const unbcEvents: Event[] = [
  {
    id: "1",
    title: "Indigenous Culture Workshop",
    description: "Learn about local Indigenous traditions and participate in hands-on cultural activities led by community elders.",
    startDate: new Date(currentYear, currentMonth, 15, 14, 0),
    endDate: new Date(currentYear, currentMonth, 15, 16, 0),
    variant: "warning"
  },
  {
    id: "2",
    title: "Career Fair 2025",
    description: "Meet with local employers and explore career opportunities in Northern BC and beyond.",
    startDate: new Date(currentYear, currentMonth, 18, 10, 0),
    endDate: new Date(currentYear, currentMonth, 18, 15, 0),
    variant: "success"
  },
  {
    id: "3",
    title: "Hiking Trip to Tabletop Mountain",
    description: "Join us for a challenging but rewarding day hike to one of the region's most spectacular viewpoints.",
    startDate: new Date(currentYear, currentMonth, 22, 8, 0),
    endDate: new Date(currentYear, currentMonth, 22, 18, 0),
    variant: "danger"
  },
  {
    id: "4",
    title: "Mental Health Awareness Week",
    description: "A week-long series of workshops, activities, and resources focused on mental health and wellbeing.",
    startDate: new Date(currentYear, currentMonth, 26, 9, 0),
    endDate: new Date(currentYear, currentMonth, 26, 17, 0),
    variant: "warning"
  },
  {
    id: "5",
    title: "Spring Formal Dance",
    description: "Celebrate the end of the semester with music, dancing, and refreshments in our beautiful Winter Garden.",
    startDate: new Date(currentYear, currentMonth, Math.min(29, new Date(currentYear, currentMonth + 1, 0).getDate()), 19, 0),
    endDate: new Date(currentYear, currentMonth, Math.min(29, new Date(currentYear, currentMonth + 1, 0).getDate()), 23, 0),
    variant: "warning"
  },
  {
    id: "6",
    title: "Research Presentation Day",
    description: "Graduate students present their research findings across various disciplines.",
    startDate: new Date(currentYear, currentMonth, 12, 13, 0),
    endDate: new Date(currentYear, currentMonth, 12, 17, 0),
    variant: "success"
  },
  {
    id: "7",
    title: "Photography Workshop",
    description: "Learn basic photography techniques and composition.",
    startDate: new Date(currentYear, currentMonth, 5, 15, 30),
    endDate: new Date(currentYear, currentMonth, 5, 17, 30),
    variant: "warning"
  },
  {
    id: "8",
    title: "Volunteer Fair",
    description: "Connect with local organizations looking for volunteers.",
    startDate: new Date(currentYear, currentMonth, 8, 11, 0),
    endDate: new Date(currentYear, currentMonth, 8, 14, 0),
    variant: "default"
  },
  {
    id: "9",
    title: "Business Networking Event",
    description: "Network with local business professionals and alumni.",
    startDate: new Date(currentYear, currentMonth, 20, 18, 0),
    endDate: new Date(currentYear, currentMonth, 20, 20, 0),
    variant: "success"
  },
  {
    id: "10",
    title: "Stress Relief Workshop",
    description: "Learn effective stress management techniques for exam season.",
    startDate: new Date(currentYear, currentMonth, 14, 16, 0),
    endDate: new Date(currentYear, currentMonth, 14, 17, 30),
    variant: "warning"
  },
  {
    id: "11",
    title: "International Food Festival",
    description: "Taste foods from around the world and celebrate cultural diversity.",
    startDate: new Date(currentYear, currentMonth, 25, 12, 0),
    endDate: new Date(currentYear, currentMonth, 25, 16, 0),
    variant: "warning"
  },
  {
    id: "12",
    title: "Campus Soccer Tournament",
    description: "Join teams and compete in our annual soccer tournament.",
    startDate: new Date(currentYear, currentMonth, Math.min(30, new Date(currentYear, currentMonth + 1, 0).getDate()), 9, 0),
    endDate: new Date(currentYear, currentMonth, Math.min(30, new Date(currentYear, currentMonth + 1, 0).getDate()), 17, 0),
    variant: "danger"
  },
  {
    id: "13",
    title: "Morning Yoga Session",
    description: "Start your day with a relaxing yoga session.",
    startDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 2), 7, 0),
    endDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 2), 8, 0),
    variant: "warning"
  },
  {
    id: "14",
    title: "Study Group - Biology 101",
    description: "Group study session for upcoming Biology 101 midterm exam.",
    startDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 1), 10, 0),
    endDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 1), 12, 0),
    variant: "success"
  },
  {
    id: "15",
    title: "Lunch & Learn: Sustainability",
    description: "Learn about campus sustainability initiatives while enjoying lunch.",
    startDate: new Date(currentYear, currentMonth, today.getDate(), 12, 0),
    endDate: new Date(currentYear, currentMonth, today.getDate(), 13, 0),
    variant: "success"
  },
];

export const eventMetadata: Record<string, EventMetadata> = {
  "1": {
    category: "cultural",
    organization: "International Students Club",
    location: "Agora",
    cost: "Free",
    registrationRequired: true,
    posterUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=600&fit=crop&auto=format"
  },
  "2": {
    category: "professional",
    organization: "UNBC Student Union",
    location: "Campus Gymnasium",
    cost: "Free",
    registrationRequired: false,
    posterUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=600&fit=crop&auto=format"
  },
  "3": {
    category: "sports",
    organization: "UNBC Outdoor Club",
    location: "Meet at Student Union Building",
    cost: "$15",
    registrationRequired: true
  },
  "4": {
    category: "wellness",
    organization: "Student Health & Wellness",
    location: "Various Locations",
    cost: "Free",
    registrationRequired: false
  },
  "5": {
    category: "social",
    organization: "UNBC Student Union",
    location: "Winter Garden",
    cost: "$25",
    registrationRequired: true,
    posterUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=600&fit=crop&auto=format"
  },
  "6": {
    category: "academic",
    organization: "Graduate Studies",
    location: "Teaching Laboratory Building",
    cost: "Free",
    registrationRequired: false
  },
  "7": {
    category: "arts",
    organization: "Photography Club",
    location: "Art Building Studio 3",
    cost: "$10",
    registrationRequired: true
  },
  "8": {
    category: "volunteer",
    organization: "Community Engagement Office",
    location: "Student Union Building",
    cost: "Free",
    registrationRequired: false
  },
  "9": {
    category: "professional",
    organization: "Business Students Association",
    location: "Winter Garden",
    cost: "$5",
    registrationRequired: true
  },
  "10": {
    category: "wellness",
    organization: "Student Health & Wellness",
    location: "Campus Recreation Center",
    cost: "Free",
    registrationRequired: false
  },
  "11": {
    category: "cultural",
    organization: "International Students Club",
    location: "Agora",
    cost: "Free",
    registrationRequired: false
  },
  "12": {
    category: "sports",
    organization: "Athletics Department",
    location: "Campus Soccer Field",
    cost: "$20 per team",
    registrationRequired: true
  },
  "13": {
    category: "wellness",
    organization: "Student Health & Wellness",
    location: "Campus Recreation Center",
    cost: "Free",
    registrationRequired: false
  },
  "14": {
    category: "academic",
    organization: "Biology Students Association",
    location: "Library Study Room 201",
    cost: "Free",
    registrationRequired: false
  },
  "15": {
    category: "academic",
    organization: "Sustainability Office",
    location: "Agora",
    cost: "Free",
    registrationRequired: false
  }
};