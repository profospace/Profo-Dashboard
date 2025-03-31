// This file contains multiple dummy data sets for testing the project form
import { v4 as uuidv4 } from 'uuid'; // You may need to install this package

// Utility function to generate a random date in the future
const getRandomFutureDate = (months = 12) => {
    const date = new Date();
    date.setMonth(date.getMonth() + Math.floor(Math.random() * months) + 1);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

// Utility function to generate a random date in the past
const getRandomPastDate = (months = 12) => {
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * months) - 1);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

// Dummy builders (will be replaced with actual data from API)
const dummyBuilders = [
    { _id: "b1", name: "Dream Developers" },
    { _id: "b2", name: "Skyline Constructions" },
    { _id: "b3", name: "Prime Properties" },
    { _id: "b4", name: "Urban Builders" },
    { _id: "b5", name: "Elite Estates" }
];

// Template for all dummy data sets
const projectDummyDataTemplate = {
    name: '',
    type: 'RESIDENTIAL',
    status: 'UPCOMING',
    builder: '',
    reraNumber: '',
    reravalidity: '',
    description: '',
    overview: {
        totalUnits: '',
        totalTowers: '',
        launchDate: '',
        possessionDate: '',
        priceRange: {
            min: '',
            max: '',
            pricePerSqFt: ''
        }
    },
    location: {
        address: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: ''
    },
    floorPlans: [],
    amenities: [],
    highlights: [],
    brochures: [],
    nearbyLocations: [],
    offer: [],
    propertyType: []
};

// Dummy data set 1 - Luxury Residential
export const luxuryResidential = {
    ...projectDummyDataTemplate,
    name: "Royal Palms Residences",
    type: "RESIDENTIAL",
    status: "UPCOMING",
    builder: dummyBuilders[0]._id, // Will be replaced with actual builder ID
    reraNumber: "RERA" + Math.floor(Math.random() * 10000),
    reravalidity: getRandomFutureDate(24),
    description: "Royal Palms Residences is a luxurious housing complex offering premium apartments with state-of-the-art amenities and beautiful landscaped gardens. Located in the heart of the city, it provides easy access to major business hubs, shopping centers, and entertainment venues.",
    overview: {
        totalUnits: 250,
        totalTowers: 4,
        launchDate: getRandomPastDate(3),
        possessionDate: getRandomFutureDate(18),
        priceRange: {
            min: 15000000,
            max: 45000000,
            pricePerSqFt: 15000
        }
    },
    location: {
        address: "Plot 42, Sector 18",
        landmark: "Near City Mall",
        city: "Gurugram",
        state: "Haryana",
        pincode: "122001",
        latitude: "28.4595",
        longitude: "77.0266"
    },
    floorPlans: [
        {
            name: "Elite 2BHK",
            type: "Apartment",
            bedrooms: 2,
            bathrooms: 2,
            superArea: 1200,
            carpetArea: 950,
            price: 18000000,
            image: "",
            isActive: true
        },
        {
            name: "Premium 3BHK",
            type: "Apartment",
            bedrooms: 3,
            bathrooms: 3,
            superArea: 1800,
            carpetArea: 1400,
            price: 27000000,
            image: "",
            isActive: true
        },
        {
            name: "Royal 4BHK",
            type: "Penthouse",
            bedrooms: 4,
            bathrooms: 4,
            superArea: 2500,
            carpetArea: 2100,
            price: 42000000,
            image: "",
            isActive: true
        }
    ],
    amenities: [
        {
            category: "Health & Fitness",
            items: ["Swimming Pool", "Gym", "Yoga Deck", "Spa & Sauna"]
        },
        {
            category: "Recreation",
            items: ["Clubhouse", "Indoor Games", "Amphitheater", "Kids Play Area"]
        },
        {
            category: "Convenience",
            items: ["24/7 Security", "Power Backup", "EV Charging", "Smart Home"]
        }
    ],
    highlights: [
        {
            title: "Premium Location",
            description: "Prime location with excellent connectivity to major business districts and entertainment hubs",
            icon: "location"
        },
        {
            title: "Luxury Finishes",
            description: "Italian marble flooring, modular kitchens, and premium bathroom fittings",
            icon: "home"
        },
        {
            title: "Sustainable Living",
            description: "Rainwater harvesting, solar power integration, and waste management systems",
            icon: "leaf"
        }
    ],
    brochures: [
        {
            title: "Master Brochure",
            url: "https://example.com/brochure1.pdf",
            thumbnail: "https://example.com/thumb1.jpg"
        },
        {
            title: "Floor Plans Catalog",
            url: "https://example.com/brochure2.pdf",
            thumbnail: "https://example.com/thumb2.jpg"
        }
    ],
    nearbyLocations: [
        {
            type: "EDUCATION",
            name: "International School",
            distance: 1.5,
            duration: 10
        },
        {
            type: "HEALTHCARE",
            name: "City Hospital",
            distance: 2,
            duration: 15
        },
        {
            type: "SHOPPING",
            name: "Mega Mall",
            distance: 1,
            duration: 5
        }
    ],
    offer: ["Early Bird Discount", "Free Modular Kitchen", "No EMI for 1 Year"],
    propertyType: ["Apartment", "Penthouse"]
};

