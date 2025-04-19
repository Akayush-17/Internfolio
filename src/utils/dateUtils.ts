
export function formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; 
    }
  }
  
  export function calculateDuration(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return '';
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + 
                          (end.getMonth() - start.getMonth());
      
      if (monthsDiff < 1) {
        const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;
      }
      
      return `${monthsDiff} month${monthsDiff !== 1 ? 's' : ''}`;
    } catch (error) {
      console.error('Error calculating duration:', error);
      return '';
    }
  }