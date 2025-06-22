// // const mongoose = require('mongoose');
// // const Property = require('./models/Property'); // Adjust path as needed
// // // require('dotenv').config(); 
// // // Sample data arrays for realistic property generation
// // const propertyTypes = [
// //     'Apartment',
// //     'Villa',
// //     'Independent House',
// //     'Builder Floor',
// //     'Studio Apartment',
// //     'Penthouse',
// //     'Duplex',
// //     'Triplex',
// //     'Commercial Office',
// //     'Retail Shop',
// //     'Warehouse',
// //     'Industrial Plot',
// //     'Residential Plot',
// //     'Farmhouse'
// // ];

// // const cities = [
// //     'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
// //     'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
// // ];

// // const localities = {
// //     'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Juhu', 'Worli'],
// //     'Delhi': ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Dwarka', 'Rohini'],
// //     'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Electronic City'],
// //     'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City', 'Kondapur'],
// //     'Chennai': ['T Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'],
// //     'Kolkata': ['Salt Lake', 'Park Street', 'Ballygunge', 'New Town', 'Rajarhat'],
// //     'Pune': ['Koregaon Park', 'Hinjewadi', 'Kothrud', 'Viman Nagar', 'Hadapsar'],
// //     'Ahmedabad': ['Satellite', 'Vastrapur', 'Prahlad Nagar', 'Bopal', 'Thaltej'],
// //     'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'C Scheme', 'Mansarovar', 'Jagatpura'],
// //     'Lucknow': ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar']
// // };

// // const amenities = [
// //     'Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup',
// //     'Lift', 'Garden', 'Playground', 'Club House', 'Jogging Track',
// //     'CCTV', 'Intercom', 'Water Supply', 'Sewage Treatment',
// //     'Fire Safety', 'Maintenance Staff', 'Visitor Parking'
// // ];

// // const furnishingTypes = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
// // const facingTypes = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
// // const constructionStatuses = ['Ready to Move', 'Under Construction', 'New Launch'];
// // const ownershipTypes = ['Freehold', 'Leasehold', 'Cooperative Society', 'Power of Attorney'];

// // // Sample ObjectIds (you should replace these with actual IDs from your database)
// // const sampleSalesmanIds = [
// //     new mongoose.Types.ObjectId(),
// //     new mongoose.Types.ObjectId(),
// //     new mongoose.Types.ObjectId(),
// //     new mongoose.Types.ObjectId(),
// //     new mongoose.Types.ObjectId()
// // ];

// // const sampleBuilderIds = [
// //     new mongoose.Types.ObjectId(),
// //     new mongoose.Types.ObjectId(),
// //     new mongoose.Types.ObjectId()
// // ];

// // const sampleBuildingIds = [
// //     new mongoose.Types.ObjectId(),
// //     new mongoose.Types.ObjectId(),
// //     new mongoose.Types.ObjectId(),
// //     new mongoose.Types.ObjectId()
// // ];

// // // Helper functions
// // function getRandomElement(array) {
// //     return array[Math.floor(Math.random() * array.length)];
// // }

// // function getRandomElements(array, count) {
// //     const shuffled = array.sort(() => 0.5 - Math.random());
// //     return shuffled.slice(0, count);
// // }

// // function getRandomNumber(min, max) {
// //     return Math.floor(Math.random() * (max - min + 1)) + min;
// // }

// // function getRandomPrice(propertyType) {
// //     const priceRanges = {
// //         'Apartment': { min: 2000000, max: 15000000 },
// //         'Villa': { min: 8000000, max: 50000000 },
// //         'Independent House': { min: 5000000, max: 30000000 },
// //         'Builder Floor': { min: 3000000, max: 12000000 },
// //         'Studio Apartment': { min: 1500000, max: 6000000 },
// //         'Penthouse': { min: 15000000, max: 80000000 },
// //         'Duplex': { min: 6000000, max: 25000000 },
// //         'Triplex': { min: 8000000, max: 35000000 },
// //         'Commercial Office': { min: 5000000, max: 100000000 },
// //         'Retail Shop': { min: 2000000, max: 20000000 },
// //         'Warehouse': { min: 10000000, max: 50000000 },
// //         'Industrial Plot': { min: 5000000, max: 100000000 },
// //         'Residential Plot': { min: 1000000, max: 20000000 },
// //         'Farmhouse': { min: 8000000, max: 40000000 }
// //     };

// //     const range = priceRanges[propertyType] || { min: 2000000, max: 15000000 };
// //     return getRandomNumber(range.min, range.max);
// // }

// // function getCoordinatesForCity(city) {
// //     // const cityCoords = {
// //     //     'Mumbai': { lat: 19.0760, lng: 72.8777 },
// //     //     'Delhi': { lat: 28.7041, lng: 77.1025 },
// //     //     'Bangalore': { lat: 12.9716, lng: 77.5946 },
// //     //     'Hyderabad': { lat: 17.3850, lng: 78.4867 },
// //     //     'Chennai': { lat: 13.0827, lng: 80.2707 },
// //     //     'Kolkata': { lat: 22.5726, lng: 88.3639 },
// //     //     'Pune': { lat: 18.5204, lng: 73.8567 },
// //     //     'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
// //     //     'Jaipur': { lat: 26.9124, lng: 75.7873 },
// //     //     'Lucknow': { lat: 26.8467, lng: 80.9462 }
// //     // };

// //     const baseCoord = cityCoords[city] || { lat: 26.47352075730532, lng: 80.28529747886176 };
// //     // Add some random offset to simulate different locations within the city
// //     return {
// //         lat: baseCoord.lat + (Math.random() - 0.5) * 0.1,
// //         lng: baseCoord.lng + (Math.random() - 0.5) * 0.1
// //     };
// // }

// // function generatePropertyData(propertyType, index) {
// //     const city = getRandomElement(cities);
// //     const locality = getRandomElement(localities[city]);
// //     const coords = getCoordinatesForCity(city);
// //     const price = getRandomPrice(propertyType);
// //     const area = getRandomNumber(500, 3000);
// //     const bedrooms = propertyType.includes('Commercial') || propertyType.includes('Plot') ? 0 : getRandomNumber(1, 4);
// //     const bathrooms = bedrooms > 0 ? getRandomNumber(1, Math.max(1, bedrooms - 1)) : 0;

