
const express = require('express');
const router = express.Router();
const Interaction = require("../models/PropertyInteraction"); // Updated model name
const Property = require('../models/Property');
const Project = require('../models/Project'); // Import Project model
const Building = require('../Building'); // Import Project model
const mixpanel = require('mixpanel');
const { authenticateToken } = require('../middleware/auth');
const mixpanelClient = mixpanel.init('79ff92f256ca2a109638e7812a849f54');
const User = require('../User');
const Builder = require('../Builder');
const adminAuthenticate = require('../middleware/adminAuthenticate');

// POST endpoint to record interactions (both property and project)
// router.post('/api/interactions', authenticateToken, async (req, res) => {
//     console.log("Interaction started");

//     try {
//         const userDetails = req.user;
//         let userInfo;

//         if (!userDetails) {
//             console.log('\n❌ User details not found');
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         } else {
//             // Find the user
//             const user = await User.findById(userDetails?.id);
//             userInfo = user;
//             console.log("USER INFO - ", user);
//         }

//         const {
//             propertyId,
//             projectId, // New field for project interactions
//             interactionType,
//             incrementBy,
//             metadata
//         } = req.body;

//         console.log("req.body", req.body);

//         // Determine interaction entity type
//         const interactionEntity = projectId ? 'PROJECT' : 'PROPERTY';

//         // Handle CONTACT interaction
//         if (interactionType === 'CONTACT') {
//             let contactDetails = null;

//             if (interactionEntity === 'PROPERTY') {
//                 // Find property for contact information
//                 const property = await Property.findOne({ post_id: propertyId });

//                 if (!property) {
//                     return res.status(404).json({
//                         success: false,
//                         message: 'Property not found'
//                     });
//                 }

//                 // Get the first contact number from contactList
//                 contactDetails = {
//                     phone: property.contactList && property.contactList.length > 0
//                         ? property.contactList[0].toString()
//                         : null,
//                     entityId: propertyId
//                 };
//             } else if (interactionEntity === 'PROJECT') {
//                 // Find project for contact information
//                 const project = await Project.findOne({ projectId: projectId });

//                 if (!project) {
//                     return res.status(404).json({
//                         success: false,
//                         message: 'Project not found'
//                     });
//                 }

//                 // Get builder information for contact
//                 const builder = project.builder ?
//                     await Builder.findById(project.builder) : null;

//                 contactDetails = {
//                     phone: builder?.phone || null,
//                     entityId: projectId
//                 };
//             }

//             // Create interaction with contact details
//             const interaction = new Interaction({
//                 userId: req.user.id,
//                 propertyId: interactionEntity === 'PROPERTY' ? propertyId : null,
//                 projectId: interactionEntity === 'PROJECT' ? projectId : null,
//                 interactionEntity,
//                 interactionType,
//                 phoneNumber: contactDetails?.phone,
//                 email: userDetails.email,
//                 locationInfo: {
//                     address: userDetails.profile?.addressDetails?.street || '',
//                     city: metadata?.city || '',
//                     state: metadata?.state || '',
//                     country: metadata?.country || '',
//                     pincode: metadata?.pincode || '',
//                     coordinates: metadata?.coordinates || [0, 0]
//                 },
//                 metadata: {
//                     ...metadata,
//                     location: {
//                         type: 'Point',
//                         coordinates: metadata?.location?.coordinates || [0, 0]
//                     },
//                     timestamp: new Date(),
//                     contactMethod: 'PHONE', // Default to phone contact
//                     contactStatus: 'INITIATED'
//                 }
//             });

//             await interaction.save();

//             // Update user's contact history
//             const historyEntry = {
//                 contactType: 'CALL',
//                 status: 'INITIATED',
//                 timestamp: new Date()
//             };

//             if (interactionEntity === 'PROPERTY') {
//                 historyEntry.propertyId = propertyId;
//                 historyEntry.ownerPhone = contactDetails?.phone;
//             } else {
//                 historyEntry.projectId = projectId;
//                 historyEntry.builderPhone = contactDetails?.phone;
//             }

//             await User.findByIdAndUpdate(req.user.id, {
//                 $push: {
//                     'history.contactedProperties': historyEntry
//                 }
//             });

//             // Send interaction data to Mixpanel
//             mixpanelClient.track(`${interactionEntity} Contact`, {
//                 distinct_id: req.user.id,
//                 property_id: propertyId,
//                 project_id: projectId,
//                 interaction_type: 'CONTACT',
//                 entity_type: interactionEntity,
//                 metadata: metadata,
//                 timestamp: new Date().toISOString()
//             });

//             return res.status(201).json({
//                 success: true,
//                 message: `Contact interaction for ${interactionEntity.toLowerCase()} recorded successfully`,
//                 data: interaction
//             });
//         }

//         // For non-CONTACT interaction types
//         const interaction = new Interaction({
//             userId: req.user.id,
//             propertyId: interactionEntity === 'PROPERTY' ? propertyId : null,
//             projectId: interactionEntity === 'PROJECT' ? projectId : null,
//             interactionEntity,
//             interactionType,
//             phoneNumber: userInfo?.phone,
//             email: userInfo?.email,
//             locationInfo: {
//                 address: userDetails.profile?.addressDetails?.street || '',
//                 city: metadata?.city || '',
//                 state: metadata?.state || '',
//                 country: metadata?.country || '',
//                 pincode: metadata?.pincode || '',
//                 coordinates: metadata?.coordinates || [0, 0]
//             },
//             metadata: {
//                 ...metadata,
//                 location: {
//                     type: 'Point',
//                     coordinates: metadata?.location?.coordinates || [0, 0]
//                 },
//                 timestamp: new Date()
//             }
//         });

//         await interaction.save();

//         // Send interaction data to Mixpanel
//         mixpanelClient.track(`${interactionEntity} Interaction`, {
//             distinct_id: req.user.id,
//             property_id: propertyId,
//             project_id: projectId,
//             interaction_type: interactionType,
//             entity_type: interactionEntity,
//             metadata: metadata,
//             timestamp: new Date().toISOString()
//         });

//         // Handle VISIT interaction for property
//         if (interactionType === 'VISIT' && interactionEntity === 'PROPERTY') {
//             const property = await Property.findOneAndUpdate(
//                 { post_id: propertyId },
//                 { $inc: { visted: incrementBy || 1 } },
//                 { new: true, runValidators: true }
//             );

//             await User.findByIdAndUpdate(req.user.id, {
//                 $push: {
//                     'history.viewedProperties': {
//                         propertyId,
//                         timestamp: new Date(),
//                         timeSpent: metadata?.visitDuration
//                     }
//                 }
//             });

//             mixpanelClient.track('Property Visit', {
//                 distinct_id: req.user.id,
//                 property_id: propertyId,
//                 visit_duration: metadata?.visitDuration || 0,
//                 timestamp: new Date().toISOString()
//             });
//         }

//         // Handle VISIT interaction for project
//         if (interactionType === 'VISIT' && interactionEntity === 'PROJECT') {
//             const project = await Project.findOneAndUpdate(
//                 { projectId: projectId },
//                 { $inc: { visted: incrementBy || 1 } },
//                 { new: true, runValidators: true }
//             );

//             await User.findByIdAndUpdate(req.user.id, {
//                 $push: {
//                     'history.viewedProjects': {
//                         projectId,
//                         timestamp: new Date(),
//                         timeSpent: metadata?.visitDuration
//                     }
//                 }
//             });

//             mixpanelClient.track('Project Visit', {
//                 distinct_id: req.user.id,
//                 project_id: projectId,
//                 visit_duration: metadata?.visitDuration || 0,
//                 timestamp: new Date().toISOString()
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: `Interaction for ${interactionEntity.toLowerCase()} recorded successfully`,
//             data: interaction
//         });

//     } catch (error) {
//         console.error('Error recording interaction:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to record interaction',
//             error: error.message
//         });
//     }
// });

// POST endpoint to record interactions (both property and project)
router.post('/api/interactions', authenticateToken, async (req, res) => {
    console.log("Interaction started");

    try {
        const userDetails = req.user;
        let userInfo;

        if (!userDetails) {
            console.log('\n❌ User details not found');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        } else {
            // Find the user
            const user = await User.findById(userDetails?.id);
            userInfo = user;
            console.log("USER INFO - ", user);
        }

        const {
            propertyId,
            projectId, // New field for project interactions
            interactionType,
            incrementBy,
            metadata
        } = req.body;

        console.log("req.body", req.body);

        // Determine interaction entity type
        const interactionEntity = projectId ? 'PROJECT' : 'PROPERTY';

        // Handle CONTACT interaction
        if (interactionType === 'CONTACT') {
            let contactDetails = null;

            if (interactionEntity === 'PROPERTY') {
                // Find property for contact information
                const property = await Property.findOne({ post_id: propertyId });

                if (!property) {
                    return res.status(404).json({
                        success: false,
                        message: 'Property not found'
                    });
                }

                // Get the first contact number from contactList
                contactDetails = {
                    phone: property.contactList && property.contactList.length > 0
                        ? property.contactList[0].toString()
                        : null,
                    entityId: propertyId
                };
            } else if (interactionEntity === 'PROJECT') {
                // Find project for contact information
                const project = await Project.findOne({ projectId: projectId });

                if (!project) {
                    return res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                }

                // Get builder information for contact
                const builder = project.builder ?
                    await Builder.findById(project.builder) : null;

                contactDetails = {
                    phone: builder?.phone || null,
                    entityId: projectId
                };
            }

            // Create interaction with contact details
            const interaction = new Interaction({
                userId: req.user.id,
                propertyId: interactionEntity === 'PROPERTY' ? propertyId : null,
                projectId: interactionEntity === 'PROJECT' ? projectId : null,
                interactionEntity,
                interactionType,
                phoneNumber: contactDetails?.phone,
                email: userDetails.email,
                locationInfo: {
                    address: userDetails.profile?.addressDetails?.street || '',
                    city: metadata?.city || '',
                    state: metadata?.state || '',
                    country: metadata?.country || '',
                    pincode: metadata?.pincode || '',
                    coordinates: metadata?.coordinates || [0, 0]
                },
                metadata: {
                    ...metadata,
                    location: {
                        type: 'Point',
                        coordinates: metadata?.location?.coordinates || [0, 0]
                    },
                    timestamp: new Date(),
                    contactMethod: 'PHONE', // Default to phone contact
                    contactStatus: 'INITIATED'
                }
            });

            await interaction.save();

            // CHANGE: Update user's contact history with proper entity type and fields
            const historyEntry = {
                contactType: 'CALL',
                status: 'INITIATED',
                timestamp: new Date(),
                entityType: interactionEntity // Add entity type to distinguish between property and project
            };

            if (interactionEntity === 'PROPERTY') {
                historyEntry.propertyId = propertyId;
                historyEntry.ownerPhone = contactDetails?.phone;
            } else {
                // CHANGE: Add projectId and builderPhone for project contacts
                historyEntry.projectId = projectId;
                historyEntry.builderPhone = contactDetails?.phone;
            }

            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    'history.contactedProperties': historyEntry
                }
            });

            // Send interaction data to Mixpanel
            mixpanelClient.track(`${interactionEntity} Contact`, {
                distinct_id: req.user.id,
                property_id: propertyId,
                project_id: projectId,
                interaction_type: 'CONTACT',
                entity_type: interactionEntity,
                metadata: metadata,
                timestamp: new Date().toISOString()
            });

            return res.status(201).json({
                success: true,
                message: `Contact interaction for ${interactionEntity.toLowerCase()} recorded successfully`,
                data: interaction
            });
        }

        // For non-CONTACT interaction types
        const interaction = new Interaction({
            userId: req.user.id,
            propertyId: interactionEntity === 'PROPERTY' ? propertyId : null,
            projectId: interactionEntity === 'PROJECT' ? projectId : null,
            interactionEntity,
            interactionType,
            phoneNumber: userInfo?.phone,
            email: userInfo?.email,
            locationInfo: {
                address: userDetails.profile?.addressDetails?.street || '',
                city: metadata?.city || '',
                state: metadata?.state || '',
                country: metadata?.country || '',
                pincode: metadata?.pincode || '',
                coordinates: metadata?.coordinates || [0, 0]
            },
            metadata: {
                ...metadata,
                location: {
                    type: 'Point',
                    coordinates: metadata?.location?.coordinates || [0, 0]
                },
                timestamp: new Date()
            }
        });

        await interaction.save();

        // Send interaction data to Mixpanel
        mixpanelClient.track(`${interactionEntity} Interaction`, {
            distinct_id: req.user.id,
            property_id: propertyId,
            project_id: projectId,
            interaction_type: interactionType,
            entity_type: interactionEntity,
            metadata: metadata,
            timestamp: new Date().toISOString()
        });

        // Handle VISIT interaction for property
        if (interactionType === 'VISIT' && interactionEntity === 'PROPERTY') {
            const property = await Property.findOneAndUpdate(
                { post_id: propertyId },
                { $inc: { visted: incrementBy || 1 } },
                { new: true, runValidators: true }
            );

            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    'history.viewedProperties': {
                        propertyId,
                        // CHANGE: Add entityType for consistency
                        entityType: 'property',
                        timestamp: new Date(),
                        timeSpent: metadata?.visitDuration
                    }
                }
            });

            mixpanelClient.track('Property Visit', {
                distinct_id: req.user.id,
                property_id: propertyId,
                visit_duration: metadata?.visitDuration || 0,
                timestamp: new Date().toISOString()
            });
        }

        // Handle VISIT interaction for project
        if (interactionType === 'VISIT' && interactionEntity === 'PROJECT') {
            const project = await Project.findOneAndUpdate(
                { projectId: projectId },
                { $inc: { visted: incrementBy || 1 } },
                { new: true, runValidators: true }
            );

            // CHANGE: Update to use viewedProjects array for project visits
            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    'history.viewedProjects': {
                        projectId,
                        entityType: 'project',
                        timestamp: new Date(),
                        timeSpent: metadata?.visitDuration
                    }
                }
            });

            mixpanelClient.track('Project Visit', {
                distinct_id: req.user.id,
                project_id: projectId,
                visit_duration: metadata?.visitDuration || 0,
                timestamp: new Date().toISOString()
            });
        }

        res.status(201).json({
            success: true,
            message: `Interaction for ${interactionEntity.toLowerCase()} recorded successfully`,
            data: interaction
        });

    } catch (error) {
        console.error('Error recording interaction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record interaction',
            error: error.message
        });
    }
});


