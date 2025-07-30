export const formatDate = (value) => {
    const date = new Date(value);
    return isNaN(date)
        ? ''
        : date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
          });
};

export const getSeverity = (status) => {
    switch ((status || '').toLowerCase()) {
        case 'active':
        case 'approved':
        case 'verified':
            return 'success';
        case 'pending':
            return 'warning';
        case 'rejected':
        case 'cancelled':
            return 'danger';
        default:
            return null;
    }
};