// //     return {
// //         post_id: `PROP_${Date.now()}_${index}`,
// //         type_id: `TYPE_${propertyType.replace(/\s+/g, '_').toUpperCase()}`,
// //         user_id: `USER_${getRandomNumber(1000, 9999)}`,
// //         building_id: `BLDG_${getRandomNumber(100, 999)}`,
// //         type_name: propertyType,
// //         user_name: `User ${getRandomNumber(1, 100)}`,
// //         user_image: `https://avatar.iran.liara.run/public/${getRandomNumber(1, 100)}`,
// //         post_title: `${propertyType} in ${locality}, ${city}`,
// //         post_description: `Beautiful ${propertyType.toLowerCase()} located in the prime area of ${locality}, ${city}. This property offers modern amenities and excellent connectivity.`,
// //         ownerName: `Owner ${getRandomNumber(1, 100)}`,
// //         whatsappAlerts: Math.random() > 0.5,
// //         whatsappContact: `+91${getRandomNumber(7000000000, 9999999999)}`,
// //         profoProxyAllowed: Math.random() > 0.3,
// //         rmAssigned: Math.random() > 0.4,
// //         rmName: Math.random() > 0.4 ? `RM ${getRandomNumber(1, 50)}` : null,
// //         rmID: Math.random() > 0.4 ? `RM_${getRandomNumber(1000, 9999)}` : null,
// //         phone: `+91${getRandomNumber(7000000000, 9999999999)}`,
// //         address: `${getRandomNumber(1, 999)}, ${locality}, ${city}`,
// //         floor: propertyType.includes('Plot') ? null : getRandomNumber(1, 20),
// //         agreement: getRandomElement(['Sale', 'Rent', 'Lease']),
// //         priceUnit: 'INR',
// //         areaUnit: 'sq ft',
// //         usp: getRandomElements([
// //             'Prime Location', 'Modern Amenities', 'Excellent Connectivity',
// //             'Gated Community', 'Ready to Move', 'Investment Opportunity'
// //         ], getRandomNumber(2, 4)),
// //         contactList: [getRandomNumber(7000000000, 9999999999)],
// //         latitude: coords.lat,
// //         longitude: coords.lng,
// //         purpose: getRandomElement(['Sale', 'Rent']),
// //         bedrooms: bedrooms,
// //         bathrooms: bathrooms,
// //         visted: getRandomNumber(0, 100),
// //         interaction: getRandomElement(['VISIT', 'SAVE', 'CONTACT']),

// //         // Enhanced relationship fields
// //         builder: getRandomElement(sampleBuilderIds),
// //         building: getRandomElement(sampleBuildingIds),
// //         buildingMongo: getRandomElement(sampleBuildingIds),
// //         salesman: getRandomElement(sampleSalesmanIds),

// //         uploadInfo: {
// //             assignedBy: getRandomElement(sampleSalesmanIds),
// //             uploadedBy: getRandomElement(sampleSalesmanIds),
// //             uploadedAt: new Date(Date.now() - getRandomNumber(0, 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
// //             changeHistory: []
// //         },

// //         status: getRandomElement(['listed', 'unlisted', 'payment-delay']),
// //         city: city,
// //         locality: locality,
// //         pincode: `${getRandomNumber(100000, 999999)}`,

// //         location: {
// //             type: 'Point',
// //             coordinates: [coords.lng, coords.lat]
// //         },

// //         area: `${area} sq ft`,
// //         anyConstraint: [getRandomNumber(1, 5)],
// //         furnishing: getRandomElement(furnishingTypes),
// //         amenities: getRandomElements(amenities, getRandomNumber(5, 12)),
// //         price: price,
// //         priceOnRequest: Math.random() > 0.8,
// //         verified: Math.random() > 0.3,

// //         post_images: Array.from({ length: getRandomNumber(3, 8) }, (_, i) => ({
// //             url: `https://picsum.photos/800/600?random=${Date.now()}_${index}_${i}`,
// //             timestamp: new Date()
// //         })),

// //         floor_plan_images: Array.from({ length: getRandomNumber(1, 3) }, (_, i) => ({
// //             url: `https://picsum.photos/600/400?random=floor_${Date.now()}_${index}_${i}`,
// //             timestamp: new Date()
// //         })),

// //         total_views: getRandomNumber(10, 500),
// //         favourite: Math.random() > 0.7,
// //         galleryList: [],
// //         relatedProperty: [],
// //         furnishStatus: getRandomElement(furnishingTypes),
// //         carpetArea: Math.floor(area * 0.8),
// //         superBuiltupArea: Math.floor(area * 1.2),
// //         available: Math.random() > 0.2,
// //         category: getRandomNumber(1, 5),
// //         tags: getRandomElements(['Premium', 'Luxury', 'Affordable', 'Investment', 'Family'], getRandomNumber(1, 3)),
// //         region: `${city} Region`,
// //         construction_status: getRandomElement(constructionStatuses),
// //         possession: getRandomElement(['Immediate', '3 months', '6 months', '1 year']),
// //         vastuCompliance: getRandomElements(['East Facing', 'Proper Ventilation', 'Natural Light'], getRandomNumber(1, 3)),

// //         maintenanceCharges: {
// //             minPrice: `${getRandomNumber(5, 15)}`,
// //             maxPrice: `${getRandomNumber(15, 25)}`,
// //             priceUnit: 'INR',
// //             areaUnit: 'per sq ft'
// //         },

// //         loanApprovalStatus: getRandomElements(['Pre-approved', 'Bank Approved', 'NBFC Approved'], getRandomNumber(1, 2)),
// //         builderReputation: getRandomElement(['Excellent', 'Good', 'Average']),
// //         broker_status: getRandomElement(['Direct Owner', 'Broker', 'Builder']),
// //         facilities: getRandomElements(amenities, getRandomNumber(3, 8)),
// //         location_advantage: getRandomElements([
// //             'Near Metro', 'Near Airport', 'IT Hub', 'Shopping Complex',
// //             'Schools Nearby', 'Hospitals Nearby', 'Market Area'
// //         ], getRandomNumber(2, 5)),

// //         // Property specific fields
// //         pricePerSqFt: Math.floor(price / area),
// //         estimatedEMI: Math.floor(price * 0.008), // Rough EMI calculation
// //         reraStatus: Math.random() > 0.5 ? 'RERA Approved' : 'Pending',
// //         reraRegistrationNumber: Math.random() > 0.5 ? `RERA/${city}/2024/${getRandomNumber(1000, 9999)}` : null,
// //         configuration: bedrooms > 0 ? `${bedrooms}BHK` : propertyType,
// //         locationFactors: getRandomElements([
// //             'Prime Location', 'Developing Area', 'Established Locality',
// //             'Commercial Hub', 'Residential Area'
// //         ], getRandomNumber(1, 3)),
// //         facing: getRandomElement(facingTypes),
// //         floorNumber: propertyType.includes('Plot') ? null : getRandomNumber(1, 20),
// //         totalFloors: propertyType.includes('Plot') ? null : getRandomNumber(5, 25),
// //         overlookingAmenities: getRandomElements(['Garden', 'Pool', 'Park', 'Road'], getRandomNumber(1, 2)),
// //         possessionDate: new Date(Date.now() + getRandomNumber(0, 365) * 24 * 60 * 60 * 1000),
// //         transactionType: getRandomElement(['New Booking', 'Resale']),
// //         propertyOwnership: getRandomElement(ownershipTypes),
// //         flooring: getRandomElement(['Marble', 'Vitrified', 'Wooden', 'Ceramic']),
// //         parking: `${getRandomNumber(1, 3)} Cars`,
// //         propertyCode: `PC_${Date.now()}_${index}`,
// //         widthOfFacingRoad: getRandomNumber(20, 60),
// //         gatedCommunity: Math.random() > 0.4,
// //         waterSource: getRandomElements(['Borewell', 'Municipal', 'Tanker'], getRandomNumber(1, 2)),
// //         powerBackup: getRandomElement(['Generator', 'Inverter', 'Solar', 'None']),
// //         petFriendly: Math.random() > 0.6,
// //         propertyAge: getRandomNumber(0, 20),

