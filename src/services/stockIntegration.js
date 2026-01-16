/**
 * Stock Integration Service
 * Handles automatic stock updates from production worksheets
 */

import { STORAGE_KEYS } from './api';

/**
 * Update stock based on worksheet production
 * @param {Object} worksheet - The worksheet data
 * @param {Object} previousWorksheet - Previous worksheet data (for updates)
 * @returns {Promise<void>}
 */
export const updateStockFromWorksheet = async (worksheet, previousWorksheet = null) => {
    try {
        // Get current stock items from localStorage or Supabase
        const stockKey = STORAGE_KEYS.STOCK;
        const stockData = localStorage.getItem(stockKey);

        if (!stockData) {
            console.warn('No stock data found');
            return;
        }

        const stockItems = JSON.parse(stockData);

        // Find the finished goods item (Pellet)
        // You can customize this to match your specific product
        const finishedGoodsItem = stockItems.find(item =>
            item.category === 'finished' && item.code === 'FG-002' // Pellet Curah
        );

        if (!finishedGoodsItem) {
            console.warn('Finished goods item not found in stock');
            return;
        }

        // Calculate stock change (kg)
        let stockChange = 0;
        let bagChange = 0;

        if (previousWorksheet) {
            // If updating existing worksheet, calculate the difference
            const previousProduction = previousWorksheet.actualProduction || 0;
            const newProduction = worksheet.actualProduction || 0;
            stockChange = newProduction - previousProduction;

            // Calculate bag count change
            const previousBags = previousWorksheet.bagCount || 0;
            const newBags = worksheet.bagCount || 0;
            bagChange = newBags - previousBags;
        } else {
            // If creating new worksheet, add the full production
            stockChange = worksheet.actualProduction || 0;
            bagChange = worksheet.bagCount || 0;
        }

        // Only update if there's a change and worksheet is completed
        if ((stockChange !== 0 || bagChange !== 0) && worksheet.status === 'completed') {
            // Update the stock quantity (kg)
            finishedGoodsItem.stock = (finishedGoodsItem.stock || 0) + stockChange;

            // Update bag count
            finishedGoodsItem.bagCount = (finishedGoodsItem.bagCount || 0) + bagChange;
            finishedGoodsItem.packagingType = worksheet.packagingType || 'karung';
            finishedGoodsItem.kgPerBag = finishedGoodsItem.bagCount > 0
                ? (finishedGoodsItem.stock / finishedGoodsItem.bagCount).toFixed(1)
                : 0;

            // Save back to localStorage
            const updatedStockItems = stockItems.map(item =>
                item.id === finishedGoodsItem.id ? finishedGoodsItem : item
            );

            localStorage.setItem(stockKey, JSON.stringify(updatedStockItems));

            console.log(`Stock updated: ${stockChange > 0 ? '+' : ''}${stockChange} kg, ${bagChange > 0 ? '+' : ''}${bagChange} ${worksheet.packagingType || 'karung'} for ${finishedGoodsItem.name}`);

            // Create stock movement record
            await createStockMovement({
                itemId: finishedGoodsItem.id,
                itemName: finishedGoodsItem.name,
                type: 'production',
                quantity: stockChange,
                bagCount: bagChange,
                packagingType: worksheet.packagingType || 'karung',
                unit: finishedGoodsItem.unit,
                reference: worksheet.worksheetNumber,
                date: worksheet.productionDate,
                notes: `Production from ${worksheet.machineName} - Shift ${worksheet.shift}${worksheet.bagCount ? ` (${worksheet.bagCount} ${worksheet.packagingType})` : ''}`
            });
        }
    } catch (error) {
        console.error('Error updating stock from worksheet:', error);
    }
};

/**
 * Remove stock when worksheet is deleted
 * @param {Object} worksheet - The worksheet to be deleted
 * @returns {Promise<void>}
 */
export const removeStockFromWorksheet = async (worksheet) => {
    try {
        // Only remove stock if worksheet was completed
        if (worksheet.status !== 'completed') {
            return;
        }

        const stockKey = STORAGE_KEYS.STOCK;
        const stockData = localStorage.getItem(stockKey);

        if (!stockData) {
            console.warn('No stock data found');
            return;
        }

        const stockItems = JSON.parse(stockData);

        const finishedGoodsItem = stockItems.find(item =>
            item.category === 'finished' && item.code === 'FG-002'
        );

        if (!finishedGoodsItem) {
            console.warn('Finished goods item not found in stock');
            return;
        }

        // Subtract the production from stock
        const stockChange = -(worksheet.actualProduction || 0);
        finishedGoodsItem.stock = Math.max(0, (finishedGoodsItem.stock || 0) + stockChange);

        // Save back to localStorage
        const updatedStockItems = stockItems.map(item =>
            item.id === finishedGoodsItem.id ? finishedGoodsItem : item
        );

        localStorage.setItem(stockKey, JSON.stringify(updatedStockItems));

        console.log(`Stock removed: ${stockChange} kg for ${finishedGoodsItem.name}`);

        // Create stock movement record
        await createStockMovement({
            itemId: finishedGoodsItem.id,
            itemName: finishedGoodsItem.name,
            type: 'adjustment',
            quantity: stockChange,
            unit: finishedGoodsItem.unit,
            reference: worksheet.worksheetNumber,
            date: new Date().toISOString().split('T')[0],
            notes: `Worksheet deleted: ${worksheet.worksheetNumber}`
        });
    } catch (error) {
        console.error('Error removing stock from worksheet:', error);
    }
};

/**
 * Create a stock movement record for tracking
 * @param {Object} movement - Stock movement data
 * @returns {Promise<void>}
 */
const createStockMovement = async (movement) => {
    try {
        const movementKey = STORAGE_KEYS.STOCK_MOVEMENTS || 'erp_stock_movements';
        const movementData = localStorage.getItem(movementKey);

        const movements = movementData ? JSON.parse(movementData) : [];

        const newMovement = {
            id: `mov_${Date.now()}`,
            ...movement,
            createdAt: new Date().toISOString()
        };

        movements.push(newMovement);
        localStorage.setItem(movementKey, JSON.stringify(movements));

        console.log('Stock movement recorded:', newMovement);
    } catch (error) {
        console.error('Error creating stock movement:', error);
    }
};

/**
 * Get stock movements for a specific item
 * @param {string} itemId - Item ID
 * @returns {Array} Stock movements
 */
export const getStockMovements = (itemId = null) => {
    try {
        const movementKey = STORAGE_KEYS.STOCK_MOVEMENTS || 'erp_stock_movements';
        const movementData = localStorage.getItem(movementKey);

        if (!movementData) {
            return [];
        }

        const movements = JSON.parse(movementData);

        if (itemId) {
            return movements.filter(m => m.itemId === itemId);
        }

        return movements;
    } catch (error) {
        console.error('Error getting stock movements:', error);
        return [];
    }
};