// Updated GET stats API to handle both property and project interactions with titles
router.get('/api/interactions/stats', async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            propertyId,
            projectId,
            interactionType,
            interactionEntity,
            builderId
        } = req.query;

        const query = {};
        console.log("Query params:", req.query);

        // Add date range filter if provided
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) {
                // Parse the date string correctly
                const parsedStartDate = new Date(startDate);
                if (!isNaN(parsedStartDate.getTime())) {
                    query.timestamp.$gte = parsedStartDate;
                }
            }
            if (endDate) {
                // Parse the date string correctly
                const parsedEndDate = new Date(endDate);
                if (!isNaN(parsedEndDate.getTime())) {
                    query.timestamp.$lte = parsedEndDate;
                }
            }
        }

        // Add property/project filter if provided
        if (propertyId) query.propertyId = propertyId;
        if (projectId) query.projectId = projectId;

        // Add entity type filter if provided
        if (interactionEntity) query.interactionEntity = interactionEntity;

        // Add interaction type filter if provided
        if (interactionType) query.interactionType = interactionType;

        // Get builder access status if builderId provided
        let builderAccess = false;
        if (builderId) {
            const builder = await Builder.findById(builderId);
            if (builder) {
                builderAccess = builder.access;
            }
        }

        // Get interactions with user details and entity titles
        const interactions = await Interaction.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Add a stage to handle mixed types (convert string IDs to arrays if needed)
            {
                $addFields: {
                    propertyIdArray: {
                        $cond: [
                            { $eq: ['$interactionEntity', 'PROPERTY'] },
                            {
                                $cond: [
                                    { $isArray: '$propertyId' },
                                    '$propertyId',
                                    { $cond: [{ $eq: ['$propertyId', null] }, [], ['$propertyId']] }
                                ]
                            },
                            []
                        ]
                    },
                    projectIdArray: {
                        $cond: [
                            { $eq: ['$interactionEntity', 'PROJECT'] },
                            {
                                $cond: [
                                    { $isArray: '$projectId' },
                                    '$projectId',
                                    { $cond: [{ $eq: ['$projectId', null] }, [], ['$projectId']] }
                                ]
                            },
                            []
                        ]
                    },
                    buildingIdArray: {
                        $cond: [
                            { $eq: ['$interactionEntity', 'BUILDING'] },
                            {
                                $cond: [
                                    { $isArray: '$buildingId' },
                                    '$buildingId',
                                    { $cond: [{ $eq: ['$buildingId', null] }, [], ['$buildingId']] }
                                ]
                            },
                            []
                        ]
                    }
                }
            },
            // Add lookups for entity titles based on entity type
            {
                $lookup: {
                    from: 'properties',
                    let: {
                        propertyId: { $arrayElemAt: ['$propertyIdArray', 0] }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$post_id', '$$propertyId']
                                }
                            }
                        },
                        { $project: { post_title: 1 } }
                    ],
                    as: 'propertyDetails'
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    let: {
                        projectId: { $arrayElemAt: ['$projectIdArray', 0] }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$projectId', '$$projectId']
                                }
                            }
                        },
                        { $project: { name: 1 } }
                    ],
                    as: 'projectDetails'
                }
            },
            {
                $lookup: {
                    from: 'buildings',
                    let: {
                        buildingId: { $arrayElemAt: ['$buildingIdArray', 0] }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $ne: ['$$buildingId', null] },
                                        { $ne: ['$$buildingId', ''] },
                                        { $eq: ['$_id', { $toObjectId: '$$buildingId' }] }
                                    ]
                                }
                            }
                        },
                        { $project: { name: 1 } }
                    ],
                    as: 'buildingDetails'
                }
            },
            {
                $addFields: {
                    entityTitle: {
                        $cond: [
                            { $eq: ['$interactionEntity', 'PROPERTY'] },
                            { $ifNull: [{ $arrayElemAt: ['$propertyDetails.post_title', 0] }, 'Unknown Property'] },
                            {
                                $cond: [
                                    { $eq: ['$interactionEntity', 'PROJECT'] },
                                    { $ifNull: [{ $arrayElemAt: ['$projectDetails.name', 0] }, 'Unknown Project'] },
                                    { $ifNull: [{ $arrayElemAt: ['$buildingDetails.name', 0] }, 'Unknown Building'] }
                                ]
                            }
                        ]
                    },
                    entityId: {
                        $cond: [
                            { $eq: ['$interactionEntity', 'PROPERTY'] },
                            { $arrayElemAt: ['$propertyIdArray', 0] },
                            {
                                $cond: [
                                    { $eq: ['$interactionEntity', 'PROJECT'] },
                                    { $arrayElemAt: ['$projectIdArray', 0] },
                                    { $arrayElemAt: ['$buildingIdArray', 0] }
                                ]
                            }
                        ]
                    },
                    formattedLocation: {
                        $concat: [
                            { $ifNull: ['$locationInfo.address', ''] },
                            { $cond: [{ $ifNull: ['$locationInfo.city', false] }, ', ', ''] },
                            { $ifNull: ['$locationInfo.city', ''] },
                            { $cond: [{ $ifNull: ['$locationInfo.state', false] }, ', ', ''] },
                            { $ifNull: ['$locationInfo.state', ''] },
                            { $cond: [{ $ifNull: ['$locationInfo.country', false] }, ', ', ''] },
                            { $ifNull: ['$locationInfo.country', ''] },
                            { $cond: [{ $ifNull: ['$locationInfo.pincode', false] }, ' - ', ''] },
                            { $ifNull: ['$locationInfo.pincode', ''] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        entityId: '$entityId',
                        entityType: '$interactionEntity',
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
                    },
                    entityTitle: { $first: '$entityTitle' },
                    interactions: {
                        $push: {
                            type: '$interactionType',
                            timestamp: '$timestamp',
                            metadata: '$metadata',
                            phoneNumber: '$phoneNumber',
                            email: '$email',
                            locationInfo: '$locationInfo',
                            formattedLocation: '$formattedLocation',
                            entityTitle: '$entityTitle',
                            user: {
                                name: { $ifNull: ['$user.name', 'Unknown User'] }
                            }
                        }
                    },
                    totalVisits: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
                    },
                    totalSaves: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
                    },
                    totalContacts: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    },
                    totalCallbacks: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'CALLBACK'] }, 1, 0] }
                    }
                }
            },
            {
                $sort: { '_id.date': -1 }
            }
        ]);

        console.log("Processed interactions:", interactions.length);

        // Format response for the dashboard with contact info hiding based on builder access
        const formattedResponse = interactions.map(item => ({
            entityId: item._id.entityId,
            entityType: item._id.entityType,
            entityTitle: item.entityTitle,
            date: item._id.date,
            stats: {
                visits: item.totalVisits,
                saves: item.totalSaves,
                contacts: item.totalContacts,
                callbacks: item.totalCallbacks || 0
            },
            details: item.interactions.map(interaction => {
                return {
                    type: interaction.type,
                    timestamp: interaction.timestamp,
                    userName: interaction.user.name,
                    entityTitle: interaction.entityTitle,
                    contactInfo: {
                        // Hide contact info based on builder access
                        phoneNumber: builderAccess ? interaction.phoneNumber : "+91 **********",
                        email: builderAccess ? interaction.email : "*******@gmail.com"
                    },
                    location: {
                        formatted: interaction.formattedLocation || '',
                        details: {
                            address: interaction.locationInfo?.address || '',
                            city: interaction.locationInfo?.city || '',
                            state: interaction.locationInfo?.state || '',
                            country: interaction.locationInfo?.country || '',
                            pincode: interaction.locationInfo?.pincode || ''
                            // coordinates intentionally excluded as they're private
                        }
                    },
                    metadata: {
                        visitDuration: interaction.metadata?.visitDuration,
                        visitType: interaction.metadata?.visitType,
                        contactMethod: interaction.metadata?.contactMethod,
                        contactStatus: interaction.metadata?.contactStatus,
                        deviceInfo: interaction.metadata?.deviceInfo,
                        city: interaction.metadata?.city,
                        subLocality: interaction.metadata?.subLocality,
                        locality: interaction.metadata?.locality
                        // location.coordinates intentionally excluded as they're private
                    }
                };
            })
        }));

        res.json({
            success: true,
            count: formattedResponse.length,
            data: formattedResponse
        });

    } catch (error) {
        console.error('Error fetching interaction stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch interaction statistics',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Updated GET API for specific entity (property or project) interactions
// router.get('/api/interactions/:entityType/:entityId', async (req, res) => {
//     try {
//         const { entityType, entityId } = req.params;
//         const { date } = req.query;

//         if (!['PROPERTY', 'PROJECT', 'BUILDING'].includes(entityType.toUpperCase())) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid entity type. Must be PROPERTY, PROJECT, or BUILDING'
//             });
//         }

//         const query = {
//             interactionEntity: entityType.toUpperCase()
//         };

//         // Set the appropriate ID field based on entity type
//         if (entityType.toUpperCase() === 'PROPERTY') {
//             query.propertyId = entityId;
//         } else if (entityType.toUpperCase() === 'PROJECT') {
//             query.projectId = entityId;
//         } else {
//             query.buildingId = entityId;
//         }

//         // Add date filter if provided
//         if (date) {
//             const startDate = new Date(date);
//             const endDate = new Date(date);
//             endDate.setDate(endDate.getDate() + 1);
//             query.timestamp = {
//                 $gte: startDate,
//                 $lt: endDate
//             };
//         }

//         // Get entity title based on entity type
//         let entityTitle = 'Unknown';
//         if (entityType.toUpperCase() === 'PROPERTY') {
//             const property = await Property.findOne({ post_id: entityId });
//             if (property) {
//                 entityTitle = property.post_title || 'Unknown Property';
//             }
//         } else if (entityType.toUpperCase() === 'PROJECT') {
//             const project = await Project.findOne({ projectId: entityId });
//             if (project) {
//                 entityTitle = project.name || 'Unknown Project';
//             }
//         } else {
//             try {
//                 const building = await Building.findById(entityId);
//                 if (building) {
//                     entityTitle = building.name || 'Unknown Building';
//                 }
//             } catch (error) {
//                 console.error('Error finding building:', error);
//             }
//         }

//         const interactions = await Interaction.aggregate([
//             { $match: query },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'userId',
//                     foreignField: '_id',
//                     as: 'user'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$user',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $project: {
//                     interactionType: 1,
//                     interactionEntity: 1,
//                     timestamp: 1,
//                     metadata: 1,
//                     phoneNumber: 1,
//                     email: 1,
//                     locationInfo: 1,
//                     'user.name': 1
//                 }
//             },
//             {
//                 $addFields: {
//                     entityTitle: entityTitle,
//                     formattedLocation: {
//                         $concat: [
//                             { $ifNull: ['$locationInfo.address', ''] },
//                             { $cond: [{ $ifNull: ['$locationInfo.city', false] }, ', ', ''] },
//                             { $ifNull: ['$locationInfo.city', ''] },
//                             { $cond: [{ $ifNull: ['$locationInfo.state', false] }, ', ', ''] },
//                             { $ifNull: ['$locationInfo.state', ''] },
//                             { $cond: [{ $ifNull: ['$locationInfo.country', false] }, ', ', ''] },
//                             { $ifNull: ['$locationInfo.country', ''] },
//                             { $cond: [{ $ifNull: ['$locationInfo.pincode', false] }, ' - ', ''] },
//                             { $ifNull: ['$locationInfo.pincode', ''] }
//                         ]
//                     }
//                 }
//             },
//             { $sort: { timestamp: -1 } }
//         ]);

//         // Format the response data
//         const formattedInteractions = interactions.map(interaction => ({
//             id: interaction._id,
//             type: interaction.interactionType,
//             entityType: interaction.interactionEntity,
//             entityTitle: interaction.entityTitle,
//             timestamp: interaction.timestamp,
//             userName: interaction.user?.name || 'Unknown User',
//             contactInfo: {
//                 phoneNumber: interaction.phoneNumber,
//                 email: interaction.email
//             },
//             location: {
//                 formatted: interaction.formattedLocation || '',
//                 details: {
//                     address: interaction.locationInfo?.address || '',
//                     city: interaction.locationInfo?.city || '',
//                     state: interaction.locationInfo?.state || '',
//                     country: interaction.locationInfo?.country || '',
//                     pincode: interaction.locationInfo?.pincode || ''
//                     // coordinates intentionally excluded as they're private
//                 }
//             },
//             metadata: {
//                 visitDuration: interaction.metadata?.visitDuration,
//                 visitType: interaction.metadata?.visitType,
//                 contactMethod: interaction.metadata?.contactMethod,
//                 contactStatus: interaction.metadata?.contactStatus,
//                 deviceInfo: interaction.metadata?.deviceInfo,
//                 city: interaction.metadata?.city,
//                 subLocality: interaction.metadata?.subLocality,
//                 locality: interaction.metadata?.locality
//                 // location.coordinates intentionally excluded as they're private
//             }
//         }));

//         res.json({
//             success: true,
//             count: formattedInteractions.length,
//             entityTitle: entityTitle,
//             data: formattedInteractions
//         });

//     } catch (error) {
//         console.error(`Error fetching ${req.params.entityType} interactions:`, error);
//         res.status(500).json({
//             success: false,
//             message: `Failed to fetch ${req.params.entityType} interactions`,
//             error: error.message
//         });
//     }
// });

// Updated GET API for specific entity (property or project) interactions
router.get('/api/interactions/:entityType/:entityId', async (req, res) => {
    try {
        const { entityType, entityId } = req.params;
        const { date } = req.query;

        if (!['PROPERTY', 'PROJECT', 'BUILDING'].includes(entityType.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid entity type. Must be PROPERTY, PROJECT, or BUILDING'
            });
        }

        // Create the query with a more flexible approach to handle both array and string fields
        let query = { interactionEntity: entityType.toUpperCase() };

        // Set the appropriate ID field based on entity type
        if (entityType.toUpperCase() === 'PROPERTY') {
            // Handle both cases where propertyId could be a string or an array
            query.$or = [
                { propertyId: entityId },
                { propertyId: { $elemMatch: { $eq: entityId } } }
            ];
        } else if (entityType.toUpperCase() === 'PROJECT') {
            // Handle both cases where projectId could be a string or an array
            query.$or = [
                { projectId: entityId },
                { projectId: { $elemMatch: { $eq: entityId } } }
            ];
        } else {
            // Handle both cases where buildingId could be a string or an array
            query.$or = [
                { buildingId: entityId },
                { buildingId: { $elemMatch: { $eq: entityId } } }
            ];
        }

        // Add date filter if provided
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.timestamp = {
                $gte: startDate,
                $lt: endDate
            };
        }

        console.log("Query for interactions:", JSON.stringify(query, null, 2));

        // Get entity title based on entity type
        let entityTitle = 'Unknown';
        if (entityType.toUpperCase() === 'PROPERTY') {
            const property = await Property.findOne({ post_id: entityId });
            if (property) {
                entityTitle = property.post_title || 'Unknown Property';
            }
        } else if (entityType.toUpperCase() === 'PROJECT') {
            const project = await Project.findOne({ projectId: entityId });
            if (project) {
                entityTitle = project.name || 'Unknown Project';
            }
        } else {
            try {
                const building = await Building.findById(entityId);
                if (building) {
                    entityTitle = building.name || 'Unknown Building';
                }
            } catch (error) {
                console.error('Error finding building:', error);
            }
        }

        const interactions = await Interaction.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    interactionType: 1,
                    interactionEntity: 1,
                    timestamp: 1,
                    metadata: 1,
                    phoneNumber: 1,
                    email: 1,
                    locationInfo: 1,
                    'user.name': 1
                }
            },
            {
                $addFields: {
                    entityTitle: entityTitle,
                    formattedLocation: {
                        $concat: [
                            { $ifNull: ['$locationInfo.address', ''] },
                            { $cond: [{ $ifNull: ['$locationInfo.city', false] }, ', ', ''] },
                            { $ifNull: ['$locationInfo.city', ''] },
                            { $cond: [{ $ifNull: ['$locationInfo.state', false] }, ', ', ''] },
                            { $ifNull: ['$locationInfo.state', ''] },
                            { $cond: [{ $ifNull: ['$locationInfo.country', false] }, ', ', ''] },
                            { $ifNull: ['$locationInfo.country', ''] },
                            { $cond: [{ $ifNull: ['$locationInfo.pincode', false] }, ' - ', ''] },
                            { $ifNull: ['$locationInfo.pincode', ''] }
                        ]
                    }
                }
            },
            { $sort: { timestamp: -1 } }
        ]);

        // Format the response data
        const formattedInteractions = interactions.map(interaction => ({
            id: interaction._id,
            type: interaction.interactionType,
            entityType: interaction.interactionEntity,
            entityTitle: interaction.entityTitle,
            timestamp: interaction.timestamp,
            userName: interaction.user?.name || 'Unknown User',
            contactInfo: {
                phoneNumber: interaction.phoneNumber,
                email: interaction.email
            },
            location: {
                formatted: interaction.formattedLocation || '',
                details: {
                    address: interaction.locationInfo?.address || '',
                    city: interaction.locationInfo?.city || '',
                    state: interaction.locationInfo?.state || '',
                    country: interaction.locationInfo?.country || '',
                    pincode: interaction.locationInfo?.pincode || ''
                    // coordinates intentionally excluded as they're private
                }
            },
            metadata: {
                visitDuration: interaction.metadata?.visitDuration,
                visitType: interaction.metadata?.visitType,
                contactMethod: interaction.metadata?.contactMethod,
                contactStatus: interaction.metadata?.contactStatus,
                deviceInfo: interaction.metadata?.deviceInfo,
                city: interaction.metadata?.city,
                subLocality: interaction.metadata?.subLocality,
                locality: interaction.metadata?.locality
                // location.coordinates intentionally excluded as they're private
            }
        }));

        res.json({
            success: true,
            count: formattedInteractions.length,
            entityTitle: entityTitle,
            data: formattedInteractions
        });

    } catch (error) {
        console.error(`Error fetching ${req.params.entityType} interactions:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch ${req.params.entityType} interactions`,
            error: error.message
        });
    }
});