// //         // Array fields
// //         propertyTypes: [propertyType],
// //         propertyFeatures: getRandomElements([
// //             'Balcony', 'Terrace', 'Study Room', 'Servant Room',
// //             'Pooja Room', 'Store Room', 'Utility Area'
// //         ], getRandomNumber(2, 5)),
// //         viewTypes: getRandomElements(['City View', 'Garden View', 'Pool View', 'Road View'], getRandomNumber(1, 2)),
// //         legalClearance: getRandomElements(['Clear Title', 'Approved Plan', 'NOC Available'], getRandomNumber(1, 3)),
// //         environmentalFactors: getRandomElements(['Green Building', 'Rain Water Harvesting', 'Solar Panels'], getRandomNumber(0, 2)),
// //         financingOptions: getRandomElements(['Home Loan', 'Construction Loan', 'Plot Loan'], getRandomNumber(1, 2))
// //     };
// // }

// // async function generateProperties() {
// //     try {
// //         console.log('Starting property generation...');

// //         const properties = [];

// //         // Generate at least 2 properties of each type
// //         for (const propertyType of propertyTypes) {
// //             console.log(`Generating properties for type: ${propertyType}`);

// //             // Generate 2-3 properties of each type
// //             const count = getRandomNumber(2, 3);
// //             for (let i = 0; i < count; i++) {
// //                 const propertyData = generatePropertyData(propertyType, properties.length + 1);
// //                 properties.push(propertyData);
// //             }
// //         }

// //         console.log(`Generated ${properties.length} properties. Inserting into database...`);

// //         // Insert properties in batches to avoid memory issues
// //         const batchSize = 10;
// //         for (let i = 0; i < properties.length; i += batchSize) {
// //             const batch = properties.slice(i, i + batchSize);
// //             await Property.insertMany(batch);
// //             console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(properties.length / batchSize)}`);
// //         }

// //         console.log(`Successfully generated and inserted ${properties.length} properties!`);

// //         // Print summary
// //         const summary = {};
// //         properties.forEach(prop => {
// //             summary[prop.type_name] = (summary[prop.type_name] || 0) + 1;
// //         });

// //         console.log('\nProperty generation summary:');
// //         Object.entries(summary).forEach(([type, count]) => {
// //             console.log(`${type}: ${count} properties`);
// //         });

// //         return properties;

// //     } catch (error) {
// //         console.error('Error generating properties:', error);
// //         throw error;
// //     }
// // }

// // // Function to connect to MongoDB and run the script
// // async function runScript() {
// //     try {
// //         // Connect to MongoDB (adjust connection string as needed)
// //         await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2', {
// //             useNewUrlParser: true,
// //             useUnifiedTopology: true,
// //         });

// //         console.log('Connected to MongoDB');

// //         // Generate properties
// //         await generateProperties();

// //         console.log('Script completed successfully!');

// //     } catch (error) {
// //         console.error('Script failed:', error);
// //     } finally {
// //         // Close database connection
// //         await mongoose.connection.close();
// //         console.log('Database connection closed');
// //     }
// // }

// // // Export functions for use in other files
// // module.exports = {
// //     generateProperties,
// //     generatePropertyData,
// //     runScript
// // };

// // // Run the script if this file is executed directly
// // if (require.main === module) {
// //     runScript();
// // }


// const mongoose = require('mongoose');

// // Define the Property schema directly in this file to avoid dependencies
// const propertySchema = new mongoose.Schema({
//     post_id: String,
//     type_id: String,
//     user_id: String,
//     building_id: String,
//     type_name: String,
//     user_name: String,
//     user_image: String,
//     post_title: String,
//     post_description: String,
//     ownerName: String,
//     whatsappAlerts: Boolean,
//     whatsappContact: String,
//     profoProxyAllowed: Boolean,
//     rmAssigned: Boolean,
//     rmName: String,
//     rmID: String,
//     phone: String,
//     address: String,
//     floor: Number,
//     agreement: String,
//     priceUnit: String,
//     areaUnit: String,
//     usp: [String],
//     contactList: [Number],
//     latitude: Number,
//     longitude: Number,
//     purpose: String,
//     bedrooms: Number,
//     bathrooms: Number,
//     visted: Number,
//     interaction: String,
//     builder: mongoose.Schema.Types.ObjectId,
//     building: mongoose.Schema.Types.ObjectId,
//     buildingMongo: mongoose.Schema.Types.ObjectId,
//     salesman: mongoose.Schema.Types.ObjectId,
//     uploadInfo: {
//         assignedBy: mongoose.Schema.Types.ObjectId,
//         uploadedBy: mongoose.Schema.Types.ObjectId,
//         uploadedAt: Date,
//         changeHistory: Array
//     },
//     status: String,
//     city: String,
//     locality: String,
//     pincode: String,
//     location: {
//         type: { type: String, default: 'Point' },
//         coordinates: [Number]
//     },
//     area: String,
//     anyConstraint: [Number],
//     furnishing: String,
//     amenities: [String],
//     price: Number,
//     priceOnRequest: Boolean,
//     verified: Boolean,
//     post_images: [{
//         url: String,
//         timestamp: Date
//     }],
//     floor_plan_images: [{
//         url: String,
//         timestamp: Date
//     }],
//     total_views: Number,
//     favourite: Boolean,
//     galleryList: Array,
//     relatedProperty: Array,
//     furnishStatus: String,
//     carpetArea: Number,
//     superBuiltupArea: Number,
//     available: Boolean,
//     category: Number,
//     tags: [String],
//     region: String,
//     construction_status: String,
//     possession: String,
//     vastuCompliance: [String],
//     maintenanceCharges: {
//         minPrice: String,
//         maxPrice: String,
//         priceUnit: String,
//         areaUnit: String
//     },
//     loanApprovalStatus: [String],
//     builderReputation: String,
//     broker_status: String,
//     facilities: [String],
//     location_advantage: [String],
//     pricePerSqFt: Number,
//     estimatedEMI: Number,
//     reraStatus: String,
//     reraRegistrationNumber: String,
//     configuration: String,
//     locationFactors: [String],
//     facing: String,
//     floorNumber: Number,
//     totalFloors: Number,
//     overlookingAmenities: [String],
//     possessionDate: Date,
//     transactionType: String,
//     propertyOwnership: String,
//     flooring: String,
//     parking: String,
//     propertyCode: String,
//     widthOfFacingRoad: Number,
//     gatedCommunity: Boolean,
//     waterSource: [String],
//     powerBackup: String,
//     petFriendly: Boolean,
//     propertyAge: Number,
//     propertyTypes: [String],
//     propertyFeatures: [String],
//     viewTypes: [String],
//     legalClearance: [String],
//     environmentalFactors: [String],
//     financingOptions: [String]
// }, {
//     timestamps: true
// });

// // Create the model
// const Property = mongoose.model('Property', propertySchema);

// // Sample data arrays for realistic property generation
// const propertyTypes = [
//     'Apartment',
//     'Villa',
//     'Independent House',
//     'Builder Floor',
//     'Studio Apartment',
//     'Penthouse',
//     'Duplex',
//     'Triplex',
//     'Commercial Office',
//     'Retail Shop',
//     'Warehouse',
//     'Industrial Plot',
//     'Residential Plot',
//     'Farmhouse'
// ];

// const cities = [
//     'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
//     'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
// ];

// const localities = {
//     'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Juhu', 'Worli'],
//     'Delhi': ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Dwarka', 'Rohini'],
//     'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Electronic City'],
//     'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City', 'Kondapur'],
//     'Chennai': ['T Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'],
//     'Kolkata': ['Salt Lake', 'Park Street', 'Ballygunge', 'New Town', 'Rajarhat'],
//     'Pune': ['Koregaon Park', 'Hinjewadi', 'Kothrud', 'Viman Nagar', 'Hadapsar'],
//     'Ahmedabad': ['Satellite', 'Vastrapur', 'Prahlad Nagar', 'Bopal', 'Thaltej'],
//     'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'C Scheme', 'Mansarovar', 'Jagatpura'],
//     'Lucknow': ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar']
// };

// const amenities = [
//     'Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup',
//     'Lift', 'Garden', 'Playground', 'Club House', 'Jogging Track',
//     'CCTV', 'Intercom', 'Water Supply', 'Sewage Treatment',
//     'Fire Safety', 'Maintenance Staff', 'Visitor Parking'
// ];

// const furnishingTypes = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
// const facingTypes = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
// const constructionStatuses = ['Ready to Move', 'Under Construction', 'New Launch'];
// const ownershipTypes = ['Freehold', 'Leasehold', 'Cooperative Society', 'Power of Attorney'];

// // Sample ObjectIds (you should replace these with actual IDs from your database)
// const sampleSalesmanIds = [
//     new mongoose.Types.ObjectId(),
//     new mongoose.Types.ObjectId(),
//     new mongoose.Types.ObjectId(),
//     new mongoose.Types.ObjectId(),
//     new mongoose.Types.ObjectId()
// ];

// const sampleBuilderIds = [
//     new mongoose.Types.ObjectId(),
//     new mongoose.Types.ObjectId(),
//     new mongoose.Types.ObjectId()
// ];

// const sampleBuildingIds = [
//     new mongoose.Types.ObjectId(),
//     new mongoose.Types.ObjectId(),
//     new mongoose.Types.ObjectId(),
//     new mongoose.Types.ObjectId()
// ];

// // Helper functions
// function getRandomElement(array) {
//     return array[Math.floor(Math.random() * array.length)];
// }

