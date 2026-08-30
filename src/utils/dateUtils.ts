```ts
// Date helper functions

export function getTodayDateString(): string {
  // Get today's date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export type DateFormatStyle = 'editorial' | 'dd-mm-yyyy' | 'yyyy-mm-dd' | 'mm-dd-yyyy';

/**
 * Format date like 20 Aug 2026
 */
export function formatEditorialDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (monthIndex < 0 || monthIndex > 11 || isNaN(day)) return dateStr;

  return `${day} ${MONTH_NAMES_SHORT[monthIndex]} ${year}`;
}

/**
 * Format date as DD-MM-YYYY
 */
export function formatDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

/**
 * Format date as MM/DD/YYYY
 */
export function formatMMDDYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

/**
 * Format date based on selected style
 */
export function formatDateByStyle(dateStr: string, style: DateFormatStyle = 'editorial'): string {
  if (!dateStr) return '';

  switch (style) {
    case 'dd-mm-yyyy':
      return formatDDMMYYYY(dateStr);
    case 'yyyy-mm-dd':
      return dateStr;
    case 'mm-dd-yyyy':
      return formatMMDDYYYY(dateStr);
    case 'editorial':
    default:
      return formatEditorialDate(dateStr);
  }
}

/**
 * Check if a task is overdue
 */
export function isOverdue(dueDateStr: string, completed: boolean): boolean {
  if (completed || !dueDateStr) return false;

  const today = getTodayDateString();
  return dueDateStr < today;
}

/**
 * Check if a task is due today
 */
export function isDueToday(dueDateStr: string): boolean {
  if (!dueDateStr) return false;
  return dueDateStr === getTodayDateString();
}

/**
 * Check if a task is due within the next 7 days
 */
export function isDueThisWeek(dueDateStr: string): boolean {
  if (!dueDateStr) return false;

  const today = getTodayDateString();

  if (dueDateStr < today) return false;

  const todayDate = new Date(today);
  const targetDate = new Date(dueDateStr);

  const diffTime = targetDate.getTime() - todayDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= 7;
}

/**
 * Check if the date is valid
 */
export function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const parts = dateStr.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1) {
    return false;
  }

  const daysInMonth = new Date(y, m, 0).getDate();
  return d <= daysInMonth;
}
```
