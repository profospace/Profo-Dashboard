// PlanModal.jsx
import React from 'react';
import { X, Save } from 'lucide-react';

const PlanModal = ({
    show,
    onClose,
    title,
    onSubmit,
    loading,
    editingPlan,
    formData,
    handleInputChange,
    handleFeatureChange,
    addFeature,
    removeFeature,
    planTypes,
    colorOptions
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter plan name"
                        required
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    {/* ...rest of your fields go here exactly as before */}

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                        >
                            {loading ? <div className="loader" /> : <Save className="w-4 h-4" />}
                            {editingPlan ? 'Update Plan' : 'Create Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlanModal;