// Admin Contact Dashboard Endpoint for Profo dashboard
/**
 * GET /api/admin/contact-interactions
 * Fetch all contact interactions with populated references
 * Protected route - requires admin authentication
 */
router.get('/api/admin/contact-interactions', adminAuthenticate, async (req, res) => {
    try {
        console.log('Fetching contact interactions for admin dashboard');

        // Query parameters for pagination and filtering
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        // Build the base query for CONTACT interactions only
        let query = { interactionType: 'CONTACT' };

        // Fetch interactions with basic user population
        let interactions = await Interaction.find(query)
            .populate('userId', 'name email phone')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Process each interaction to get complete details
        const processedInteractions = await Promise.all(
            interactions.map(async (interaction) => {
                let targetDetails = null;
                let builderDetails = null;

                try {
                    // Handle different entity types
                    if (interaction.interactionEntity === 'PROPERTY' && interaction.propertyId) {
                        // Find property
                        const property = await Property.findOne({ post_id: interaction.propertyId }).lean();
                        if (property) {
                            targetDetails = {
                                id: property.post_id,
                                title: property.title || 'Untitled Property',
                                type: 'Property',
                                location: `${property.city || ''}, ${property.state || ''}`.trim().replace(/^,|,$/, ''),
                                price: property.price || null
                            };

                            // Get builder details if available
                            if (property.builder) {
                                const builder = await Builder.findById(property.builder).lean();
                                if (builder) {
                                    builderDetails = {
                                        id: builder._id,
                                        name: builder.name,
                                        company: builder.company,
                                        phone: builder.contacts?.[0] || null
                                    };
                                }
                            }
                        }
                    }
                    else if (interaction.interactionEntity === 'PROJECT' && interaction.projectId) {
                        // Find project
                        const project = await Project.findOne({ projectId: interaction.projectId }).lean();
                        if (project) {
                            targetDetails = {
                                id: project.projectId,
                                title: project.name || 'Untitled Project',
                                type: 'Project',
                                location: `${project.city || ''}, ${project.state || ''}`.trim().replace(/^,|,$/, ''),
                                price: project.priceRange || null
                            };

                            // Get builder details
                            if (project.builder) {
                                const builder = await Builder.findById(project.builder).lean();
                                if (builder) {
                                    builderDetails = {
                                        id: builder._id,
                                        name: builder.name,
                                        company: builder.company,
                                        phone: builder.contacts?.[0] || null
                                    };
                                }
                            }
                        }
                    }
                    else if (interaction.interactionEntity === 'BUILDING' && interaction.buildingId) {
                        // Find building
                        const building = await Building.findById(interaction.buildingId).lean();
                        if (building) {
                            targetDetails = {
                                id: building._id,
                                title: building.name || 'Untitled Building',
                                type: 'Building',
                                location: `${building.address?.city || ''}, ${building.address?.state || ''}`.trim().replace(/^,|,$/, ''),
                                price: null
                            };

                            // Get builder details
                            if (building.builder) {
                                const builder = await Builder.findById(building.builder).lean();
                                if (builder) {
                                    builderDetails = {
                                        id: builder._id,
                                        name: builder.name,
                                        company: builder.company,
                                        phone: builder.contacts?.[0] || null
                                    };
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing interaction ${interaction._id}:`, error);
                }

                return {
                    id: interaction._id,
                    user: interaction.userId ? {
                        id: interaction.userId._id,
                        name: interaction.userId.name || 'Unknown User',
                        email: interaction.userId.email || 'No Email',
                        phone: interaction.userId.phone || 'No Phone'
                    } : null,
                    builder: builderDetails,
                    target: targetDetails,
                    interactionType: interaction.interactionType,
                    interactionEntity: interaction.interactionEntity,
                    timestamp: interaction.timestamp,
                    phoneNumber: interaction.phoneNumber,
                    email: interaction.email,
                    location: {
                        city: interaction.locationInfo?.city || interaction.metadata?.city || 'Unknown',
                        state: interaction.locationInfo?.state || interaction.metadata?.state || 'Unknown'
                    },
                    metadata: interaction.metadata || {}
                };
            })
        );

        // Apply search filter if provided
        let filteredInteractions = processedInteractions;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredInteractions = processedInteractions.filter(interaction =>
                (interaction.user?.name?.toLowerCase().includes(searchLower)) ||
                (interaction.user?.email?.toLowerCase().includes(searchLower)) ||
                (interaction.builder?.name?.toLowerCase().includes(searchLower)) ||
                (interaction.builder?.company?.toLowerCase().includes(searchLower)) ||
                (interaction.target?.title?.toLowerCase().includes(searchLower))
            );
        }

        // Get total count for pagination
        const totalCount = await Interaction.countDocuments(query);

        console.log(`Found ${filteredInteractions.length} contact interactions`);

        res.status(200).json({
            success: true,
            data: filteredInteractions,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching contact interactions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact interactions',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/contact-interactions/stats
 * Get basic statistics for contact interactions
 */
router.get('/api/admin/contact-interactions/stats', adminAuthenticate, async (req, res) => {
    try {
        const totalContacts = await Interaction.countDocuments({ interactionType: 'CONTACT' });

        const entityStats = await Interaction.aggregate([
            { $match: { interactionType: 'CONTACT' } },
            { $group: { _id: '$interactionEntity', count: { $sum: 1 } } }
        ]);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayContacts = await Interaction.countDocuments({
            interactionType: 'CONTACT',
            timestamp: { $gte: todayStart }
        });

        res.status(200).json({
            success: true,
            data: {
                totalContacts,
                todayContacts,
                entityBreakdown: entityStats,
            }
        });

    } catch (error) {
        console.error('Error fetching contact interaction stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

// Add these new endpoints to your router file (Untitled (28))

/**
 * GET /api/admin/contact-interactions/detailed-metrics
 * Get detailed metrics for contact interactions including top users, properties, and trends
 */
router.get('/api/admin/contact-interactions/detailed-metrics', adminAuthenticate, async (req, res) => {
    try {
        const { period = 'day' } = req.query; // day, week, month

        // Calculate date ranges
        const now = new Date();
        const startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setDate(now.getDate() - 30);
                break;
            default: // day
                startDate.setHours(0, 0, 0, 0);
        }

        // Top Users (Most Active Callers)
        const topUsers = await Interaction.aggregate([
            {
                $match: {
                    interactionType: 'CONTACT',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    contactCount: { $sum: 1 },
                    lastContact: { $max: '$timestamp' }
                }
            },
            {
                $sort: { contactCount: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    userId: '$_id',
                    name: '$userDetails.name',
                    email: '$userDetails.email',
                    phone: '$userDetails.phone',
                    contactCount: 1,
                    lastContact: 1
                }
            }
        ]);

        // Top Properties/Projects (Most Contacted)
        const topProperties = await Interaction.aggregate([
            {
                $match: {
                    interactionType: 'CONTACT',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        entityId: {
                            $cond: [
                                { $eq: ['$interactionEntity', 'PROPERTY'] },
                                '$propertyId',
                                {
                                    $cond: [
                                        { $eq: ['$interactionEntity', 'PROJECT'] },
                                        '$projectId',
                                        '$buildingId'
                                    ]
                                }
                            ]
                        },
                        entityType: '$interactionEntity'
                    },
                    contactCount: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' },
                    lastContact: { $max: '$timestamp' }
                }
            },
            {
                $sort: { contactCount: -1 }
            },
            {
                $limit: 5
            }
        ]);

        // Fetch property/project details for top entities
        const enrichedTopProperties = await Promise.all(
            topProperties.map(async (item) => {
                let details = null;

                if (item._id.entityType === 'PROPERTY' && item._id.entityId) {
                    const property = await Property.findOne({ post_id: item._id.entityId[0] })
                        .populate('builder', 'name company')
                        .lean();
                    if (property) {
                        details = {
                            id: property.post_id,
                            title: property.post_title || 'Untitled Property',
                            type: 'Property',
                            location: `${property.city || ''}, ${property.locality || ''}`,
                            price: property.price,
                            builder: property.builder
                        };
                    }
                } else if (item._id.entityType === 'PROJECT' && item._id.entityId) {
                    const project = await Project.findOne({ projectId: item._id.entityId[0] })
                        .populate('builder', 'name company')
                        .lean();
                    if (project) {
                        details = {
                            id: project.projectId,
                            title: project.name || 'Untitled Project',
                            type: 'Project',
                            location: `${project.location?.city || ''}, ${project.location?.locality || ''}`,
                            priceRange: project.overview?.priceRange,
                            builder: project.builder
                        };
                    }
                }

                return {
                    ...item,
                    details,
                    uniqueUserCount: item.uniqueUsers.length
                };
            })
        );

        // Conversion Metrics
        const conversionMetrics = await Interaction.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    interactions: {
                        $push: {
                            type: '$interactionType',
                            entityId: {
                                $cond: [
                                    { $eq: ['$interactionEntity', 'PROPERTY'] },
                                    '$propertyId',
                                    {
                                        $cond: [
                                            { $eq: ['$interactionEntity', 'PROJECT'] },
                                            '$projectId',
                                            '$buildingId'
                                        ]
                                    }
                                ]
                            },
                            timestamp: '$timestamp'
                        }
                    }
                }
            },
            {
                $project: {
                    hasViewed: {
                        $in: ['VISIT', '$interactions.type']
                    },
                    hasContacted: {
                        $in: ['CONTACT', '$interactions.type']
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    viewedAndContacted: {
                        $sum: {
                            $cond: [
                                { $and: ['$hasViewed', '$hasContacted'] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // Time-based trends
        const hourlyTrends = await Interaction.aggregate([
            {
                $match: {
                    interactionType: 'CONTACT',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $hour: '$timestamp' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Location-based insights
        const locationInsights = await Interaction.aggregate([
            {
                $match: {
                    interactionType: 'CONTACT',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        city: { $ifNull: ['$locationInfo.city', '$metadata.city', 'Unknown'] }
                    },
                    count: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    city: '$_id.city',
                    count: 1,
                    uniqueUserCount: { $size: '$uniqueUsers' }
                }
            }
        ]);

        // Response time analysis (if you track contact duration)
        const responseMetrics = await Interaction.aggregate([
            {
                $match: {
                    interactionType: 'CONTACT',
                    'metadata.contactStatus': { $exists: true },
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$metadata.contactStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Builder performance
        const builderPerformance = await Interaction.aggregate([
            {
                $match: {
                    interactionType: 'CONTACT',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    let: { propId: '$propertyId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$post_id', { $arrayElemAt: ['$$propId', 0] }] } } }
                    ],
                    as: 'property'
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    let: { projId: '$projectId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$projectId', { $arrayElemAt: ['$$projId', 0] }] } } }
                    ],
                    as: 'project'
                }
            },
            {
                $addFields: {
                    builderId: {
                        $cond: [
                            { $gt: [{ $size: '$property' }, 0] },
                            { $arrayElemAt: ['$property.builder', 0] },
                            { $arrayElemAt: ['$project.builder', 0] }
                        ]
                    }
                }
            },
            {
                $match: { builderId: { $ne: null } }
            },
            {
                $group: {
                    _id: '$builderId',
                    contactCount: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' }
                }
            },
            {
                $sort: { contactCount: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'builders',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'builderDetails'
                }
            },
            {
                $unwind: '$builderDetails'
            },
            {
                $project: {
                    builderId: '$_id',
                    name: '$builderDetails.name',
                    company: '$builderDetails.company',
                    contactCount: 1,
                    uniqueUserCount: { $size: '$uniqueUsers' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                period,
                topUsers,
                topProperties: enrichedTopProperties,
                conversionMetrics: conversionMetrics[0] || { totalUsers: 0, viewedAndContacted: 0 },
                hourlyTrends,
                locationInsights,
                responseMetrics,
                builderPerformance
            }
        });

    } catch (error) {
        console.error('Error fetching detailed metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch detailed metrics',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/contact-interactions/revenue-insights
 * Get revenue-related insights from contact interactions
 */
router.get('/api/admin/contact-interactions/revenue-insights', adminAuthenticate, async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        const now = new Date();
        const startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setDate(now.getDate() - 30);
                break;
            case 'quarter':
                startDate.setDate(now.getDate() - 90);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }

        // High-value properties analysis
        const highValueProperties = await Interaction.aggregate([
            {
                $match: {
                    interactionType: 'CONTACT',
                    interactionEntity: 'PROPERTY',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    let: { propId: '$propertyId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$post_id', { $arrayElemAt: ['$$propId', 0] }] } } }
                    ],
                    as: 'property'
                }
            },
            {
                $unwind: '$property'
            },
            {
                $group: {
                    _id: '$property.post_id',
                    propertyDetails: { $first: '$property' },
                    contactCount: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' }
                }
            },
            {
                $project: {
                    propertyId: '$_id',
                    title: '$propertyDetails.post_title',
                    price: '$propertyDetails.price',
                    contactCount: 1,
                    uniqueUserCount: { $size: '$uniqueUsers' },
                    potentialRevenue: {
                        $multiply: [
                            '$propertyDetails.price',
                            0.02 // Assuming 2% commission
                        ]
                    }
                }
            },
            {
                $sort: { potentialRevenue: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // User engagement quality score
        const userQualityScores = await Interaction.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    totalInteractions: { $sum: 1 },
                    contactCount: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    },
                    viewCount: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
                    },
                    uniqueProperties: { $addToSet: '$propertyId' },
                    lastActivity: { $max: '$timestamp' }
                }
            },
            {
                $project: {
                    userId: '$_id',
                    engagementScore: {
                        $add: [
                            { $multiply: ['$contactCount', 10] }, // Contacts are worth more
                            { $multiply: ['$viewCount', 2] },
                            { $size: '$uniqueProperties' } // Diversity of interest
                        ]
                    },
                    totalInteractions: 1,
                    contactCount: 1,
                    lastActivity: 1
                }
            },
            {
                $sort: { engagementScore: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                period,
                highValueProperties,
                userQualityScores,
                totalPotentialRevenue: highValueProperties.reduce((sum, prop) => sum + (prop.potentialRevenue || 0), 0)
            }
        });

    } catch (error) {
        console.error('Error fetching revenue insights:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue insights',
            error: error.message
        });
    }
});


// Add these new endpoints to your Express router file

/**
 * GET /api/admin/contact-interactions/buyer-propensity
 * Calculate buyer propensity scores based on user behavior patterns
 */
router.get('/api/admin/contact-interactions/buyer-propensity', adminAuthenticate, async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        // Calculate buyer propensity based on multiple behavioral factors
        const buyerPropensity = await Interaction.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalInteractions: { $sum: 1 },
                    contactCount: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    },
                    viewCount: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
                    },
                    saveCount: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
                    },
                    uniqueProperties: { $addToSet: '$propertyId' },
                    uniqueProjects: { $addToSet: '$projectId' },
                    firstInteraction: { $min: '$timestamp' },
                    lastInteraction: { $max: '$timestamp' },
                    interactionDates: { $push: '$timestamp' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    userId: '$_id',
                    userInfo: {
                        name: '$userDetails.name',
                        email: '$userDetails.email',
                        phone: '$userDetails.phone',
                        isPhoneVerified: '$userDetails.isPhoneVerified'
                    },
                    metrics: {
                        totalInteractions: 1,
                        contactCount: 1,
                        viewCount: 1,
                        saveCount: 1,
                        propertyDiversity: { $size: '$uniqueProperties' },
                        projectDiversity: { $size: '$uniqueProjects' },
                        engagementDays: {
                            $dateDiff: {
                                startDate: '$firstInteraction',
                                endDate: '$lastInteraction',
                                unit: 'day'
                            }
                        }
                    },
                    // Calculate buying signals
                    buyingSignals: {
                        hasContacted: { $gt: ['$contactCount', 0] },
                        hasSaved: { $gt: ['$saveCount', 0] },
                        multipleContacts: { $gte: ['$contactCount', 2] },
                        recentActivity: {
                            $gte: [
                                '$lastInteraction',
                                { $subtract: [new Date(), 7 * 24 * 60 * 60 * 1000] } // Last 7 days
                            ]
                        },
                        highEngagement: { $gte: ['$totalInteractions', 5] },
                        repeatVisitor: { $gte: ['$engagementDays', 2] }
                    },
                    interactionPattern: '$interactionDates'
                }
            },
            {
                $addFields: {
                    // Calculate propensity score (0-100)
                    propensityScore: {
                        $multiply: [
                            100,
                            {
                                $divide: [
                                    {
                                        $add: [
                                            { $cond: ['$buyingSignals.hasContacted', 25, 0] },
                                            { $cond: ['$buyingSignals.hasSaved', 15, 0] },
                                            { $cond: ['$buyingSignals.multipleContacts', 20, 0] },
                                            { $cond: ['$buyingSignals.recentActivity', 15, 0] },
                                            { $cond: ['$buyingSignals.highEngagement', 15, 0] },
                                            { $cond: ['$buyingSignals.repeatVisitor', 10, 0] }
                                        ]
                                    },
                                    100
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $sort: { propensityScore: -1 }
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        // Analyze interaction patterns for each high-propensity user
        const enrichedBuyers = await Promise.all(
            buyerPropensity.map(async (buyer) => {
                // Get recent properties/projects they've interacted with
                const recentInteractions = await Interaction.find({
                    userId: buyer.userId,
                    timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                })
                    .sort({ timestamp: -1 })
                    .limit(5)
                    .lean();

                // Fetch property details
                const propertyDetails = await Promise.all(
                    recentInteractions
                        .filter(i => i.propertyId && i.propertyId.length > 0)
                        .map(async (interaction) => {
                            const property = await Property.findOne({ post_id: interaction.propertyId[0] })
                                .select('post_title price city locality')
                                .lean();
                            return property;
                        })
                );

                return {
                    ...buyer,
                    recentProperties: propertyDetails.filter(p => p),
                    lastActivityDaysAgo: Math.floor(
                        (new Date() - new Date(buyer.metrics.lastInteraction)) / (1000 * 60 * 60 * 24)
                    )
                };
            })
        );

        res.status(200).json({
            success: true,
            data: enrichedBuyers
        });

    } catch (error) {
        console.error('Error calculating buyer propensity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate buyer propensity',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/contact-interactions/property-performance
 * Analyze property performance and predict likelihood of sale
 */
router.get('/api/admin/contact-interactions/property-performance', adminAuthenticate, async (req, res) => {
    try {
        const { period = 30 } = req.query; // Days to analyze
        const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        // Analyze property performance
        const propertyPerformance = await Interaction.aggregate([
            {
                $match: {
                    interactionEntity: 'PROPERTY',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $arrayElemAt: ['$propertyId', 0] },
                    totalViews: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
                    },
                    totalContacts: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    },
                    totalSaves: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
                    },
                    uniqueUsers: { $addToSet: '$userId' },
                    firstInteraction: { $min: '$timestamp' },
                    lastInteraction: { $max: '$timestamp' },
                    interactionsByDay: {
                        $push: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                            type: '$interactionType'
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    let: { propId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$post_id', '$$propId'] } } }
                    ],
                    as: 'propertyDetails'
                }
            },
            {
                $unwind: {
                    path: '$propertyDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    propertyId: '$_id',
                    propertyInfo: {
                        title: '$propertyDetails.post_title',
                        price: '$propertyDetails.price',
                        location: { $concat: ['$propertyDetails.city', ', ', '$propertyDetails.locality'] },
                        bedrooms: '$propertyDetails.bedrooms',
                        area: '$propertyDetails.area',
                        createdAt: '$propertyDetails.createdAt'
                    },
                    metrics: {
                        totalViews: 1,
                        totalContacts: 1,
                        totalSaves: 1,
                        uniqueUserCount: { $size: '$uniqueUsers' },
                        conversionRate: {
                            $cond: [
                                { $gt: ['$totalViews', 0] },
                                { $multiply: [{ $divide: ['$totalContacts', '$totalViews'] }, 100] },
                                0
                            ]
                        },
                        engagementScore: {
                            $add: [
                                '$totalViews',
                                { $multiply: ['$totalContacts', 5] },
                                { $multiply: ['$totalSaves', 3] }
                            ]
                        },
                        daysOnMarket: {
                            $dateDiff: {
                                startDate: '$propertyDetails.createdAt',
                                endDate: new Date(),
                                unit: 'day'
                            }
                        },
                        daysSinceFirstView: {
                            $dateDiff: {
                                startDate: '$firstInteraction',
                                endDate: new Date(),
                                unit: 'day'
                            }
                        },
                        daysSinceLastActivity: {
                            $dateDiff: {
                                startDate: '$lastInteraction',
                                endDate: new Date(),
                                unit: 'day'
                            }
                        }
                    },
                    interactionTrend: '$interactionsByDay'
                }
            },
            {
                $addFields: {
                    // Calculate sale likelihood score (0-100)
                    saleLikelihoodScore: {
                        $multiply: [
                            100,
                            {
                                $divide: [
                                    {
                                        $add: [
                                            // High contact rate (30 points)
                                            {
                                                $cond: [
                                                    { $gte: ['$metrics.conversionRate', 10] },
                                                    30,
                                                    { $multiply: ['$metrics.conversionRate', 3] }
                                                ]
                                            },
                                            // Multiple interested users (20 points)
                                            {
                                                $cond: [
                                                    { $gte: ['$metrics.uniqueUserCount', 5] },
                                                    20,
                                                    { $multiply: ['$metrics.uniqueUserCount', 4] }
                                                ]
                                            },
                                            // Recent activity (20 points)
                                            {
                                                $cond: [
                                                    { $lte: ['$metrics.daysSinceLastActivity', 7] },
                                                    20,
                                                    {
                                                        $cond: [
                                                            { $lte: ['$metrics.daysSinceLastActivity', 14] },
                                                            10,
                                                            0
                                                        ]
                                                    }
                                                ]
                                            },
                                            // Saves indicate serious interest (15 points)
                                            {
                                                $cond: [
                                                    { $gte: ['$metrics.totalSaves', 3] },
                                                    15,
                                                    { $multiply: ['$metrics.totalSaves', 5] }
                                                ]
                                            },
                                            // Reasonable time on market (15 points)
                                            {
                                                $cond: [
                                                    {
                                                        $and: [
                                                            { $gte: ['$metrics.daysOnMarket', 7] },
                                                            { $lte: ['$metrics.daysOnMarket', 60] }
                                                        ]
                                                    },
                                                    15,
                                                    5
                                                ]
                                            }
                                        ]
                                    },
                                    100
                                ]
                            }
                        ]
                    },
                    performanceCategory: {
                        $switch: {
                            branches: [
                                { case: { $gte: ['$metrics.engagementScore', 50] }, then: 'High Performer' },
                                { case: { $gte: ['$metrics.engagementScore', 20] }, then: 'Average Performer' },
                                { case: { $gte: ['$metrics.engagementScore', 5] }, then: 'Low Performer' }
                            ],
                            default: 'Very Low Performer'
                        }
                    }
                }
            },
            {
                $sort: { saleLikelihoodScore: -1 }
            }
        ]);

        // Separate into categories
        // const highLikelihood = propertyPerformance.filter(p => p.saleLikelihoodScore >= 70);
        // const mediumLikelihood = propertyPerformance.filter(p => p.saleLikelihoodScore >= 40 && p.saleLikelihoodScore < 70);
        // const lowPerformers = propertyPerformance.filter(p => p.metrics.engagementScore < 5);

        const highLikelihood = propertyPerformance.filter(p => p.saleLikelihoodScore >= 0);
        const mediumLikelihood = propertyPerformance.filter(p => p.saleLikelihoodScore >= 0 && p.saleLikelihoodScore < 70);
        const lowPerformers = propertyPerformance.filter(p => p.metrics.engagementScore > 5);

        res.status(200).json({
            success: true,
            data: {
                highLikelihoodProperties: highLikelihood.slice(0, 10),
                mediumLikelihoodProperties: mediumLikelihood.slice(0, 10),
                lowPerformingProperties: lowPerformers.slice(0, 10),
                summary: {
                    totalAnalyzed: propertyPerformance.length,
                    highLikelihoodCount: highLikelihood.length,
                    averageConversionRate: propertyPerformance.reduce((sum, p) => sum + p.metrics.conversionRate, 0) / propertyPerformance.length || 0
                }
            }
        });

    } catch (error) {
        console.error('Error analyzing property performance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze property performance',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/contact-interactions/calendar-view
 * Get calendar view of interactions for better scheduling and follow-ups
 */
router.get('/api/admin/contact-interactions/calendar-view', adminAuthenticate, async (req, res) => {
    try {
        const { month, year } = req.query;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get daily interaction counts
        const calendarData = await Interaction.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                        type: '$interactionType'
                    },
                    count: { $sum: 1 },
                    users: { $addToSet: '$userId' }
                }
            },
            {
                $group: {
                    _id: '$_id.date',
                    interactions: {
                        $push: {
                            type: '$_id.type',
                            count: '$count',
                            uniqueUsers: { $size: '$users' }
                        }
                    },
                    totalCount: { $sum: '$count' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get scheduled callbacks or follow-ups for the month
        const scheduledFollowups = await Interaction.aggregate([
            {
                $match: {
                    interactionType: 'CALLBACK',
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    time: { $dateToString: { format: '%H:%M', date: '$timestamp' } },
                    userName: '$user.name',
                    userPhone: '$user.phone',
                    propertyId: 1,
                    notes: '$metadata.notes'
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                dailyInteractions: calendarData,
                scheduledFollowups,
                summary: {
                    totalInteractions: calendarData.reduce((sum, day) => sum + day.totalCount, 0),
                    averagePerDay: calendarData.length > 0 ?
                        calendarData.reduce((sum, day) => sum + day.totalCount, 0) / calendarData.length : 0
                }
            }
        });

    } catch (error) {
        console.error('Error fetching calendar view:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch calendar view',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/contact-interactions/predictive-insights
 * Advanced predictive analytics combining multiple data points
 */
router.get('/api/admin/contact-interactions/predictive-insights', adminAuthenticate, async (req, res) => {
    try {
        // Market momentum analysis
        const marketMomentum = await Interaction.aggregate([
            {
                $match: {
                    timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: {
                        week: { $week: '$timestamp' },
                        year: { $year: '$timestamp' }
                    },
                    interactions: { $sum: 1 },
                    contacts: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.week': 1 }
            }
        ]);

        // Price sensitivity analysis
        const priceSensitivity = await Interaction.aggregate([
            {
                $match: {
                    interactionEntity: 'PROPERTY',
                    timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    let: { propId: { $arrayElemAt: ['$propertyId', 0] } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$post_id', '$$propId'] } } }
                    ],
                    as: 'property'
                }
            },
            {
                $unwind: '$property'
            },
            {
                $group: {
                    _id: {
                        priceRange: {
                            $switch: {
                                branches: [
                                    { case: { $lte: ['$property.price', 2500000] }, then: 'Under 25L' },
                                    { case: { $lte: ['$property.price', 5000000] }, then: '25L-50L' },
                                    { case: { $lte: ['$property.price', 10000000] }, then: '50L-1Cr' },
                                    { case: { $gt: ['$property.price', 10000000] }, then: 'Above 1Cr' }
                                ],
                                default: 'Unknown'
                            }
                        }
                    },
                    totalInteractions: { $sum: 1 },
                    contacts: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    },
                    conversionRate: {
                        $avg: {
                            $cond: [
                                { $eq: ['$interactionType', 'CONTACT'] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                marketMomentum,
                priceSensitivity,
                insights: {
                    trendDirection: marketMomentum.length > 1 ?
                        (marketMomentum[marketMomentum.length - 1].interactions > marketMomentum[0].interactions ? 'Upward' : 'Downward') : 'Stable',
                    mostActivePriceRange: priceSensitivity.reduce((max, range) =>
                        range.totalInteractions > (max?.totalInteractions || 0) ? range : max, null
                    )?._id.priceRange || 'Unknown'
                }
            }
        });

    } catch (error) {
        console.error('Error generating predictive insights:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate predictive insights',
            error: error.message
        });
    }
});


// Add these additional endpoints to your Express router file

/**
 * GET /api/admin/contact-interactions/daily-details
 * Get detailed interactions for a specific date when clicking calendar day
 */
router.get('/api/admin/contact-interactions/daily-details', adminAuthenticate, async (req, res) => {
    try {
        const { date } = req.query; // Format: YYYY-MM-DD

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required'
            });
        }

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Get all interactions for the specific date
        const dayInteractions = await Interaction.find({
            timestamp: { $gte: startDate, $lte: endDate }
        })
            .populate('userId', 'name email phone')
            .sort({ timestamp: -1 })
            .lean();

        // Process interactions with property/project details
        const detailedInteractions = await Promise.all(
            dayInteractions.map(async (interaction) => {
                let targetDetails = null;

                if (interaction.interactionEntity === 'PROPERTY' && interaction.propertyId?.length > 0) {
                    const property = await Property.findOne({ post_id: interaction.propertyId[0] })
                        .populate('builder', 'name company contacts')
                        .lean();

                    if (property) {
                        targetDetails = {
                            type: 'Property',
                            id: property.post_id,
                            title: property.post_title,
                            price: property.price,
                            location: `${property.city || ''}, ${property.locality || ''}`,
                            builder: property.builder
                        };
                    }
                } else if (interaction.interactionEntity === 'PROJECT' && interaction.projectId?.length > 0) {
                    const project = await Project.findOne({ projectId: interaction.projectId[0] })
                        .populate('builder', 'name company contacts')
                        .lean();

                    if (project) {
                        targetDetails = {
                            type: 'Project',
                            id: project.projectId,
                            title: project.name,
                            priceRange: project.overview?.priceRange,
                            location: `${project.location?.city || ''}, ${project.location?.locality || ''}`,
                            builder: project.builder
                        };
                    }
                }

                return {
                    ...interaction,
                    targetDetails,
                    formattedTime: new Date(interaction.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
            })
        );

        // Group by interaction type
        const groupedByType = detailedInteractions.reduce((acc, interaction) => {
            const type = interaction.interactionType;
            if (!acc[type]) acc[type] = [];
            acc[type].push(interaction);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                date,
                totalInteractions: detailedInteractions.length,
                interactions: detailedInteractions,
                groupedByType,
                summary: {
                    contacts: groupedByType.CONTACT?.length || 0,
                    visits: groupedByType.VISIT?.length || 0,
                    saves: groupedByType.SAVE?.length || 0
                }
            }
        });

    } catch (error) {
        console.error('Error fetching daily details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch daily details',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/contact-interactions/property-details/:propertyId
 * Get detailed property information when clicked
 */
router.get('/api/admin/contact-interactions/property-details/:propertyId', adminAuthenticate, async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { period = 30 } = req.query;

        const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        // Get property details
        const property = await Property.findOne({ post_id: propertyId })
            .populate('builder', 'name company contacts')
            .lean();

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Get interaction analytics for this property
        const analytics = await Interaction.aggregate([
            {
                $match: {
                    propertyId: [propertyId],
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
                    },
                    totalContacts: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    },
                    totalSaves: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
                    },
                    uniqueUsers: { $addToSet: '$userId' },
                    dailyInteractions: {
                        $push: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                            type: '$interactionType'
                        }
                    }
                }
            }
        ]);

        // Get recent users who interacted
        const recentUsers = await Interaction.find({
            propertyId: [propertyId],
            timestamp: { $gte: startDate }
        })
            .populate('userId', 'name email phone')
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        // Calculate daily trend
        const dailyTrend = {};
        if (analytics[0]?.dailyInteractions) {
            analytics[0].dailyInteractions.forEach(interaction => {
                if (!dailyTrend[interaction.date]) {
                    dailyTrend[interaction.date] = { views: 0, contacts: 0, saves: 0 };
                }
                if (interaction.type === 'VISIT') dailyTrend[interaction.date].views++;
                else if (interaction.type === 'CONTACT') dailyTrend[interaction.date].contacts++;
                else if (interaction.type === 'SAVE') dailyTrend[interaction.date].saves++;
            });
        }

        res.status(200).json({
            success: true,
            data: {
                property: {
                    ...property,
                    analytics: analytics[0] || {
                        totalViews: 0,
                        totalContacts: 0,
                        totalSaves: 0,
                        uniqueUsers: []
                    },
                    uniqueUserCount: analytics[0]?.uniqueUsers?.length || 0,
                    conversionRate: analytics[0]?.totalViews > 0
                        ? ((analytics[0].totalContacts / analytics[0].totalViews) * 100).toFixed(2)
                        : 0
                },
                recentUsers,
                dailyTrend: Object.entries(dailyTrend).map(([date, data]) => ({
                    date,
                    ...data
                })).sort((a, b) => new Date(a.date) - new Date(b.date))
            }
        });

    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch property details',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/contact-interactions/commission-simulator
 * Calculate potential commission based on current pipeline
 */
router.get('/api/admin/contact-interactions/commission-simulator', adminAuthenticate, async (req, res) => {
    try {
        const { period = 30, commissionRate = 0.01 } = req.query; // 1% default commission

        const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        // Get all properties with recent contact interactions
        const contactedProperties = await Interaction.aggregate([
            {
                $match: {
                    interactionType: 'CONTACT',
                    interactionEntity: 'PROPERTY',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $arrayElemAt: ['$propertyId', 0] },
                    contactCount: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' },
                    lastContact: { $max: '$timestamp' }
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    let: { propId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$post_id', '$$propId'] } } }
                    ],
                    as: 'property'
                }
            },
            {
                $unwind: '$property'
            },
            {
                $project: {
                    propertyId: '$_id',
                    propertyTitle: '$property.post_title',
                    propertyPrice: '$property.price',
                    contactCount: 1,
                    uniqueUserCount: { $size: '$uniqueUsers' },
                    lastContact: 1,
                    potentialCommission: { $multiply: ['$property.price', parseFloat(commissionRate)] }
                }
            },
            {
                $sort: { contactCount: -1 }
            }
        ]);

        // Calculate probability scores based on engagement
        const pipelineWithProbability = contactedProperties.map(prop => {
            // Simple probability calculation based on contacts and unique users
            let probability = 0;

            if (prop.contactCount >= 5) probability += 30;
            else if (prop.contactCount >= 3) probability += 20;
            else if (prop.contactCount >= 1) probability += 10;

            if (prop.uniqueUserCount >= 3) probability += 30;
            else if (prop.uniqueUserCount >= 2) probability += 20;
            else if (prop.uniqueUserCount >= 1) probability += 10;

            // Recent activity bonus
            const daysSinceLastContact = Math.floor((new Date() - new Date(prop.lastContact)) / (1000 * 60 * 60 * 24));
            if (daysSinceLastContact <= 3) probability += 20;
            else if (daysSinceLastContact <= 7) probability += 10;
            else if (daysSinceLastContact <= 14) probability += 5;

            // Cap at 90% max
            probability = Math.min(probability, 90);

            return {
                ...prop,
                probability,
                expectedCommission: (prop.potentialCommission * probability) / 100
            };
        });

        // Group by probability ranges
        const probabilityRanges = {
            high: pipelineWithProbability.filter(p => p.probability >= 70),
            medium: pipelineWithProbability.filter(p => p.probability >= 40 && p.probability < 70),
            low: pipelineWithProbability.filter(p => p.probability < 40)
        };

        // Calculate totals
        const totals = {
            totalProperties: pipelineWithProbability.length,
            totalPotentialCommission: pipelineWithProbability.reduce((sum, p) => sum + p.potentialCommission, 0),
            totalExpectedCommission: pipelineWithProbability.reduce((sum, p) => sum + p.expectedCommission, 0),
            highProbabilityCommission: probabilityRanges.high.reduce((sum, p) => sum + p.expectedCommission, 0),
            mediumProbabilityCommission: probabilityRanges.medium.reduce((sum, p) => sum + p.expectedCommission, 0),
            lowProbabilityCommission: probabilityRanges.low.reduce((sum, p) => sum + p.expectedCommission, 0)
        };

        // Monthly projection
        const dailyAverage = totals.totalExpectedCommission / period;
        const monthlyProjection = dailyAverage * 30;
        const yearlyProjection = monthlyProjection * 12;

        res.status(200).json({
            success: true,
            data: {
                pipeline: pipelineWithProbability.slice(0, 20), // Top 20 properties
                probabilityRanges,
                totals,
                projections: {
                    daily: dailyAverage,
                    monthly: monthlyProjection,
                    yearly: yearlyProjection
                },
                commissionRate: parseFloat(commissionRate) * 100 // Return as percentage
            }
        });

    } catch (error) {
        console.error('Error calculating commission simulator:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate commission simulator',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/contact-interactions/user-journey/:userId
 * Get complete user journey and interaction history
 */
router.get('/api/admin/contact-interactions/user-journey/:userId', adminAuthenticate, async (req, res) => {
    try {
        const { userId } = req.params;

        // Get user details
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get all interactions
        const interactions = await Interaction.find({ userId })
            .sort({ timestamp: 1 })
            .lean();

        // Process interactions with property/project details
        const journey = await Promise.all(
            interactions.map(async (interaction) => {
                let targetDetails = null;

                if (interaction.interactionEntity === 'PROPERTY' && interaction.propertyId?.length > 0) {
                    const property = await Property.findOne({ post_id: interaction.propertyId[0] })
                        .select('post_title price city locality')
                        .lean();

                    if (property) {
                        targetDetails = {
                            type: 'Property',
                            title: property.post_title,
                            price: property.price,
                            location: `${property.city || ''}, ${property.locality || ''}`
                        };
                    }
                } else if (interaction.interactionEntity === 'PROJECT' && interaction.projectId?.length > 0) {
                    const project = await Project.findOne({ projectId: interaction.projectId[0] })
                        .select('name overview.priceRange location.city')
                        .lean();

                    if (project) {
                        targetDetails = {
                            type: 'Project',
                            title: project.name,
                            priceRange: project.overview?.priceRange,
                            location: project.location?.city
                        };
                    }
                }

                return {
                    ...interaction,
                    targetDetails,
                    daysSinceStart: Math.floor(
                        (new Date(interaction.timestamp) - new Date(interactions[0].timestamp)) / (1000 * 60 * 60 * 24)
                    )
                };
            })
        );

        // Calculate journey metrics
        const metrics = {
            totalInteractions: journey.length,
            totalProperties: new Set(journey.filter(j => j.propertyId).map(j => j.propertyId[0])).size,
            totalProjects: new Set(journey.filter(j => j.projectId).map(j => j.projectId[0])).size,
            journeyDuration: Math.floor(
                (new Date() - new Date(journey[0]?.timestamp || new Date())) / (1000 * 60 * 60 * 24)
            ),
            contactsMade: journey.filter(j => j.interactionType === 'CONTACT').length,
            propertiesSaved: journey.filter(j => j.interactionType === 'SAVE').length
        };

        res.status(200).json({
            success: true,
            data: {
                user,
                journey,
                metrics
            }
        });

    } catch (error) {
        console.error('Error fetching user journey:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user journey',
            error: error.message
        });
    }
});

// Add these new endpoints to your Express router file

// /**
//  * GET /api/admin/funnel-analytics/conversion-pipeline
//  * Get conversion funnel data showing user journey from visit to contact
//  */
// router.get('/api/admin/funnel-analytics/conversion-pipeline', adminAuthenticate, async (req, res) => {
//     try {
//         const { period = 30 } = req.query;
//         const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

//         // Get all user journeys
//         const userJourneys = await Interaction.aggregate([
//             {
//                 $match: {
//                     timestamp: { $gte: startDate }
//                 }
//             },
//             {
//                 $sort: { timestamp: 1 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         userId: '$userId',
//                         propertyId: { $arrayElemAt: ['$propertyId', 0] }
//                     },
//                     interactions: {
//                         $push: {
//                             type: '$interactionType',
//                             timestamp: '$timestamp'
//                         }
//                     },
//                     firstInteraction: { $first: '$interactionType' },
//                     hasVisit: {
//                         $max: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
//                     },
//                     hasSave: {
//                         $max: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
//                     },
//                     hasContact: {
//                         $max: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     userId: '$_id.userId',
//                     propertyId: '$_id.propertyId',
//                     interactions: 1,
//                     firstInteraction: 1,
//                     journeyPath: {
//                         $cond: [
//                             { $eq: ['$hasContact', 1] },
//                             {
//                                 $cond: [
//                                     { $eq: ['$hasSave', 1] },
//                                     'VISIT_SAVE_CONTACT',
//                                     'VISIT_CONTACT'
//                                 ]
//                             },
//                             {
//                                 $cond: [
//                                     { $eq: ['$hasSave', 1] },
//                                     'VISIT_SAVE_ONLY',
//                                     'VISIT_ONLY'
//                                 ]
//                             }
//                         ]
//                     },
//                     hasVisit: 1,
//                     hasSave: 1,
//                     hasContact: 1
//                 }
//             }
//         ]);

//         // Calculate funnel metrics
//         const funnelMetrics = {
//             totalVisitors: userJourneys.filter(j => j.hasVisit).length,
//             visitToSave: userJourneys.filter(j => j.hasVisit && j.hasSave).length,
//             saveToContact: userJourneys.filter(j => j.hasSave && j.hasContact).length,
//             visitToContact: userJourneys.filter(j => j.hasVisit && j.hasContact).length,
//             directContact: userJourneys.filter(j => j.firstInteraction === 'CONTACT').length
//         };

//         // Path analysis
//         const pathAnalysis = userJourneys.reduce((acc, journey) => {
//             if (!acc[journey.journeyPath]) {
//                 acc[journey.journeyPath] = 0;
//             }
//             acc[journey.journeyPath]++;
//             return acc;
//         }, {});

//         // Drop-off analysis
//         const dropOffAnalysis = {
//             afterVisit: userJourneys.filter(j => j.hasVisit && !j.hasSave && !j.hasContact).length,
//             afterSave: userJourneys.filter(j => j.hasSave && !j.hasContact).length,
//             completed: userJourneys.filter(j => j.hasContact).length
//         };

//         res.status(200).json({
//             success: true,
//             data: {
//                 funnelMetrics,
//                 pathAnalysis,
//                 dropOffAnalysis,
//                 conversionRates: {
//                     visitToSave: funnelMetrics.totalVisitors > 0
//                         ? ((funnelMetrics.visitToSave / funnelMetrics.totalVisitors) * 100).toFixed(2)
//                         : 0,
//                     saveToContact: funnelMetrics.visitToSave > 0
//                         ? ((funnelMetrics.saveToContact / funnelMetrics.visitToSave) * 100).toFixed(2)
//                         : 0,
//                     overallConversion: funnelMetrics.totalVisitors > 0
//                         ? ((funnelMetrics.visitToContact / funnelMetrics.totalVisitors) * 100).toFixed(2)
//                         : 0
//                 },
//                 totalJourneys: userJourneys.length
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching conversion pipeline:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch conversion pipeline',
//             error: error.message
//         });
//     }
// });

// /**
//  * GET /api/admin/funnel-analytics/user-intent-analysis
//  * Analyze user intent based on interaction patterns
//  */
// router.get('/api/admin/funnel-analytics/user-intent-analysis', adminAuthenticate, async (req, res) => {
//     try {
//         const { period = 30 } = req.query;
//         const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

//         // Analyze user behavior patterns
//         const intentAnalysis = await Interaction.aggregate([
//             {
//                 $match: {
//                     timestamp: { $gte: startDate }
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$userId',
//                     totalInteractions: { $sum: 1 },
//                     uniqueProperties: { $addToSet: { $arrayElemAt: ['$propertyId', 0] } },
//                     interactionTypes: { $push: '$interactionType' },
//                     contactCount: {
//                         $sum: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
//                     },
//                     saveCount: {
//                         $sum: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
//                     },
//                     visitCount: {
//                         $sum: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
//                     },
//                     firstInteraction: { $min: '$timestamp' },
//                     lastInteraction: { $max: '$timestamp' }
//                 }
//             },
//             {
//                 $project: {
//                     userId: '$_id',
//                     metrics: {
//                         totalInteractions: '$totalInteractions',
//                         propertyCount: { $size: '$uniqueProperties' },
//                         contactCount: '$contactCount',
//                         saveCount: '$saveCount',
//                         visitCount: '$visitCount',
//                         daysActive: {
//                             $divide: [
//                                 { $subtract: ['$lastInteraction', '$firstInteraction'] },
//                                 1000 * 60 * 60 * 24
//                             ]
//                         }
//                     },
//                     // Categorize intent based on behavior
//                     intent: {
//                         $switch: {
//                             branches: [
//                                 // High Intent - Multiple contacts, saves, focused search
//                                 {
//                                     case: {
//                                         $and: [
//                                             { $gte: ['$contactCount', 2] },
//                                             { $gte: ['$saveCount', 1] },
//                                             { $lte: [{ $size: '$uniqueProperties' }, 5] }
//                                         ]
//                                     },
//                                     then: 'HIGH_INTENT_BUYER'
//                                 },
//                                 // Medium Intent - Some engagement, exploring options
//                                 {
//                                     case: {
//                                         $and: [
//                                             { $gte: ['$contactCount', 1] },
//                                             { $gte: ['$totalInteractions', 5] }
//                                         ]
//                                     },
//                                     then: 'ACTIVE_SEARCHER'
//                                 },
//                                 // Comparison Shopper - Many properties, few contacts
//                                 {
//                                     case: {
//                                         $and: [
//                                             { $gte: [{ $size: '$uniqueProperties' }, 10] },
//                                             { $lte: ['$contactCount', 1] }
//                                         ]
//                                     },
//                                     then: 'COMPARISON_SHOPPER'
//                                 },
//                                 // Window Shopper - High visits, no serious engagement
//                                 {
//                                     case: {
//                                         $and: [
//                                             { $gte: ['$visitCount', 10] },
//                                             { $eq: ['$contactCount', 0] },
//                                             { $lte: ['$saveCount', 2] }
//                                         ]
//                                     },
//                                     then: 'WINDOW_SHOPPER'
//                                 }
//                             ],
//                             default: 'CASUAL_BROWSER'
//                         }
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$intent',
//                     count: { $sum: 1 },
//                     avgInteractions: { $avg: '$metrics.totalInteractions' },
//                     avgProperties: { $avg: '$metrics.propertyCount' },
//                     avgContacts: { $avg: '$metrics.contactCount' }
//                 }
//             }
//         ]);

//         res.status(200).json({
//             success: true,
//             data: {
//                 intentCategories: intentAnalysis,
//                 summary: {
//                     totalUsers: intentAnalysis.reduce((sum, cat) => sum + cat.count, 0),
//                     highIntentUsers: intentAnalysis.find(c => c._id === 'HIGH_INTENT_BUYER')?.count || 0,
//                     activeSearchers: intentAnalysis.find(c => c._id === 'ACTIVE_SEARCHER')?.count || 0
//                 }
//             }
//         });

//     } catch (error) {
//         console.error('Error analyzing user intent:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to analyze user intent',
//             error: error.message
//         });
//     }
// });

// /**
//  * GET /api/admin/funnel-analytics/journey-paths
//  * Get detailed journey paths showing how users navigate
//  */
// router.get('/api/admin/funnel-analytics/journey-paths', adminAuthenticate, async (req, res) => {
//     try {
//         const { period = 30, limit = 100 } = req.query;
//         const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

//         // Get sequential interaction patterns
//         const journeyPaths = await Interaction.aggregate([
//             {
//                 $match: {
//                     timestamp: { $gte: startDate }
//                 }
//             },
//             {
//                 $sort: { userId: 1, timestamp: 1 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         userId: '$userId',
//                         propertyId: { $arrayElemAt: ['$propertyId', 0] }
//                     },
//                     journey: {
//                         $push: {
//                             type: '$interactionType',
//                             timestamp: '$timestamp'
//                         }
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     userId: '$_id.userId',
//                     propertyId: '$_id.propertyId',
//                     journeySequence: {
//                         $reduce: {
//                             input: '$journey',
//                             initialValue: '',
//                             in: {
//                                 $concat: [
//                                     '$$value',
//                                     { $cond: [{ $eq: ['$$value', ''] }, '', ' → '] },
//                                     '$$this.type'
//                                 ]
//                             }
//                         }
//                     },
//                     journeyLength: { $size: '$journey' },
//                     timeToContact: {
//                         $let: {
//                             vars: {
//                                 contactIndex: { $indexOfArray: ['$journey.type', 'CONTACT'] }
//                             },
//                             in: {
//                                 $cond: [
//                                     { $gte: ['$$contactIndex', 0] },
//                                     {
//                                         $divide: [
//                                             {
//                                                 $subtract: [
//                                                     { $arrayElemAt: ['$journey.timestamp', '$$contactIndex'] },
//                                                     { $arrayElemAt: ['$journey.timestamp', 0] }
//                                                 ]
//                                             },
//                                             1000 * 60 * 60 // Convert to hours
//                                         ]
//                                     },
//                                     null
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$journeySequence',
//                     count: { $sum: 1 },
//                     avgTimeToContact: { $avg: '$timeToContact' },
//                     examples: {
//                         $push: {
//                             userId: '$userId',
//                             propertyId: '$propertyId'
//                         }
//                     }
//                 }
//             },
//             {
//                 $sort: { count: -1 }
//             },
//             {
//                 $limit: parseInt(limit)
//             }
//         ]);

//         // Time-based conversion analysis
//         const timeBasedConversion = await Interaction.aggregate([
//             {
//                 $match: {
//                     timestamp: { $gte: startDate },
//                     interactionType: 'VISIT'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'interactions',
//                     let: {
//                         userId: '$userId',
//                         propertyId: '$propertyId',
//                         visitTime: '$timestamp'
//                     },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $and: [
//                                         { $eq: ['$userId', '$$userId'] },
//                                         { $eq: ['$propertyId', '$$propertyId'] },
//                                         { $eq: ['$interactionType', 'CONTACT'] },
//                                         { $gte: ['$timestamp', '$$visitTime'] }
//                                     ]
//                                 }
//                             }
//                         },
//                         { $limit: 1 }
//                     ],
//                     as: 'contactInteraction'
//                 }
//             },
//             {
//                 $project: {
//                     hasContact: { $gt: [{ $size: '$contactInteraction' }, 0] },
//                     timeToContact: {
//                         $cond: [
//                             { $gt: [{ $size: '$contactInteraction' }, 0] },
//                             {
//                                 $divide: [
//                                     {
//                                         $subtract: [
//                                             { $arrayElemAt: ['$contactInteraction.timestamp', 0] },
//                                             '$timestamp'
//                                         ]
//                                     },
//                                     1000 * 60 * 60 * 24 // Days
//                                 ]
//                             },
//                             null
//                         ]
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalVisits: { $sum: 1 },
//                     convertedToContact: {
//                         $sum: { $cond: ['$hasContact', 1, 0] }
//                     },
//                     avgDaysToContact: { $avg: '$timeToContact' },
//                     conversionByTimeframe: {
//                         $push: {
//                             $cond: [
//                                 '$hasContact',
//                                 {
//                                     within1Day: { $cond: [{ $lte: ['$timeToContact', 1] }, 1, 0] },
//                                     within7Days: { $cond: [{ $lte: ['$timeToContact', 7] }, 1, 0] },
//                                     within30Days: { $cond: [{ $lte: ['$timeToContact', 30] }, 1, 0] }
//                                 },
//                                 null
//                             ]
//                         }
//                     }
//                 }
//             }
//         ]);

//         res.status(200).json({
//             success: true,
//             data: {
//                 topJourneyPaths: journeyPaths,
//                 timeBasedConversion: timeBasedConversion[0] || {},
//                 pathSummary: {
//                     uniquePaths: journeyPaths.length,
//                     mostCommonPath: journeyPaths[0] || null
//                 }
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching journey paths:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch journey paths',
//             error: error.message
//         });
//     }
// });

// /**
//  * GET /api/admin/funnel-analytics/property-funnel/:propertyId
//  * Get funnel data for a specific property
//  */
// router.get('/api/admin/funnel-analytics/property-funnel/:propertyId', adminAuthenticate, async (req, res) => {
//     try {
//         const { propertyId } = req.params;
//         const { period = 30 } = req.query;
//         const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

//         // Get property details
//         const property = await Property.findOne({ post_id: propertyId })
//             .select('post_title price city locality')
//             .lean();

//         if (!property) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Property not found'
//             });
//         }

//         // Get funnel data for this property
//         const propertyFunnel = await Interaction.aggregate([
//             {
//                 $match: {
//                     propertyId: [propertyId],
//                     timestamp: { $gte: startDate }
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$userId',
//                     interactions: {
//                         $push: {
//                             type: '$interactionType',
//                             timestamp: '$timestamp'
//                         }
//                     },
//                     hasVisit: {
//                         $max: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
//                     },
//                     hasSave: {
//                         $max: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
//                     },
//                     hasContact: {
//                         $max: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalUsers: { $sum: 1 },
//                     visitors: { $sum: '$hasVisit' },
//                     savers: { $sum: '$hasSave' },
//                     contactors: { $sum: '$hasContact' },
//                     visitOnly: {
//                         $sum: {
//                             $cond: [
//                                 { $and: ['$hasVisit', { $not: '$hasSave' }, { $not: '$hasContact' }] },
//                                 1,
//                                 0
//                             ]
//                         }
//                     },
//                     saveOnly: {
//                         $sum: {
//                             $cond: [
//                                 { $and: ['$hasSave', { $not: '$hasContact' }] },
//                                 1,
//                                 0
//                             ]
//                         }
//                     }
//                 }
//             }
//         ]);

//         res.status(200).json({
//             success: true,
//             data: {
//                 property,
//                 funnel: propertyFunnel[0] || {
//                     totalUsers: 0,
//                     visitors: 0,
//                     savers: 0,
//                     contactors: 0,
//                     visitOnly: 0,
//                     saveOnly: 0
//                 }
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching property funnel:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch property funnel',
//             error: error.message
//         });
//     }
// });


/**
 * GET /api/admin/funnel-analytics/conversion-pipeline
 * Get conversion funnel data showing user journey from visit to contact
 */
router.get('/api/admin/funnel-analytics/conversion-pipeline', adminAuthenticate, async (req, res) => {
    try {
        const { period = 30 } = req.query;
        const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        // Get all user journeys
        const userJourneys = await Interaction.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $sort: { timestamp: 1 }
            },
            {
                $group: {
                    _id: {
                        userId: '$userId',
                        // Handle both array and string propertyId formats
                        propertyId: {
                            $cond: {
                                if: { $isArray: '$propertyId' },
                                then: { $arrayElemAt: ['$propertyId', 0] },
                                else: '$propertyId'
                            }
                        }
                    },
                    interactions: {
                        $push: {
                            type: '$interactionType',
                            timestamp: '$timestamp'
                        }
                    },
                    firstInteraction: { $first: '$interactionType' },
                    hasVisit: {
                        $max: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
                    },
                    hasSave: {
                        $max: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
                    },
                    hasContact: {
                        $max: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    userId: '$_id.userId',
                    propertyId: '$_id.propertyId',
                    interactions: 1,
                    firstInteraction: 1,
                    journeyPath: {
                        $cond: [
                            { $eq: ['$hasContact', 1] },
                            {
                                $cond: [
                                    { $eq: ['$hasSave', 1] },
                                    'VISIT_SAVE_CONTACT',
                                    'VISIT_CONTACT'
                                ]
                            },
                            {
                                $cond: [
                                    { $eq: ['$hasSave', 1] },
                                    'VISIT_SAVE_ONLY',
                                    'VISIT_ONLY'
                                ]
                            }
                        ]
                    },
                    hasVisit: 1,
                    hasSave: 1,
                    hasContact: 1
                }
            }
        ]);

        // Calculate funnel metrics
        const funnelMetrics = {
            totalVisitors: userJourneys.filter(j => j.hasVisit).length,
            visitToSave: userJourneys.filter(j => j.hasVisit && j.hasSave).length,
            saveToContact: userJourneys.filter(j => j.hasSave && j.hasContact).length,
            visitToContact: userJourneys.filter(j => j.hasVisit && j.hasContact).length,
            directContact: userJourneys.filter(j => j.firstInteraction === 'CONTACT').length
        };

        // Path analysis
        const pathAnalysis = userJourneys.reduce((acc, journey) => {
            if (!acc[journey.journeyPath]) {
                acc[journey.journeyPath] = 0;
            }
            acc[journey.journeyPath]++;
            return acc;
        }, {});

        // Drop-off analysis
        const dropOffAnalysis = {
            afterVisit: userJourneys.filter(j => j.hasVisit && !j.hasSave && !j.hasContact).length,
            afterSave: userJourneys.filter(j => j.hasSave && !j.hasContact).length,
            completed: userJourneys.filter(j => j.hasContact).length
        };

        res.status(200).json({
            success: true,
            data: {
                funnelMetrics,
                pathAnalysis,
                dropOffAnalysis,
                conversionRates: {
                    visitToSave: funnelMetrics.totalVisitors > 0
                        ? ((funnelMetrics.visitToSave / funnelMetrics.totalVisitors) * 100).toFixed(2)
                        : 0,
                    saveToContact: funnelMetrics.visitToSave > 0
                        ? ((funnelMetrics.saveToContact / funnelMetrics.visitToSave) * 100).toFixed(2)
                        : 0,
                    overallConversion: funnelMetrics.totalVisitors > 0
                        ? ((funnelMetrics.visitToContact / funnelMetrics.totalVisitors) * 100).toFixed(2)
                        : 0
                },
                totalJourneys: userJourneys.length
            }
        });

    } catch (error) {
        console.error('Error fetching conversion pipeline:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch conversion pipeline',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/funnel-analytics/user-intent-analysis
 * Analyze user intent based on interaction patterns
 */
router.get('/api/admin/funnel-analytics/user-intent-analysis', adminAuthenticate, async (req, res) => {
    try {
        const { period = 30 } = req.query;
        const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        // Analyze user behavior patterns
        const intentAnalysis = await Interaction.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    totalInteractions: { $sum: 1 },
                    uniqueProperties: {
                        $addToSet: {
                            $cond: {
                                if: { $isArray: '$propertyId' },
                                then: { $arrayElemAt: ['$propertyId', 0] },
                                else: '$propertyId'
                            }
                        }
                    },
                    interactionTypes: { $push: '$interactionType' },
                    contactCount: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    },
                    saveCount: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
                    },
                    visitCount: {
                        $sum: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
                    },
                    firstInteraction: { $min: '$timestamp' },
                    lastInteraction: { $max: '$timestamp' }
                }
            },
            {
                $project: {
                    userId: '$_id',
                    metrics: {
                        totalInteractions: '$totalInteractions',
                        propertyCount: { $size: '$uniqueProperties' },
                        contactCount: '$contactCount',
                        saveCount: '$saveCount',
                        visitCount: '$visitCount',
                        daysActive: {
                            $divide: [
                                { $subtract: ['$lastInteraction', '$firstInteraction'] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    },
                    // Categorize intent based on behavior
                    intent: {
                        $switch: {
                            branches: [
                                // High Intent - Multiple contacts, saves, focused search
                                {
                                    case: {
                                        $and: [
                                            { $gte: ['$contactCount', 2] },
                                            { $gte: ['$saveCount', 1] },
                                            { $lte: [{ $size: '$uniqueProperties' }, 5] }
                                        ]
                                    },
                                    then: 'HIGH_INTENT_BUYER'
                                },
                                // Medium Intent - Some engagement, exploring options
                                {
                                    case: {
                                        $and: [
                                            { $gte: ['$contactCount', 1] },
                                            { $gte: ['$totalInteractions', 5] }
                                        ]
                                    },
                                    then: 'ACTIVE_SEARCHER'
                                },
                                // Comparison Shopper - Many properties, few contacts
                                {
                                    case: {
                                        $and: [
                                            { $gte: [{ $size: '$uniqueProperties' }, 10] },
                                            { $lte: ['$contactCount', 1] }
                                        ]
                                    },
                                    then: 'COMPARISON_SHOPPER'
                                },
                                // Window Shopper - High visits, no serious engagement
                                {
                                    case: {
                                        $and: [
                                            { $gte: ['$visitCount', 10] },
                                            { $eq: ['$contactCount', 0] },
                                            { $lte: ['$saveCount', 2] }
                                        ]
                                    },
                                    then: 'WINDOW_SHOPPER'
                                }
                            ],
                            default: 'CASUAL_BROWSER'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$intent',
                    count: { $sum: 1 },
                    avgInteractions: { $avg: '$metrics.totalInteractions' },
                    avgProperties: { $avg: '$metrics.propertyCount' },
                    avgContacts: { $avg: '$metrics.contactCount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                intentCategories: intentAnalysis,
                summary: {
                    totalUsers: intentAnalysis.reduce((sum, cat) => sum + cat.count, 0),
                    highIntentUsers: intentAnalysis.find(c => c._id === 'HIGH_INTENT_BUYER')?.count || 0,
                    activeSearchers: intentAnalysis.find(c => c._id === 'ACTIVE_SEARCHER')?.count || 0
                }
            }
        });

    } catch (error) {
        console.error('Error analyzing user intent:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze user intent',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/funnel-analytics/journey-paths
 * Get detailed journey paths showing how users navigate
 */
router.get('/api/admin/funnel-analytics/journey-paths', adminAuthenticate, async (req, res) => {
    try {
        const { period = 30, limit = 100 } = req.query;
        const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        // Get sequential interaction patterns
        const journeyPaths = await Interaction.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $sort: { userId: 1, timestamp: 1 }
            },
            {
                $group: {
                    _id: {
                        userId: '$userId',
                        propertyId: {
                            $cond: {
                                if: { $isArray: '$propertyId' },
                                then: { $arrayElemAt: ['$propertyId', 0] },
                                else: '$propertyId'
                            }
                        }
                    },
                    journey: {
                        $push: {
                            type: '$interactionType',
                            timestamp: '$timestamp'
                        }
                    }
                }
            },
            {
                $project: {
                    userId: '$_id.userId',
                    propertyId: '$_id.propertyId',
                    journeySequence: {
                        $reduce: {
                            input: '$journey',
                            initialValue: '',
                            in: {
                                $concat: [
                                    '$$value',
                                    { $cond: [{ $eq: ['$$value', ''] }, '', ' → '] },
                                    '$$this.type'
                                ]
                            }
                        }
                    },
                    journeyLength: { $size: '$journey' },
                    timeToContact: {
                        $let: {
                            vars: {
                                contactIndex: { $indexOfArray: ['$journey.type', 'CONTACT'] }
                            },
                            in: {
                                $cond: [
                                    { $gte: ['$$contactIndex', 0] },
                                    {
                                        $divide: [
                                            {
                                                $subtract: [
                                                    { $arrayElemAt: ['$journey.timestamp', '$$contactIndex'] },
                                                    { $arrayElemAt: ['$journey.timestamp', 0] }
                                                ]
                                            },
                                            1000 * 60 * 60 // Convert to hours
                                        ]
                                    },
                                    null
                                ]
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$journeySequence',
                    count: { $sum: 1 },
                    avgTimeToContact: { $avg: '$timeToContact' },
                    examples: {
                        $push: {
                            userId: '$userId',
                            propertyId: '$propertyId'
                        }
                    }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        // Time-based conversion analysis
        const timeBasedConversion = await Interaction.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate },
                    interactionType: 'VISIT'
                }
            },
            {
                $lookup: {
                    from: 'interactions',
                    let: {
                        userId: '$userId',
                        propertyId: '$propertyId',
                        visitTime: '$timestamp'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$userId', '$$userId'] },
                                        { $eq: ['$propertyId', '$$propertyId'] },
                                        { $eq: ['$interactionType', 'CONTACT'] },
                                        { $gte: ['$timestamp', '$$visitTime'] }
                                    ]
                                }
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: 'contactInteraction'
                }
            },
            {
                $project: {
                    hasContact: { $gt: [{ $size: '$contactInteraction' }, 0] },
                    timeToContact: {
                        $cond: [
                            { $gt: [{ $size: '$contactInteraction' }, 0] },
                            {
                                $divide: [
                                    {
                                        $subtract: [
                                            { $arrayElemAt: ['$contactInteraction.timestamp', 0] },
                                            '$timestamp'
                                        ]
                                    },
                                    1000 * 60 * 60 * 24 // Days
                                ]
                            },
                            null
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalVisits: { $sum: 1 },
                    convertedToContact: {
                        $sum: { $cond: ['$hasContact', 1, 0] }
                    },
                    avgDaysToContact: { $avg: '$timeToContact' },
                    conversionByTimeframe: {
                        $push: {
                            $cond: [
                                '$hasContact',
                                {
                                    within1Day: { $cond: [{ $lte: ['$timeToContact', 1] }, 1, 0] },
                                    within7Days: { $cond: [{ $lte: ['$timeToContact', 7] }, 1, 0] },
                                    within30Days: { $cond: [{ $lte: ['$timeToContact', 30] }, 1, 0] }
                                },
                                null
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                topJourneyPaths: journeyPaths,
                timeBasedConversion: timeBasedConversion[0] || {},
                pathSummary: {
                    uniquePaths: journeyPaths.length,
                    mostCommonPath: journeyPaths[0] || null
                }
            }
        });

    } catch (error) {
        console.error('Error fetching journey paths:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch journey paths',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/funnel-analytics/property-funnel/:propertyId
 * Get funnel data for a specific property
 */
router.get('/api/admin/funnel-analytics/property-funnel/:propertyId', adminAuthenticate, async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { period = 30 } = req.query;
        const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        // Get property details
        const property = await Property.findOne({ post_id: propertyId })
            .select('post_title price city locality')
            .lean();

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Get funnel data for this property - handle both array and string propertyId formats
        const propertyFunnel = await Interaction.aggregate([
            {
                $match: {
                    $or: [
                        { propertyId: [propertyId] }, // Array format
                        { propertyId: propertyId }    // String format
                    ],
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    interactions: {
                        $push: {
                            type: '$interactionType',
                            timestamp: '$timestamp'
                        }
                    },
                    hasVisit: {
                        $max: { $cond: [{ $eq: ['$interactionType', 'VISIT'] }, 1, 0] }
                    },
                    hasSave: {
                        $max: { $cond: [{ $eq: ['$interactionType', 'SAVE'] }, 1, 0] }
                    },
                    hasContact: {
                        $max: { $cond: [{ $eq: ['$interactionType', 'CONTACT'] }, 1, 0] }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    visitors: { $sum: '$hasVisit' },
                    savers: { $sum: '$hasSave' },
                    contactors: { $sum: '$hasContact' },
                    visitOnly: {
                        $sum: {
                            $cond: [
                                { $and: ['$hasVisit', { $not: '$hasSave' }, { $not: '$hasContact' }] },
                                1,
                                0
                            ]
                        }
                    },
                    saveOnly: {
                        $sum: {
                            $cond: [
                                { $and: ['$hasSave', { $not: '$hasContact' }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                property,
                funnel: propertyFunnel[0] || {
                    totalUsers: 0,
                    visitors: 0,
                    savers: 0,
                    contactors: 0,
                    visitOnly: 0,
                    saveOnly: 0
                }
            }
        });

    } catch (error) {
        console.error('Error fetching property funnel:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch property funnel',
            error: error.message
        });
    }
});


// Add this new endpoint to your Express router file

/**
 * GET /api/admin/funnel-analytics/sankey-flow-data
 * Get detailed flow data for Sankey diagram visualization
 */
router.get('/api/admin/funnel-analytics/sankey-flow-data', adminAuthenticate, async (req, res) => {
    try {
        const { period = 30, propertyId = null, userId = null } = req.query;
        const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        // Build match conditions
        const matchConditions = { timestamp: { $gte: startDate } };
        if (propertyId) {
            matchConditions.propertyId = [propertyId];
        }
        if (userId) {
            matchConditions.userId = mongoose.Types.ObjectId(userId);
        }

        // Get all user journeys with detailed flow
        const flowData = await Interaction.aggregate([
            { $match: matchConditions },
            { $sort: { userId: 1, timestamp: 1 } },
            {
                $group: {
                    _id: {
                        userId: '$userId',
                        propertyId: { $arrayElemAt: ['$propertyId', 0] }
                    },
                    journey: {
                        $push: {
                            type: '$interactionType',
                            timestamp: '$timestamp'
                        }
                    },
                    userDetails: { $first: '$userId' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id.userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    let: { propId: '$_id.propertyId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$post_id', '$$propId'] } } }
                    ],
                    as: 'property'
                }
            },
            {
                $project: {
                    userId: '$_id.userId',
                    propertyId: '$_id.propertyId',
                    userName: { $arrayElemAt: ['$user.name', 0] },
                    userEmail: { $arrayElemAt: ['$user.email', 0] },
                    propertyTitle: { $arrayElemAt: ['$property.post_title', 0] },
                    propertyPrice: { $arrayElemAt: ['$property.price', 0] },
                    journey: 1,
                    // Create flow sequence
                    flowSequence: {
                        $reduce: {
                            input: '$journey',
                            initialValue: {
                                path: 'START',
                                transitions: []
                            },
                            in: {
                                path: { $concat: ['$$value.path', ' → ', '$$this.type'] },
                                transitions: {
                                    $concatArrays: [
                                        '$$value.transitions',
                                        [{
                                            from: '$$value.path',
                                            to: { $concat: ['$$value.path', ' → ', '$$this.type'] },
                                            type: '$$this.type'
                                        }]
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        // Process flow data to create Sankey nodes and links
        const nodeMap = new Map();
        const links = [];

        // Define stages
        const stages = ['START', 'VISIT', 'SAVE', 'CONTACT', 'END'];

        // Process each user journey
        flowData.forEach(journey => {
            let currentStage = 'START';
            const userJourneyStages = ['START'];

            // Track unique path for this user
            journey.journey.forEach(interaction => {
                userJourneyStages.push(interaction.type);
            });

            // Create links between consecutive stages
            for (let i = 0; i < userJourneyStages.length - 1; i++) {
                const source = userJourneyStages[i];
                const target = userJourneyStages[i + 1];
                const linkKey = `${source}-${target}`;

                const existingLink = links.find(l => l.source === source && l.target === target);
                if (existingLink) {
                    existingLink.value++;
                    existingLink.users.push({
                        userId: journey.userId,
                        userName: journey.userName,
                        userEmail: journey.userEmail,
                        propertyId: journey.propertyId,
                        propertyTitle: journey.propertyTitle,
                        propertyPrice: journey.propertyPrice
                    });
                } else {
                    links.push({
                        source,
                        target,
                        value: 1,
                        users: [{
                            userId: journey.userId,
                            userName: journey.userName,
                            userEmail: journey.userEmail,
                            propertyId: journey.propertyId,
                            propertyTitle: journey.propertyTitle,
                            propertyPrice: journey.propertyPrice
                        }]
                    });
                }
            }

            // Add end state
            const lastStage = userJourneyStages[userJourneyStages.length - 1];
            const endLinkKey = `${lastStage}-END`;
            const endLink = links.find(l => l.source === lastStage && l.target === 'END');

            if (endLink) {
                endLink.value++;
                endLink.users.push({
                    userId: journey.userId,
                    userName: journey.userName,
                    userEmail: journey.userEmail,
                    propertyId: journey.propertyId,
                    propertyTitle: journey.propertyTitle,
                    propertyPrice: journey.propertyPrice
                });
            } else {
                links.push({
                    source: lastStage,
                    target: 'END',
                    value: 1,
                    users: [{
                        userId: journey.userId,
                        userName: journey.userName,
                        userEmail: journey.userEmail,
                        propertyId: journey.propertyId,
                        propertyTitle: journey.propertyTitle,
                        propertyPrice: journey.propertyPrice
                    }]
                });
            }
        });

        // Create nodes from unique stages
        const nodes = [];
        const nodeSet = new Set();

        links.forEach(link => {
            nodeSet.add(link.source);
            nodeSet.add(link.target);
        });

        nodeSet.forEach(nodeName => {
            nodes.push({ name: nodeName });
        });

        // Calculate conversion metrics
        const totalUsers = flowData.length;
        const metrics = {
            totalUsers,
            visitedUsers: flowData.filter(j => j.journey.some(i => i.type === 'VISIT')).length,
            savedUsers: flowData.filter(j => j.journey.some(i => i.type === 'SAVE')).length,
            contactedUsers: flowData.filter(j => j.journey.some(i => i.type === 'CONTACT')).length,
            conversionRate: totalUsers > 0
                ? ((flowData.filter(j => j.journey.some(i => i.type === 'CONTACT')).length / totalUsers) * 100).toFixed(2)
                : 0
        };

        res.status(200).json({
            success: true,
            data: {
                nodes,
                links,
                metrics,
                totalJourneys: flowData.length
            }
        });

    } catch (error) {
        console.error('Error fetching Sankey flow data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch flow data',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/funnel-analytics/flow-users
 * Get detailed user list for a specific flow path
 */
router.get('/api/admin/funnel-analytics/flow-users', adminAuthenticate, async (req, res) => {
    try {
        const { source, target, period = 30 } = req.query;
        const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        // Get users who followed this specific path
        const users = await Interaction.aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            { $sort: { userId: 1, timestamp: 1 } },
            {
                $group: {
                    _id: {
                        userId: '$userId',
                        propertyId: { $arrayElemAt: ['$propertyId', 0] }
                    },
                    journey: {
                        $push: {
                            type: '$interactionType',
                            timestamp: '$timestamp'
                        }
                    }
                }
            },
            {
                $project: {
                    userId: '$_id.userId',
                    propertyId: '$_id.propertyId',
                    journey: 1,
                    // Check if this journey contains the specific transition
                    hasTransition: {
                        $let: {
                            vars: {
                                sourceIndex: { $indexOfArray: ['$journey.type', source] },
                                targetIndex: { $indexOfArray: ['$journey.type', target] }
                            },
                            in: {
                                $and: [
                                    { $gte: ['$$sourceIndex', 0] },
                                    { $gte: ['$$targetIndex', 0] },
                                    { $lt: ['$$sourceIndex', '$$targetIndex'] }
                                ]
                            }
                        }
                    }
                }
            },
            { $match: { hasTransition: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'properties',
                    let: { propId: '$propertyId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$post_id', '$$propId'] } } }
                    ],
                    as: 'property'
                }
            },
            {
                $project: {
                    userId: 1,
                    userName: { $arrayElemAt: ['$user.name', 0] },
                    userEmail: { $arrayElemAt: ['$user.email', 0] },
                    userPhone: { $arrayElemAt: ['$user.phone', 0] },
                    propertyId: 1,
                    propertyTitle: { $arrayElemAt: ['$property.post_title', 0] },
                    propertyPrice: { $arrayElemAt: ['$property.price', 0] },
                    propertyLocation: {
                        $concat: [
                            { $arrayElemAt: ['$property.city', 0] },
                            ', ',
                            { $arrayElemAt: ['$property.locality', 0] }
                        ]
                    },
                    journey: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                flowPath: `${source} → ${target}`,
                users,
                totalUsers: users.length
            }
        });

    } catch (error) {
        console.error('Error fetching flow users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch flow users',
            error: error.message
        });
    }
});
module.exports = router;