// function getRandomElements(array, count) {
//     const shuffled = array.sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, count);
// }

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function getRandomPrice(propertyType) {
//     const priceRanges = {
//         'Apartment': { min: 2000000, max: 15000000 },
//         'Villa': { min: 8000000, max: 50000000 },
//         'Independent House': { min: 5000000, max: 30000000 },
//         'Builder Floor': { min: 3000000, max: 12000000 },
//         'Studio Apartment': { min: 1500000, max: 6000000 },
//         'Penthouse': { min: 15000000, max: 80000000 },
//         'Duplex': { min: 6000000, max: 25000000 },
//         'Triplex': { min: 8000000, max: 35000000 },
//         'Commercial Office': { min: 5000000, max: 100000000 },
//         'Retail Shop': { min: 2000000, max: 20000000 },
//         'Warehouse': { min: 10000000, max: 50000000 },
//         'Industrial Plot': { min: 5000000, max: 100000000 },
//         'Residential Plot': { min: 1000000, max: 20000000 },
//         'Farmhouse': { min: 8000000, max: 40000000 }
//     };

//     const range = priceRanges[propertyType] || { min: 2000000, max: 15000000 };
//     return getRandomNumber(range.min, range.max);
// }

// function getCoordinatesForCity(city) {
//     const cityCoords = {
//         'Mumbai': { lat: 19.0760, lng: 72.8777 },
//         'Delhi': { lat: 28.7041, lng: 77.1025 },
//         'Bangalore': { lat: 12.9716, lng: 77.5946 },
//         'Hyderabad': { lat: 17.3850, lng: 78.4867 },
//         'Chennai': { lat: 13.0827, lng: 80.2707 },
//         'Kolkata': { lat: 22.5726, lng: 88.3639 },
//         'Pune': { lat: 18.5204, lng: 73.8567 },
//         'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
//         'Jaipur': { lat: 26.9124, lng: 75.7873 },
//         'Lucknow': { lat: 26.8467, lng: 80.9462 }
//     };

//     const baseCoord = cityCoords[city] || { lat: 26.47352075730532, lng: 80.28529747886176 };
//     // Add some random offset to simulate different locations within the city
//     return {
//         lat: baseCoord.lat + (Math.random() - 0.5) * 0.1,
//         lng: baseCoord.lng + (Math.random() - 0.5) * 0.1
//     };
// }

// function generatePropertyData(propertyType, index) {
//     const city = getRandomElement(cities);
//     const locality = getRandomElement(localities[city]);
//     const coords = getCoordinatesForCity(city);
//     const price = getRandomPrice(propertyType);
//     const area = getRandomNumber(500, 3000);
//     const bedrooms = propertyType.includes('Commercial') || propertyType.includes('Plot') ? 0 : getRandomNumber(1, 4);
//     const bathrooms = bedrooms > 0 ? getRandomNumber(1, Math.max(1, bedrooms - 1)) : 0;

//     return {
//         post_id: `PROP_${Date.now()}_${index}`,
//         type_id: `TYPE_${propertyType.replace(/\s+/g, '_').toUpperCase()}`,
//         user_id: `USER_${getRandomNumber(1000, 9999)}`,
//         building_id: `BLDG_${getRandomNumber(100, 999)}`,
//         type_name: propertyType,
//         user_name: `User ${getRandomNumber(1, 100)}`,
//         user_image: `https://avatar.iran.liara.run/public/${getRandomNumber(1, 100)}`,
//         post_title: `${propertyType} in ${locality}, ${city}`,
//         post_description: `Beautiful ${propertyType.toLowerCase()} located in the prime area of ${locality}, ${city}. This property offers modern amenities and excellent connectivity.`,
//         ownerName: `Owner ${getRandomNumber(1, 100)}`,
//         whatsappAlerts: Math.random() > 0.5,
//         whatsappContact: `+91${getRandomNumber(7000000000, 9999999999)}`,
//         profoProxyAllowed: Math.random() > 0.3,
//         rmAssigned: Math.random() > 0.4,
//         rmName: Math.random() > 0.4 ? `RM ${getRandomNumber(1, 50)}` : null,
//         rmID: Math.random() > 0.4 ? `RM_${getRandomNumber(1000, 9999)}` : null,
//         phone: `+91${getRandomNumber(7000000000, 9999999999)}`,
//         address: `${getRandomNumber(1, 999)}, ${locality}, ${city}`,
//         floor: propertyType.includes('Plot') ? null : getRandomNumber(1, 20),
//         agreement: getRandomElement(['Sale', 'Rent', 'Lease']),
//         priceUnit: 'INR',
//         areaUnit: 'sq ft',
//         usp: getRandomElements([
//             'Prime Location', 'Modern Amenities', 'Excellent Connectivity',
//             'Gated Community', 'Ready to Move', 'Investment Opportunity'
//         ], getRandomNumber(2, 4)),
//         contactList: [getRandomNumber(7000000000, 9999999999)],
//         latitude: coords.lat,
//         longitude: coords.lng,
//         purpose: getRandomElement(['Sale', 'Rent']),
//         bedrooms: bedrooms,
//         bathrooms: bathrooms,
//         visted: getRandomNumber(0, 100),
//         interaction: getRandomElement(['VISIT', 'SAVE', 'CONTACT']),

//         // Enhanced relationship fields
//         builder: getRandomElement(sampleBuilderIds),
//         building: getRandomElement(sampleBuildingIds),
//         buildingMongo: getRandomElement(sampleBuildingIds),
//         salesman: getRandomElement(sampleSalesmanIds),

//         uploadInfo: {
//             assignedBy: getRandomElement(sampleSalesmanIds),
//             uploadedBy: getRandomElement(sampleSalesmanIds),
//             uploadedAt: new Date(Date.now() - getRandomNumber(0, 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
//             changeHistory: []
//         },

//         status: getRandomElement(['listed', 'unlisted', 'payment-delay']),
//         city: city,
//         locality: locality,
//         pincode: `${getRandomNumber(100000, 999999)}`,

//         location: {
//             type: 'Point',
//             coordinates: [coords.lng, coords.lat]
//         },

//         area: `${area} sq ft`,
//         anyConstraint: [getRandomNumber(1, 5)],
//         furnishing: getRandomElement(furnishingTypes),
//         amenities: getRandomElements(amenities, getRandomNumber(5, 12)),
//         price: price,
//         priceOnRequest: Math.random() > 0.8,
//         verified: Math.random() > 0.3,

//         post_images: Array.from({ length: getRandomNumber(3, 8) }, (_, i) => ({
//             url: `https://picsum.photos/800/600?random=${Date.now()}_${index}_${i}`,
//             timestamp: new Date()
//         })),

//         floor_plan_images: Array.from({ length: getRandomNumber(1, 3) }, (_, i) => ({
//             url: `https://picsum.photos/600/400?random=floor_${Date.now()}_${index}_${i}`,
//             timestamp: new Date()
//         })),

//         total_views: getRandomNumber(10, 500),
//         favourite: Math.random() > 0.7,
//         galleryList: [],
//         relatedProperty: [],
//         furnishStatus: getRandomElement(furnishingTypes),
//         carpetArea: Math.floor(area * 0.8),
//         superBuiltupArea: Math.floor(area * 1.2),
//         available: Math.random() > 0.2,
//         category: getRandomNumber(1, 5),
//         tags: getRandomElements(['Premium', 'Luxury', 'Affordable', 'Investment', 'Family'], getRandomNumber(1, 3)),
//         region: `${city} Region`,
//         construction_status: getRandomElement(constructionStatuses),
//         possession: getRandomElement(['Immediate', '3 months', '6 months', '1 year']),
//         vastuCompliance: getRandomElements(['East Facing', 'Proper Ventilation', 'Natural Light'], getRandomNumber(1, 3)),

//         maintenanceCharges: {
//             minPrice: `${getRandomNumber(5, 15)}`,
//             maxPrice: `${getRandomNumber(15, 25)}`,
//             priceUnit: 'INR',
//             areaUnit: 'per sq ft'
//         },

//         loanApprovalStatus: getRandomElements(['Pre-approved', 'Bank Approved', 'NBFC Approved'], getRandomNumber(1, 2)),
//         builderReputation: getRandomElement(['Excellent', 'Good', 'Average']),
//         broker_status: getRandomElement(['Direct Owner', 'Broker', 'Builder']),
//         facilities: getRandomElements(amenities, getRandomNumber(3, 8)),
//         location_advantage: getRandomElements([
//             'Near Metro', 'Near Airport', 'IT Hub', 'Shopping Complex',
//             'Schools Nearby', 'Hospitals Nearby', 'Market Area'
//         ], getRandomNumber(2, 5)),

//         // Property specific fields
//         pricePerSqFt: Math.floor(price / area),
//         estimatedEMI: Math.floor(price * 0.008), // Rough EMI calculation
//         reraStatus: Math.random() > 0.5 ? 'RERA Approved' : 'Pending',
//         reraRegistrationNumber: Math.random() > 0.5 ? `RERA/${city}/2024/${getRandomNumber(1000, 9999)}` : null,
//         configuration: bedrooms > 0 ? `${bedrooms}BHK` : propertyType,
//         locationFactors: getRandomElements([
//             'Prime Location', 'Developing Area', 'Established Locality',
//             'Commercial Hub', 'Residential Area'
//         ], getRandomNumber(1, 3)),
//         facing: getRandomElement(facingTypes),
//         floorNumber: propertyType.includes('Plot') ? null : getRandomNumber(1, 20),
//         totalFloors: propertyType.includes('Plot') ? null : getRandomNumber(5, 25),
//         overlookingAmenities: getRandomElements(['Garden', 'Pool', 'Park', 'Road'], getRandomNumber(1, 2)),
//         possessionDate: new Date(Date.now() + getRandomNumber(0, 365) * 24 * 60 * 60 * 1000),
//         transactionType: getRandomElement(['New Booking', 'Resale']),
//         propertyOwnership: getRandomElement(ownershipTypes),
//         flooring: getRandomElement(['Marble', 'Vitrified', 'Wooden', 'Ceramic']),
//         parking: `${getRandomNumber(1, 3)} Cars`,
//         propertyCode: `PC_${Date.now()}_${index}`,
//         widthOfFacingRoad: getRandomNumber(20, 60),
//         gatedCommunity: Math.random() > 0.4,
//         waterSource: getRandomElements(['Borewell', 'Municipal', 'Tanker'], getRandomNumber(1, 2)),
//         powerBackup: getRandomElement(['Generator', 'Inverter', 'Solar', 'None']),
//         petFriendly: Math.random() > 0.6,
//         propertyAge: getRandomNumber(0, 20),

//         // Array fields
//         propertyTypes: [propertyType],
//         propertyFeatures: getRandomElements([
//             'Balcony', 'Terrace', 'Study Room', 'Servant Room',
//             'Pooja Room', 'Store Room', 'Utility Area'
//         ], getRandomNumber(2, 5)),
//         viewTypes: getRandomElements(['City View', 'Garden View', 'Pool View', 'Road View'], getRandomNumber(1, 2)),
//         legalClearance: getRandomElements(['Clear Title', 'Approved Plan', 'NOC Available'], getRandomNumber(1, 3)),
//         environmentalFactors: getRandomElements(['Green Building', 'Rain Water Harvesting', 'Solar Panels'], getRandomNumber(0, 2)),
//         financingOptions: getRandomElements(['Home Loan', 'Construction Loan', 'Plot Loan'], getRandomNumber(1, 2))
//     };
// }

// async function generateProperties() {
//     try {
//         console.log('Starting property generation...');

//         const properties = [];

//         // Generate at least 2 properties of each type
//         for (const propertyType of propertyTypes) {
//             console.log(`Generating properties for type: ${propertyType}`);

//             // Generate 2-3 properties of each type
//             const count = getRandomNumber(2, 3);
//             for (let i = 0; i < count; i++) {
//                 const propertyData = generatePropertyData(propertyType, properties.length + 1);
//                 properties.push(propertyData);
//             }
//         }

//         console.log(`Generated ${properties.length} properties. Inserting into database...`);

//         // Insert properties in batches to avoid memory issues
//         const batchSize = 10;
//         for (let i = 0; i < properties.length; i += batchSize) {
//             const batch = properties.slice(i, i + batchSize);
//             await Property.insertMany(batch);
//             console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(properties.length / batchSize)}`);
//         }

//         console.log(`Successfully generated and inserted ${properties.length} properties!`);

//         // Print summary
//         const summary = {};
//         properties.forEach(prop => {
//             summary[prop.type_name] = (summary[prop.type_name] || 0) + 1;
//         });

//         console.log('\nProperty generation summary:');
//         Object.entries(summary).forEach(([type, count]) => {
//             console.log(`${type}: ${count} properties`);
//         });

//         return properties;

//     } catch (error) {
//         console.error('Error generating properties:', error);
//         throw error;
//     }
// }

// // Function to connect to MongoDB and run the script
// async function runScript() {
//     try {
//         // Connect to MongoDB (adjust connection string as needed)
//         await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         console.log('Connected to MongoDB');

//         // Generate properties
//         await generateProperties();

//         console.log('Script completed successfully!');

//     } catch (error) {
//         console.error('Script failed:', error);
//     } finally {
//         // Close database connection
//         await mongoose.connection.close();
//         console.log('Database connection closed');
//     }
// }

// // Run the script
// runScript();


const mongoose = require('mongoose');

// Define the Property schema directly in this file to avoid dependencies
const propertySchema = new mongoose.Schema({
    post_id: String,
    type_id: String,
    user_id: String,
    building_id: String,
    type_name: String,
    user_name: String,
    user_image: String,
    post_title: String,
    post_description: String,
    ownerName: String,
    whatsappAlerts: Boolean,
    whatsappContact: String,
    profoProxyAllowed: Boolean,
    rmAssigned: Boolean,
    rmName: String,
    rmID: String,
    phone: String,
    address: String,
    floor: Number,
    agreement: String,
    priceUnit: String,
    areaUnit: String,
    usp: [String],
    contactList: [Number],
    latitude: Number,
    longitude: Number,
    purpose: String,
    bedrooms: Number,
    bathrooms: Number,
    visted: Number,
    interaction: String,
    builder: mongoose.Schema.Types.ObjectId,
    building: mongoose.Schema.Types.ObjectId,
    buildingMongo: mongoose.Schema.Types.ObjectId,
    salesman: mongoose.Schema.Types.ObjectId,
    uploadInfo: {
        assignedBy: mongoose.Schema.Types.ObjectId,
        uploadedBy: mongoose.Schema.Types.ObjectId,
        uploadedAt: Date,
        changeHistory: Array
    },
    status: String,
    city: String,
    locality: String,
    pincode: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    area: String,
    anyConstraint: [Number],
    furnishing: String,
    amenities: [String],
    price: Number,
    priceOnRequest: Boolean,
    verified: Boolean,
    post_images: [{
        url: String,
        timestamp: Date
    }],
    floor_plan_images: [{
        url: String,
        timestamp: Date
    }],
    total_views: Number,
    favourite: Boolean,
    galleryList: Array,
    relatedProperty: Array,
    furnishStatus: String,
    carpetArea: Number,
    superBuiltupArea: Number,
    available: Boolean,
    category: Number,
    tags: [String],
    region: String,
    construction_status: String,
    possession: String,
    vastuCompliance: [String],
    maintenanceCharges: {
        minPrice: String,
        maxPrice: String,
        priceUnit: String,
        areaUnit: String
    },
    loanApprovalStatus: [String],
    builderReputation: String,
    broker_status: String,
    facilities: [String],
    location_advantage: [String],
    pricePerSqFt: Number,
    estimatedEMI: Number,
    reraStatus: String,
    reraRegistrationNumber: String,
    configuration: String,
    locationFactors: [String],
    facing: String,
    floorNumber: Number,
    totalFloors: Number,
    overlookingAmenities: [String],
    possessionDate: Date,
    transactionType: String,
    propertyOwnership: String,
    flooring: String,
    parking: String,
    propertyCode: String,
    widthOfFacingRoad: Number,
    gatedCommunity: Boolean,
    waterSource: [String],
    powerBackup: String,
    petFriendly: Boolean,
    propertyAge: Number,
    propertyTypes: [String],
    propertyFeatures: [String],
    viewTypes: [String],
    legalClearance: [String],
    environmentalFactors: [String],
    financingOptions: [String]
}, {
    timestamps: true
});

// Create the model
const Property = mongoose.model('Property', propertySchema);

// Sample data arrays for realistic property generation
const propertyTypes = [
    'Apartment',
    'Villa',
    'Independent House',
    'Builder Floor',
    'Studio Apartment',
    'Penthouse',
    'Duplex',
    'Triplex',
    'Commercial Office',
    'Retail Shop',
    'Warehouse',
    'Industrial Plot',
    'Residential Plot',
    'Farmhouse'
];

const cities = ['Kanpur'];

const localities = {
    'Kanpur': [
        'Civil Lines', 'Mall Road', 'Swaroop Nagar', 'Govind Nagar', 'Kidwai Nagar',
        'Arya Nagar', 'Shastri Nagar', 'Harsh Nagar', 'Kalyanpur', 'Kakadeo',
        'Barra', 'Juhi', 'Shyam Nagar', 'Fazalganj', 'Panki',
        'Nawabganj', 'Keshav Nagar', 'Tilak Nagar', 'Naubasta', 'Jajmau',
        'Chakeri', 'Rawatpur', 'Vikas Nagar', 'Indira Nagar', 'Kaushalpuri',
        'Gumti No 5', 'Krishna Nagar', 'Sarvodaya Nagar', 'Cantonment', 'GT Road',
        'Bagmugaliya', 'Nayaganj', 'Kakadev', 'Gulshan Nagar', 'Rajendra Nagar'
    ]
};

const amenities = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup',
    'Lift', 'Garden', 'Playground', 'Club House', 'Jogging Track',
    'CCTV', 'Intercom', 'Water Supply', 'Sewage Treatment',
    'Fire Safety', 'Maintenance Staff', 'Visitor Parking'
];

