// Base URL for API endpoints
export const base_url = import.meta.env.VITE_BASE_URL

// Email status options
export const EMAIL_STATUS = {
    SENT: 'sent',
    OPENED: 'opened',
    CLICKED: 'clicked',
    FAILED: 'failed'
};

// Default cron schedule expressions
export const CRON_SCHEDULES = {
    DAILY_MORNING: '0 9 * * *',       // 9 AM every day
    DAILY_EVENING: '0 18 * * *',      // 6 PM every day
    WEEKLY_MONDAY: '0 10 * * 1',      // 10 AM every Monday
    WEEKLY_WEEKEND: '0 10 * * 6,0',   // 10 AM every Saturday and Sunday
    MONTHLY: '0 10 1 * *'             // 10 AM on the 1st day of each month
};

// Date format options
export const DATE_FORMAT_OPTIONS = {
    standard: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    },
    short: {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }
};