// Dummy data set 2 - Budget Residential
export const budgetResidential = {
    ...projectDummyDataTemplate,
    name: "Green Valley Homes",
    type: "RESIDENTIAL",
    status: "UNDER_CONSTRUCTION",
    builder: dummyBuilders[1]._id, // Will be replaced with actual builder ID
    reraNumber: "RERA" + Math.floor(Math.random() * 10000),
    reravalidity: getRandomFutureDate(24),
    description: "Green Valley Homes offers affordable and comfortable housing solutions designed for modern families. The project emphasizes efficient space utilization, essential amenities, and excellent connectivity to make urban living accessible to everyone.",
    overview: {
        totalUnits: 500,
        totalTowers: 8,
        launchDate: getRandomPastDate(6),
        possessionDate: getRandomFutureDate(12),
        priceRange: {
            min: 3500000,
            max: 7500000,
            pricePerSqFt: 5500
        }
    },
    location: {
        address: "Plot 15, Sector 95",
        landmark: "Near Metro Station",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        latitude: "28.5355",
        longitude: "77.3910"
    },
    floorPlans: [
        {
            name: "Compact 1BHK",
            type: "Apartment",
            bedrooms: 1,
            bathrooms: 1,
            superArea: 550,
            carpetArea: 450,
            price: 3500000,
            image: "",
            isActive: true
        },
        {
            name: "Standard 2BHK",
            type: "Apartment",
            bedrooms: 2,
            bathrooms: 2,
            superArea: 850,
            carpetArea: 700,
            price: 5500000,
            image: "",
            isActive: true
        },
        {
            name: "Family 3BHK",
            type: "Apartment",
            bedrooms: 3,
            bathrooms: 2,
            superArea: 1100,
            carpetArea: 900,
            price: 7200000,
            image: "",
            isActive: true
        }
    ],
    amenities: [
        {
            category: "Essential",
            items: ["Water Supply", "Power Backup", "Lifts", "Security"]
        },
        {
            category: "Recreation",
            items: ["Garden", "Play Area", "Community Hall"]
        },
        {
            category: "Convenience",
            items: ["Parking", "Grocery Store", "ATM"]
        }
    ],
    highlights: [
        {
            title: "Affordable Living",
            description: "Quality homes at budget-friendly prices with no compromise on essentials",
            icon: "dollar"
        },
        {
            title: "Good Connectivity",
            description: "Just 5 minutes from Metro station and major bus routes",
            icon: "bus"
        },
        {
            title: "Community Living",
            description: "Designed for families with communal spaces to foster community bonding",
            icon: "users"
        }
    ],
    brochures: [
        {
            title: "Project Overview",
            url: "https://example.com/brochure3.pdf",
            thumbnail: "https://example.com/thumb3.jpg"
        }
    ],
    nearbyLocations: [
        {
            type: "EDUCATION",
            name: "Public School",
            distance: 1,
            duration: 5
        },
        {
            type: "TRANSPORT",
            name: "Metro Station",
            distance: 0.5,
            duration: 5
        },
        {
            type: "SHOPPING",
            name: "Local Market",
            distance: 0.7,
            duration: 7
        }
    ],
    offer: ["Zero Booking Amount", "Low EMI Scheme", "Free Car Parking"],
    propertyType: ["Apartment"]
};