const furnishingTypes = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const facingTypes = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const constructionStatuses = ['Ready to Move', 'Under Construction', 'New Launch'];
const ownershipTypes = ['Freehold', 'Leasehold', 'Cooperative Society', 'Power of Attorney'];

// Sample ObjectIds (you should replace these with actual IDs from your database)
const sampleSalesmanIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId()
];

const sampleBuilderIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId()
];

const sampleBuildingIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId()
];

// Helper functions
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice(propertyType) {
    const priceRanges = {
        'Apartment': { min: 2000000, max: 15000000 },
        'Villa': { min: 8000000, max: 50000000 },
        'Independent House': { min: 5000000, max: 30000000 },
        'Builder Floor': { min: 3000000, max: 12000000 },
        'Studio Apartment': { min: 1500000, max: 6000000 },
        'Penthouse': { min: 15000000, max: 80000000 },
        'Duplex': { min: 6000000, max: 25000000 },
        'Triplex': { min: 8000000, max: 35000000 },
        'Commercial Office': { min: 5000000, max: 100000000 },
        'Retail Shop': { min: 2000000, max: 20000000 },
        'Warehouse': { min: 10000000, max: 50000000 },
        'Industrial Plot': { min: 5000000, max: 100000000 },
        'Residential Plot': { min: 1000000, max: 20000000 },
        'Farmhouse': { min: 8000000, max: 40000000 }
    };

    const range = priceRanges[propertyType] || { min: 2000000, max: 15000000 };
    return getRandomNumber(range.min, range.max);
}

