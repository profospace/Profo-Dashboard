import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

const ConstantDataSection = ({ constantData, onChange, onDetailPageButtonColorChange }) => {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    const [categories] = useState({
        General: [
            { id: 'autoPlayAds', label: 'Autoplay Ads', type: 'checkbox', value: constantData.autoPlayAds },
            { id: 'headerBackgroundImage', label: 'Header Background Image', type: 'text', value: constantData.headerBackgroundImage },
            { id: 'progressGif', label: 'Progress GIF', type: 'text', value: constantData.progressGif },
            { id: 'listEndImage', label: 'List End Image', type: 'text', value: constantData.listEndImage },
            { id: 'listAds', label: 'List Ads', type: 'text', value: constantData.listAds },
            { id: 'searchAds', label: 'Search Ads', type: 'text', value: constantData.searchAds },
            { id: 'maxListAds', label: 'Max List Ads', type: 'text', value: constantData.maxListAds },
        ],
        Features: [
            { id: 'isPropertyUpload', label: 'Enable Property Upload', type: 'checkbox', value: constantData.isPropertyUpload },
            { id: 'isStrokeFilter', label: 'Enable Stroke Filter', type: 'checkbox', value: constantData.isStrokeFilter },
            { id: 'isMaterialElevation', label: 'Enable Material Elevation', type: 'checkbox', value: constantData.isMaterialElevation },
            { id: 'isCallDirect', label: 'Enable Direct Call', type: 'checkbox', value: constantData.isCallDirect },
            { id: 'shadowOnImage', label: 'Enable Shadow on Images', type: 'checkbox', value: constantData.shadowOnImage },
            { id: 'headerHeight', label: 'Header Height', type: 'number', value: constantData.headerHeight },
            { id: 'homePageLayoutOrder', label: 'Home Page Layout Order', type: 'text', value: constantData.homePageLayoutOrder?.join(',') },
        ],
        App: [
            { id: 'appName', label: 'App Name', type: 'text', value: constantData.appName },
            { id: 'appPackageName', label: 'App Package Name', type: 'text', value: constantData.appPackageName },
            { id: 'appEmail', label: 'App Email', type: 'email', value: constantData.appEmail },
            { id: 'appWebsite', label: 'App Website', type: 'url', value: constantData.appWebsite },
            { id: 'appLogo', label: 'App Logo URL', type: 'text', value: constantData.appLogo },
            { id: 'appCompany', label: 'App Company', type: 'text', value: constantData.appCompany },
            { id: 'appContact', label: 'App Contact', type: 'text', value: constantData.appContact },
            { id: 'defaultLanguage', label: 'Default Language', type: 'text', value: constantData.defaultLanguage },
            { id: 'currencyCode', label: 'Currency Code', type: 'text', value: constantData.currencyCode },
            { id: 'appVersion', label: 'App Version', type: 'text', value: constantData.appVersion },
        ],
        Colors: [
            { id: 'priceColor', label: 'Price Color', type: 'color', value: constantData.priceColor },
            { id: 'callButtonColor', label: 'Call Button Color', type: 'color', value: constantData.callButtonColor },
            { id: 'detailPageButtonStartColor', label: 'Detail Page Button Start Color', type: 'color', value: constantData.DetailPageButtonColor?.startColor || '#e1faeb' },
            { id: 'detailPageButtonEndColor', label: 'Detail Page Button End Color', type: 'color', value: constantData.DetailPageButtonColor?.endColor || '#e1faeb' },
        ],
        Social: [
            { id: 'facebookLink', label: 'Facebook URL', type: 'url', value: constantData.facebookLink },
            { id: 'twitterLink', label: 'Twitter URL', type: 'url', value: constantData.twitterLink },
            { id: 'instagramLink', label: 'Instagram URL', type: 'url', value: constantData.instagramLink },
            { id: 'youtubeLink', label: 'YouTube URL', type: 'url', value: constantData.youtubeLink },
            { id: 'googlePlayLink', label: 'Google Play URL', type: 'url', value: constantData.googlePlayLink },
            { id: 'appleStoreLink', label: 'Apple App Store URL', type: 'url', value: constantData.appleStoreLink },
        ],
        Updates: [
            { id: 'appUpdateHideShow', label: 'Update Hide/Show', type: 'text', value: constantData.appUpdateHideShow },
            { id: 'appUpdateVersionCode', label: 'Update Version Code', type: 'number', value: constantData.appUpdateVersionCode },
            { id: 'appUpdateDesc', label: 'Update Description', type: 'textarea', value: constantData.appUpdateDesc },
            { id: 'appUpdateLink', label: 'Update Link', type: 'url', value: constantData.appUpdateLink },
            { id: 'appUpdateCancelOption', label: 'Update Cancel Option', type: 'text', value: constantData.appUpdateCancelOption },
        ],
    });

    const handleChange = (id, value) => {
        // Special case for homePageLayoutOrder which needs to be an array
        if (id === 'homePageLayoutOrder') {
            const orderArray = value.split(',').map(item => parseInt(item.trim())).filter(item => !isNaN(item));
            onChange(id, orderArray);
            return;
        }

        // Special case for DetailPageButtonColor
        if (id === 'detailPageButtonStartColor') {
            onDetailPageButtonColorChange('startColor', value);
            return;
        }

        if (id === 'detailPageButtonEndColor') {
            onDetailPageButtonColorChange('endColor', value);
            return;
        }

        onChange(id, value);
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <input
                            id={field.id}
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => handleChange(field.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={field.id} className="text-gray-700">
                            {field.label}
                        </label>
                    </div>
                );

            case 'textarea':
                return (
                    <div className="space-y-1">
                        <label htmlFor={field.id} className="block text-gray-700">
                            {field.label}
                        </label>
                        <textarea
                            id={field.id}
                            value={field.value || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
                            rows={4}
                        />
                    </div>
                );

            case 'color':
                return (
                    <div className="space-y-1">
                        <label htmlFor={field.id} className="block text-gray-700">
                            {field.label}
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="color"
                                id={field.id}
                                value={field.value || '#000000'}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="h-10 w-16 p-1 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                value={field.value || ''}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-1">
                        <label htmlFor={field.id} className="block text-gray-700">
                            {field.label}
                        </label>
                        <input
                            id={field.id}
                            type={field.type}
                            value={field.value || ''}
                            onChange={(e) => handleChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                );
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Constant Data</h2>

            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-100 p-1">
                    {Object.keys(categories).map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                                    selected
                                        ? 'bg-white shadow text-blue-700'
                                        : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                                )
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-4">
                    {Object.values(categories).map((fields, idx) => (
                        <Tab.Panel
                            key={idx}
                            className={classNames(
                                'rounded-xl bg-white p-3',
                                'focus:outline-none'
                            )}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default ConstantDataSection;