// Dummy data set 3 - Commercial
export const commercialProperty = {
    ...projectDummyDataTemplate,
    name: "Business Square",
    type: "COMMERCIAL",
    status: "COMPLETED",
    builder: dummyBuilders[2]._id, // Will be replaced with actual builder ID
    reraNumber: "RERA" + Math.floor(Math.random() * 10000),
    reravalidity: getRandomFutureDate(36),
    description: "Business Square is a premium commercial development offering office spaces, retail shops, and food court. Designed with modern architecture and equipped with smart building technology, it provides an ideal environment for businesses to thrive.",
    overview: {
        totalUnits: 150,
        totalTowers: 2,
        launchDate: getRandomPastDate(24),
        possessionDate: getRandomPastDate(3),
        priceRange: {
            min: 8000000,
            max: 45000000,
            pricePerSqFt: 12000
        }
    },
    location: {
        address: "Plot 8, Sector 44",
        landmark: "Near Cyber Hub",
        city: "Gurugram",
        state: "Haryana",
        pincode: "122003",
        latitude: "28.4958",
        longitude: "77.0880"
    },
    floorPlans: [
        {
            name: "Small Office",
            type: "Office Space",
            bedrooms: 0,
            bathrooms: 1,
            superArea: 500,
            carpetArea: 400,
            price: 8000000,
            image: "",
            isActive: true
        },
        {
            name: "Medium Office",
            type: "Office Space",
            bedrooms: 0,
            bathrooms: 2,
            superArea: 1000,
            carpetArea: 850,
            price: 16000000,
            image: "",
            isActive: true
        },
        {
            name: "Retail Shop",
            type: "Retail Space",
            bedrooms: 0,
            bathrooms: 1,
            superArea: 400,
            carpetArea: 350,
            price: 12000000,
            image: "",
            isActive: true
        },
        {
            name: "Food Court Outlet",
            type: "F&B Space",
            bedrooms: 0,
            bathrooms: 1,
            superArea: 300,
            carpetArea: 250,
            price: 9000000,
            image: "",
            isActive: true
        }
    ],
    amenities: [
        {
            category: "Business Facilities",
            items: ["High-speed Internet", "Conference Rooms", "Co-working Spaces", "Business Center"]
        },
        {
            category: "Services & Infrastructure",
            items: ["24/7 Security", "CCTV Surveillance", "Power Backup", "Building Management System"]
        },
        {
            category: "Convenience",
            items: ["Food Court", "ATM", "Courier Service", "Car Parking"]
        }
    ],
    highlights: [
        {
            title: "Prime Business Location",
            description: "Located in the heart of the business district with excellent connectivity",
            icon: "building"
        },
        {
            title: "Smart Building",
            description: "IoT-enabled building management systems for energy efficiency and security",
            icon: "wifi"
        },
        {
            title: "Ready to Move",
            description: "Fully completed project with occupancy certificate and all approvals in place",
            icon: "check"
        }
    ],
    brochures: [
        {
            title: "Business Square Overview",
            url: "https://example.com/brochure4.pdf",
            thumbnail: "https://example.com/thumb4.jpg"
        },
        {
            title: "Office Spaces Catalog",
            url: "https://example.com/brochure5.pdf",
            thumbnail: "https://example.com/thumb5.jpg"
        },
        {
            title: "Retail Opportunities",
            url: "https://example.com/brochure6.pdf",
            thumbnail: "https://example.com/thumb6.jpg"
        }
    ],
    nearbyLocations: [
        {
            type: "BUSINESS",
            name: "IT Park",
            distance: 1.5,
            duration: 8
        },
        {
            type: "TRANSPORT",
            name: "Metro Station",
            distance: 0.3,
            duration: 3
        },
        {
            type: "ENTERTAINMENT",
            name: "Shopping Mall",
            distance: 0.5,
            duration: 5
        },
        {
            type: "HEALTHCARE",
            name: "Multi-specialty Hospital",
            distance: 2,
            duration: 12
        }
    ],
    offer: ["Assured Returns", "Flexible Payment Plan", "Leasing Assistance"],
    propertyType: ["Office Space", "Retail Space", "Food Court"]
};