function getCoordinatesForCity(city) {
    const cityCoords = {
        'Mumbai': { lat: 19.0760, lng: 72.8777 },
        'Delhi': { lat: 28.7041, lng: 77.1025 },
        'Bangalore': { lat: 12.9716, lng: 77.5946 },
        'Hyderabad': { lat: 17.3850, lng: 78.4867 },
        'Chennai': { lat: 13.0827, lng: 80.2707 },
        'Kolkata': { lat: 22.5726, lng: 88.3639 },
        'Pune': { lat: 18.5204, lng: 73.8567 },
        'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
        'Jaipur': { lat: 26.9124, lng: 75.7873 },
        'Lucknow': { lat: 26.8467, lng: 80.9462 }
    };

    const baseCoord = cityCoords[city] || { lat: 26.47352075730532, lng: 80.28529747886176 };
    // Add some random offset to simulate different locations within the city
    return {
        lat: baseCoord.lat + (Math.random() - 0.5) * 0.1,
        lng: baseCoord.lng + (Math.random() - 0.5) * 0.1
    };
}

function generatePropertyData(propertyType, index) {
    const city = getRandomElement(cities);
    const locality = getRandomElement(localities[city]);
    const coords = getCoordinatesForCity(city);
    const price = getRandomPrice(propertyType);
    const area = getRandomNumber(500, 3000);
    const bedrooms = propertyType.includes('Commercial') || propertyType.includes('Plot') ? 0 : getRandomNumber(1, 4);
    const bathrooms = bedrooms > 0 ? getRandomNumber(1, Math.max(1, bedrooms - 1)) : 0;

    return {
        post_id: `PROP_${Date.now()}_${index}`,
        type_id: `TYPE_${propertyType.replace(/\s+/g, '_').toUpperCase()}`,
        user_id: `USER_${getRandomNumber(1000, 9999)}`,
        building_id: `BLDG_${getRandomNumber(100, 999)}`,
        type_name: propertyType,
        user_name: `User ${getRandomNumber(1, 100)}`,
        user_image: `https://avatar.iran.liara.run/public/${getRandomNumber(1, 100)}`,
        post_title: `${propertyType} in ${locality}, ${city}`,
        post_description: `Beautiful ${propertyType.toLowerCase()} located in the prime area of ${locality}, ${city}. This property offers modern amenities and excellent connectivity.`,
        ownerName: `Owner ${getRandomNumber(1, 100)}`,
        whatsappAlerts: Math.random() > 0.5,
        whatsappContact: `+91${getRandomNumber(7000000000, 9999999999)}`,
        profoProxyAllowed: Math.random() > 0.3,
        rmAssigned: Math.random() > 0.4,
        rmName: Math.random() > 0.4 ? `RM ${getRandomNumber(1, 50)}` : null,
        rmID: Math.random() > 0.4 ? `RM_${getRandomNumber(1000, 9999)}` : null,
        phone: `+91${getRandomNumber(7000000000, 9999999999)}`,
        address: `${getRandomNumber(1, 999)}, ${locality}, ${city}`,
        floor: propertyType.includes('Plot') ? null : getRandomNumber(1, 20),
        agreement: getRandomElement(['Sale', 'Rent', 'Lease']),
        priceUnit: 'INR',
        areaUnit: 'sq ft',
        usp: getRandomElements([
            'Prime Location', 'Modern Amenities', 'Excellent Connectivity',
            'Gated Community', 'Ready to Move', 'Investment Opportunity'
        ], getRandomNumber(2, 4)),
        contactList: [getRandomNumber(7000000000, 9999999999)],
        latitude: coords.lat,
        longitude: coords.lng,
        purpose: getRandomElement(['Sale', 'Rent']),
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        visted: getRandomNumber(0, 100),
        interaction: getRandomElement(['VISIT', 'SAVE', 'CONTACT']),

        // Enhanced relationship fields
        builder: getRandomElement(sampleBuilderIds),
        building: getRandomElement(sampleBuildingIds),
        buildingMongo: getRandomElement(sampleBuildingIds),
        salesman: getRandomElement(sampleSalesmanIds),

        uploadInfo: {
            assignedBy: getRandomElement(sampleSalesmanIds),
            uploadedBy: getRandomElement(sampleSalesmanIds),
            uploadedAt: new Date(Date.now() - getRandomNumber(0, 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
            changeHistory: []
        },

        status: getRandomElement(['listed', 'unlisted', 'payment-delay']),
        city: city,
        locality: locality,
        pincode: `${getRandomNumber(100000, 999999)}`,

        location: {
            type: 'Point',
            coordinates: [coords.lng, coords.lat]
        },

        area: `${area} sq ft`,
        anyConstraint: [getRandomNumber(1, 5)],
        furnishing: getRandomElement(furnishingTypes),
        amenities: getRandomElements(amenities, getRandomNumber(5, 12)),
        price: price,
        priceOnRequest: Math.random() > 0.8,
        verified: Math.random() > 0.3,

        post_images: Array.from({ length: getRandomNumber(3, 8) }, (_, i) => ({
            url: `https://picsum.photos/800/600?random=${Date.now()}_${index}_${i}`,
            timestamp: new Date()
        })),

        floor_plan_images: Array.from({ length: getRandomNumber(1, 3) }, (_, i) => ({
            url: `https://picsum.photos/600/400?random=floor_${Date.now()}_${index}_${i}`,
            timestamp: new Date()
        })),

        total_views: getRandomNumber(10, 500),
        favourite: Math.random() > 0.7,
        galleryList: [],
        relatedProperty: [],
        furnishStatus: getRandomElement(furnishingTypes),
        carpetArea: Math.floor(area * 0.8),
        superBuiltupArea: Math.floor(area * 1.2),
        available: Math.random() > 0.2,
        category: getRandomNumber(1, 5),
        tags: getRandomElements(['Premium', 'Luxury', 'Affordable', 'Investment', 'Family'], getRandomNumber(1, 3)),
        region: `${city} Region`,
        construction_status: getRandomElement(constructionStatuses),
        possession: getRandomElement(['Immediate', '3 months', '6 months', '1 year']),
        vastuCompliance: getRandomElements(['East Facing', 'Proper Ventilation', 'Natural Light'], getRandomNumber(1, 3)),

        maintenanceCharges: {
            minPrice: `${getRandomNumber(5, 15)}`,
            maxPrice: `${getRandomNumber(15, 25)}`,
            priceUnit: 'INR',
            areaUnit: 'per sq ft'
        },

        loanApprovalStatus: getRandomElements(['Pre-approved', 'Bank Approved', 'NBFC Approved'], getRandomNumber(1, 2)),
        builderReputation: getRandomElement(['Excellent', 'Good', 'Average']),
        broker_status: getRandomElement(['Direct Owner', 'Broker', 'Builder']),
        facilities: getRandomElements(amenities, getRandomNumber(3, 8)),
        location_advantage: getRandomElements([
            'Near Metro', 'Near Airport', 'IT Hub', 'Shopping Complex',
            'Schools Nearby', 'Hospitals Nearby', 'Market Area'
        ], getRandomNumber(2, 5)),

        // Property specific fields
        pricePerSqFt: Math.floor(price / area),
        estimatedEMI: Math.floor(price * 0.008), // Rough EMI calculation
        reraStatus: Math.random() > 0.5 ? 'RERA Approved' : 'Pending',
        reraRegistrationNumber: Math.random() > 0.5 ? `RERA/${city}/2024/${getRandomNumber(1000, 9999)}` : null,
        configuration: bedrooms > 0 ? `${bedrooms}BHK` : propertyType,
        locationFactors: getRandomElements([
            'Prime Location', 'Developing Area', 'Established Locality',
            'Commercial Hub', 'Residential Area'
        ], getRandomNumber(1, 3)),
        facing: getRandomElement(facingTypes),
        floorNumber: propertyType.includes('Plot') ? null : getRandomNumber(1, 20),
        totalFloors: propertyType.includes('Plot') ? null : getRandomNumber(5, 25),
        overlookingAmenities: getRandomElements(['Garden', 'Pool', 'Park', 'Road'], getRandomNumber(1, 2)),
        possessionDate: new Date(Date.now() + getRandomNumber(0, 365) * 24 * 60 * 60 * 1000),
        transactionType: getRandomElement(['New Booking', 'Resale']),
        propertyOwnership: getRandomElement(ownershipTypes),
        flooring: getRandomElement(['Marble', 'Vitrified', 'Wooden', 'Ceramic']),
        parking: `${getRandomNumber(1, 3)} Cars`,
        propertyCode: `PC_${Date.now()}_${index}`,
        widthOfFacingRoad: getRandomNumber(20, 60),
        gatedCommunity: Math.random() > 0.4,
        waterSource: getRandomElements(['Borewell', 'Municipal', 'Tanker'], getRandomNumber(1, 2)),
        powerBackup: getRandomElement(['Generator', 'Inverter', 'Solar', 'None']),
        petFriendly: Math.random() > 0.6,
        propertyAge: getRandomNumber(0, 20),

        // Array fields
        propertyTypes: [propertyType],
        propertyFeatures: getRandomElements([
            'Balcony', 'Terrace', 'Study Room', 'Servant Room',
            'Pooja Room', 'Store Room', 'Utility Area'
        ], getRandomNumber(2, 5)),
        viewTypes: getRandomElements(['City View', 'Garden View', 'Pool View', 'Road View'], getRandomNumber(1, 2)),
        legalClearance: getRandomElements(['Clear Title', 'Approved Plan', 'NOC Available'], getRandomNumber(1, 3)),
        environmentalFactors: getRandomElements(['Green Building', 'Rain Water Harvesting', 'Solar Panels'], getRandomNumber(0, 2)),
        financingOptions: getRandomElements(['Home Loan', 'Construction Loan', 'Plot Loan'], getRandomNumber(1, 2))
    };
}

async function generateProperties() {
    try {
        console.log('Starting property generation...');

        const properties = [];

        // Generate at least 2 properties of each type
        for (const propertyType of propertyTypes) {
            console.log(`Generating properties for type: ${propertyType}`);

            // Generate 2-3 properties of each type
            const count = getRandomNumber(2, 3);
            for (let i = 0; i < count; i++) {
                const propertyData = generatePropertyData(propertyType, properties.length + 1);
                properties.push(propertyData);
            }
        }

        console.log(`Generated ${properties.length} properties. Inserting into database...`);

        // Insert properties in batches to avoid memory issues
        const batchSize = 10;
        for (let i = 0; i < properties.length; i += batchSize) {
            const batch = properties.slice(i, i + batchSize);
            await Property.insertMany(batch);
            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(properties.length / batchSize)}`);
        }

        console.log(`Successfully generated and inserted ${properties.length} properties!`);

        // Print summary
        const summary = {};
        properties.forEach(prop => {
            summary[prop.type_name] = (summary[prop.type_name] || 0) + 1;
        });

        console.log('\nProperty generation summary:');
        Object.entries(summary).forEach(([type, count]) => {
            console.log(`${type}: ${count} properties`);
        });

        return properties;

    } catch (error) {
        console.error('Error generating properties:', error);
        throw error;
    }
}

// Function to connect to MongoDB and run the script
async function runScript() {
    try {
        // Connect to MongoDB (adjust connection string as needed)
        await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Generate properties
        await generateProperties();

        console.log('Script completed successfully!');

    } catch (error) {
        console.error('Script failed:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the script
runScript();