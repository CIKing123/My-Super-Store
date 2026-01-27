import { CartItem } from '../context/CartContext';

export interface UserPreferenceRecord {
    userId: string;
    userEmail: string;
    timestamp: string;
    csvData: string;
    productCount: number;
}

/**
 * Generate CSV data from cart items for user personalization and recommendations
 * CSV format: Product Name, Category, Vendor, Quantity
 */
export async function generateCartCSV(
    items: CartItem[],
    supabase: any,
    userEmail?: string
): Promise<string> {
    if (items.length === 0) {
        return 'Product Name,Category,Vendor,Quantity\n';
    }

    const rows: string[] = ['Product Name,Category,Vendor,Quantity'];

    for (const item of items) {
        try {
            // Fetch vendor business name
            const { data: vendorData } = await supabase
                .from('vendors')
                .select('business_name')
                .eq('id', item.products?.seller_id || '')
                .single();

            // Fetch category - get the first category for this product
            const { data: categoryData } = await supabase
                .from('product_categories')
                .select('categories(name)')
                .eq('product_id', item.product_id)
                .limit(1);

            const productName = item.products?.name || 'Unknown';
            const category = categoryData?.[0]?.categories?.name || 'Uncategorized';
            const vendor = vendorData?.business_name || 'Unknown Vendor';
            const quantity = item.quantity;

            // Escape product names and categories that might contain commas or quotes
            const escapedName = `"${productName.replace(/"/g, '""')}"`;
            const escapedCategory = `"${category.replace(/"/g, '""')}"`;
            const escapedVendor = `"${vendor.replace(/"/g, '""')}"`;

            rows.push(`${escapedName},${escapedCategory},${escapedVendor},${quantity}`);
        } catch (error) {
            console.error(`Error fetching data for product ${item.product_id}:`, error);
            // Add row with available data
            const escapedName = `"${(item.products?.name || 'Unknown').replace(/"/g, '""')}"`;
            rows.push(`${escapedName},"Uncategorized","Unknown Vendor",${item.quantity}`);
        }
    }

    // Join all rows with newlines
    return rows.join('\n');
}

/**
 * Generate CSV with timestamp header for better data tracking
 */
export function generateCSVWithHeader(
    csv: string,
    userEmail?: string,
    timestamp?: Date
): string {
    const date = timestamp || new Date();
    const header = `# User Preference Data\n# Generated: ${date.toISOString()}\n${
        userEmail ? `# User Email: ${userEmail}\n` : ''
    }# This file contains product preferences for personalized recommendations\n\n`;

    return header + csv;
}

/**
 * Save user preference data to localStorage for caching
 */
export function saveUserPreferenceData(
    userId: string,
    userEmail: string,
    csvData: string,
    items: CartItem[]
): void {
    const record: UserPreferenceRecord = {
        userId,
        userEmail,
        timestamp: new Date().toISOString(),
        csvData,
        productCount: items.length,
    };

    // Get existing records from localStorage
    const existingRecordsJson = localStorage.getItem('user_preference_records');
    const records: UserPreferenceRecord[] = existingRecordsJson ? JSON.parse(existingRecordsJson) : [];

    // Add new record
    records.push(record);

    // Keep only last 50 purchase records per user
    const userRecords = records.filter(r => r.userId === userId);
    if (userRecords.length > 50) {
        const otherRecords = records.filter(r => r.userId !== userId);
        const latestUserRecords = userRecords.slice(-50);
        const updatedRecords = [...otherRecords, ...latestUserRecords];
        localStorage.setItem('user_preference_records', JSON.stringify(updatedRecords));
    } else {
        localStorage.setItem('user_preference_records', JSON.stringify(records));
    }

    console.log(`User preference data saved for ${userEmail}`);
}

/**
 * Get all preference records for a user
 */
export function getUserPreferenceRecords(userId: string): UserPreferenceRecord[] {
    const recordsJson = localStorage.getItem('user_preference_records');
    if (!recordsJson) return [];

    const allRecords: UserPreferenceRecord[] = JSON.parse(recordsJson);
    return allRecords.filter(record => record.userId === userId);
}

/**
 * Get the most recent preference record for a user
 */
export function getLatestUserPreference(userId: string): UserPreferenceRecord | null {
    const records = getUserPreferenceRecords(userId);
    return records.length > 0 ? records[records.length - 1] : null;
}

/**
 * Download cached user preference data as CSV
 */
export function downloadCachedPreferenceData(record: UserPreferenceRecord): void {
    const filename = `user-preferences-${record.userEmail}-${record.timestamp.split('T')[0]}.csv`;

    const element = document.createElement('a');
    element.setAttribute(
        'href',
        'data:text/csv;charset=utf-8,' + encodeURIComponent(record.csvData)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Download CSV file directly to user's local disk
 */
export function downloadCSVToLocalDisk(csv: string, userEmail?: string): void {
    const date = new Date().toISOString().split('T')[0];
    const filename = userEmail
        ? `user-preferences-${userEmail.replace(/[@.]/g, '_')}-${date}.csv`
        : `user-preferences-${date}.csv`;

    const element = document.createElement('a');
    element.setAttribute(
        'href',
        'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    console.log(`CSV file saved: ${filename}`);
}