// Dummy data set 4 - Mixed Use
export const mixedUseProperty = {
    ...projectDummyDataTemplate,
    name: "Urban Central",
    type: "MIXED_USE",
    status: "UNDER_CONSTRUCTION",
    builder: dummyBuilders[3]._id, // Will be replaced with actual builder ID
    reraNumber: "RERA" + Math.floor(Math.random() * 10000),
    reravalidity: getRandomFutureDate(30),
    description: "Urban Central is a dynamic mixed-use development featuring residential apartments, office spaces, retail outlets, and entertainment zones. This integrated township concept offers a live-work-play environment with all conveniences within walking distance.",
    overview: {
        totalUnits: 800,
        totalTowers: 6,
        launchDate: getRandomPastDate(12),
        possessionDate: getRandomFutureDate(24),
        priceRange: {
            min: 7000000,
            max: 60000000,
            pricePerSqFt: 10000
        }
    },
    location: {
        address: "Plot 25, Urban District",
        landmark: "Near Airport Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560045",
        latitude: "12.9716",
        longitude: "77.5946"
    },
    floorPlans: [
        {
            name: "Smart Studio",
            type: "Apartment",
            bedrooms: 0,
            bathrooms: 1,
            superArea: 450,
            carpetArea: 380,
            price: 7000000,
            image: "",
            isActive: true
        },
        {
            name: "Urban 2BHK",
            type: "Apartment",
            bedrooms: 2,
            bathrooms: 2,
            superArea: 1100,
            carpetArea: 900,
            price: 17000000,
            image: "",
            isActive: true
        },
        {
            name: "Premium 3BHK",
            type: "Apartment",
            bedrooms: 3,
            bathrooms: 3,
            superArea: 1600,
            carpetArea: 1350,
            price: 25000000,
            image: "",
            isActive: true
        },
        {
            name: "Retail Boutique",
            type: "Retail Space",
            bedrooms: 0,
            bathrooms: 1,
            superArea: 500,
            carpetArea: 450,
            price: 15000000,
            image: "",
            isActive: true
        },
        {
            name: "Office Suite",
            type: "Office Space",
            bedrooms: 0,
            bathrooms: 2,
            superArea: 1200,
            carpetArea: 1000,
            price: 24000000,
            image: "",
            isActive: true
        }
    ],
    amenities: [
        {
            category: "Residential Amenities",
            items: ["Swimming Pool", "Gym", "Community Hall", "Landscaped Gardens"]
        },
        {
            category: "Commercial Amenities",
            items: ["Business Center", "Conference Facilities", "High-speed Internet"]
        },
        {
            category: "Common Amenities",
            items: ["Multi-level Parking", "Food Court", "24/7 Security", "Smart Home/Office Technology"]
        },
        {
            category: "Entertainment & Lifestyle",
            items: ["Multiplex", "Shopping Arcade", "Restaurants", "Sports Facilities"]
        }
    ],
    highlights: [
        {
            title: "Integrated Township",
            description: "Live, work, and play all within the same development",
            icon: "city"
        },
        {
            title: "Strategic Location",
            description: "Excellent connectivity to major business districts, airport, and transport hubs",
            icon: "map-pin"
        },
        {
            title: "Smart Living",
            description: "IoT-enabled spaces with modern technology integration for both homes and offices",
            icon: "cpu"
        },
        {
            title: "Sustainable Design",
            description: "Green building certification with energy-efficient systems and sustainable practices",
            icon: "droplet"
        }
    ],
    brochures: [
        {
            title: "Master Brochure",
            url: "https://example.com/brochure7.pdf",
            thumbnail: "https://example.com/thumb7.jpg"
        },
        {
            title: "Residential Spaces",
            url: "https://example.com/brochure8.pdf",
            thumbnail: "https://example.com/thumb8.jpg"
        },
        {
            title: "Commercial Opportunities",
            url: "https://example.com/brochure9.pdf",
            thumbnail: "https://example.com/thumb9.jpg"
        }
    ],
    nearbyLocations: [
        {
            type: "TRANSPORT",
            name: "International Airport",
            distance: 5,
            duration: 15
        },
        {
            type: "BUSINESS",
            name: "Tech Park",
            distance: 3,
            duration: 10
        },
        {
            type: "EDUCATION",
            name: "International School",
            distance: 2,
            duration: 8
        },
        {
            type: "HEALTHCARE",
            name: "Super Specialty Hospital",
            distance: 1.5,
            duration: 6
        },
        {
            type: "ENTERTAINMENT",
            name: "Central Mall",
            distance: 0.5,
            duration: 3
        }
    ],
    offer: ["Pre-launch Discount", "Integrated Furniture Package", "Smart Home Kit", "Maintenance Free for 2 Years"],
    propertyType: ["Apartment", "Office Space", "Retail Space"]
};

// Export all dummy data sets as an array with names for the dropdown
export const allDummyData = [
    { id: 'luxury', name: 'Luxury Residential Project', data: luxuryResidential },
    { id: 'budget', name: 'Budget Residential Project', data: budgetResidential },
    { id: 'commercial', name: 'Commercial Property', data: commercialProperty },
    { id: 'mixedUse', name: 'Mixed Use Development', data: mixedUseProperty }
];

export default allDummyData;