// API Configuration
export const API_CONFIG = {
    UNLEASH_API_KEY: '3e736dba7151eb8de28a065916dc9d70',
    BASE_URL: 'https://api.unleashnfts.com/api/v2'
};

// API Endpoints
export const API_ENDPOINTS = {
    GAMING_METRICS: `${API_CONFIG.BASE_URL}/nft/wallet/gaming/metrics`,
    GAMING_TREND: `${API_CONFIG.BASE_URL}/nft/wallet/gaming/collection/trend`
};

// Feature Configuration
export const FEATURES = {
    DEFAULT_BLOCKCHAIN: 'ethereum',
    DEFAULT_TIME_RANGE: '24h',
    DEFAULT_SORT: 'active_users',
    PAGINATION: {
        DEFAULT_LIMIT: 30,
        DEFAULT_OFFSET: 0
    },
    TIME_RANGES: [
        { value: '24h', label: 'Last 24 Hours' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' }
    ],
    SORT_OPTIONS: [
        { value: 'total_users', label: 'Total Users' },
        { value: 'active_users', label: 'Active Users' },
        { value: 'engagement_rate', label: 'Engagement Rate' },
        { value: 'total_interactions_volume', label: 'Volume' }
    ]
};
