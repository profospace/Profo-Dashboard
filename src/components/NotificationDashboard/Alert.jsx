import React from 'react';

const Alert = ({ title, description, variant = 'default', onClose }) => {
    const variantStyles = {
        default: {
            container: 'bg-blue-50 border-blue-200',
            title: 'text-blue-800',
            desc: 'text-blue-700'
        },
        error: {
            container: 'bg-red-50 border-red-200',
            title: 'text-red-800',
            desc: 'text-red-700'
        },
        success: {
            container: 'bg-green-50 border-green-200',
            title: 'text-green-800',
            desc: 'text-green-700'
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200',
            title: 'text-yellow-800',
            desc: 'text-yellow-700'
        }
    };

    const styles = variantStyles[variant];

    return (
        <div className={`mb-4 p-4 border rounded-md ${styles.container}`}>
            <div className="flex justify-between">
                <div className={`font-semibold ${styles.title}`}>{title}</div>
                {onClose && (
                    <button onClick={onClose} className={styles.title}>
                        &times;
                    </button>
                )}
            </div>
            <div className={styles.desc}>{description}</div>
        </div>
    );
};

export default Alert;