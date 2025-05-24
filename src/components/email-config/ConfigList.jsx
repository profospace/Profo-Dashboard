import React from 'react';
import { FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';

const ConfigList = ({ configs, activeConfig, editConfig, activateConfig, deleteConfig }) => {
    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Saved Configurations</h2>

            {configs.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-500">No configurations found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {configs.map(config => (
                        <div
                            key={config._id}
                            className={`border rounded-lg p-4 transition duration-150 ${activeConfig && activeConfig._id === config._id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-gray-900">{config.name}</h3>
                                        {activeConfig && activeConfig._id === config._id && (
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{config.host}:{config.port}</p>
                                    <p className="text-sm text-gray-500">{config.from}</p>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => editConfig(config)}
                                        className="text-gray-400 hover:text-gray-500 transition-colors p-1"
                                        title="Edit"
                                    >
                                        <FiEdit size={18} />
                                    </button>

                                    {!(activeConfig && activeConfig._id === config._id) && (
                                        <>
                                            <button
                                                onClick={() => activateConfig(config._id)}
                                                className="text-gray-400 hover:text-green-500 transition-colors p-1"
                                                title="Set as active"
                                            >
                                                <FiCheck size={18} />
                                            </button>

                                            <button
                                                onClick={() => deleteConfig(config._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConfigList;