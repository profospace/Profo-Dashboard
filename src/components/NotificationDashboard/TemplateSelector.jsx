import React from 'react';

const TemplateSelector = ({ onSelectTemplate }) => {
    // Dummy template data
    const dummyTemplates = [
        {
            id: 'template1',
            name: 'PROFO-Testing-Alert-Deeplink-Image',
            title: 'PROFO-Testing-Alert-Deeplink-Image',
            body: 'Good news! The price of {{3BHK Apartment in Andheri West}} in {{banglore}} has dropped by {{20}}%. Check it out now!',
            imageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1745925467699/3463bf11-3e60-482f-b049-aa80223c6b57_2.jpg',
            clickAction: 'https://www.profospace.in/filter?purpose=Buy&property_type=Apartment&min_price=10&max_price=100000&bedrooms=0&lat=26.473079517245534&lng=80.28552837186105&radius=1100',
            category: 'system',
            additionalData: {
                'dropAmount': '₹50,000',
                'previousPrice': '₹1,500,000',
            },
            tags: ['price', 'alert', 'property'],
            active: true
        },
        {
            id: 'template2',
            name: 'new-property-listing',
            title: 'New Property Alert',
            body: 'A new {{propertyType}} property has been listed in {{location}} that matches your preferences. Be the first to check it out!',
            imageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1745925467699/ab7e9c1d-ca8d-47a3-85d7-7773b2057e80_4.jpg',
            clickAction: 'https://www.profospace.in/filter?purpose=Buy&property_type=Apartment&min_price=10&max_price=100000&bedrooms=0&lat=26.473079517245534&lng=80.28552837186105&radius=1100',
            category: 'system',
            additionalData: {
                'amenities': 'Swimming Pool, Gym, Security',
                'availability': 'Immediate',
            },
            tags: ['new', 'listing', 'property'],
            active: true
        },
        {
            id: 'template3',
            name: 'property-visit-reminder',
            title: 'Property Visit Reminder',
            body: 'Your scheduled visit to {{propertyTitle}} in {{location}} is tomorrow at {{visitTime}}. Don\'t forget to bring your ID proof.',
            imageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1745925467699/b6c93c00-d597-4462-814c-c1be0adce30b_7.jpg',
            clickAction: 'https://www.profospace.in/filter?purpose=Buy&property_type=Apartment&min_price=10&max_price=100000&bedrooms=0&lat=26.473079517245534&lng=80.28552837186105&radius=1100',
            category: 'system',
            additionalData: {
                'agentName': 'Rahul Sharma',
                'agentContact': '+91 98765 43210',
                'location': 'Sector 18, Noida',
            },
            tags: ['visit', 'reminder', 'schedule'],
            active: true
        },
        {
            id: 'template4',
            name: 'maintenance-notification',
            title: 'Maintenance Notification',
            body: 'The {{maintenanceType}} maintenance for {{buildingName}} is scheduled for {{maintenanceDate}}. Please make necessary arrangements.',
            imageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1745925467699/3463bf11-3e60-482f-b049-aa80223c6b57_2.jpg',
            clickAction: 'https://www.profospace.in/filter?purpose=Buy&property_type=Apartment&min_price=10&max_price=100000&bedrooms=0&lat=26.473079517245534&lng=80.28552837186105&radius=1100',
            category: 'system',
            additionalData: {
                'duration': '4 hours',
                'contact': 'Maintenance Dept: +91 99887 76655',
            },
            tags: ['maintenance', 'building', 'notice'],
            active: true
        },
        {
            id: 'template5',
            name: 'payment-reminder',
            title: 'Payment Reminder',
            body: 'Your {{paymentType}} payment of ₹{{paymentAmount}} for {{propertyTitle}} is due on {{dueDate}}. Please make the payment to avoid late fees.',
            imageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1745925467699/ab7e9c1d-ca8d-47a3-85d7-7773b2057e80_4.jpg',
            clickAction: 'https://www.profospace.in/filter?purpose=Buy&property_type=Apartment&min_price=10&max_price=100000&bedrooms=0&lat=26.473079517245534&lng=80.28552837186105&radius=1100',
            category: 'system',
            additionalData: {
                'lateFee': '₹500 per day',
                'paymentMethods': 'UPI, Net Banking, Credit Card',
            },
            tags: ['payment', 'reminder', 'due'],
            active: true
        }
    ];

    const handleChange = (e) => {
        const selectedTemplate = dummyTemplates.find(template => template.id === e.target.value);
        if (selectedTemplate) {
            onSelectTemplate(selectedTemplate);
        }
    };

    return (
        <div className="mb-6 border-b pb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select a Template to Autofill</label>
            <div className="flex">
                <select
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                    defaultValue=""
                >
                    <option value="" disabled>-- Select a template --</option>
                    {dummyTemplates.map(template => (
                        <option key={template.id} value={template.id}>
                            {template.name} - {template.title}
                        </option>
                    ))}
                </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">Select a template to automatically fill the form fields</p>
        </div>
    );
};

export default TemplateSelector;