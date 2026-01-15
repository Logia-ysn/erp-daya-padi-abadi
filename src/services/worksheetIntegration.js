/**
 * Worksheet Data Integration Service
 * Provides functions to integrate worksheet data with other modules
 */

/**
 * Get production data from worksheets
 * Converts worksheet data to production records format
 */
export const getProductionFromWorksheets = (worksheets) => {
    return worksheets.map(ws => ({
        id: `prod_ws_${ws.id}`,
        woNumber: ws.worksheetNumber,
        date: ws.productionDate,
        machineId: ws.machineId,
        machineName: ws.machineName,
        inputQty: ws.targetProduction,
        outputQty: ws.actualProduction,
        yieldRate: ws.targetProduction > 0
            ? ((ws.actualProduction / ws.targetProduction) * 100).toFixed(1)
            : 0,
        operator: ws.shiftLead,
        shift: ws.shift,
        status: ws.status,
        source: 'worksheet'
    }));
};

/**
 * Get downtime records from worksheets
 * Extracts all downtime entries from worksheets
 */
export const getDowntimeFromWorksheets = (worksheets) => {
    const downtimes = [];

    worksheets.forEach(ws => {
        ws.downtimes.forEach((dt, index) => {
            const start = new Date(`${ws.productionDate}T${dt.startTime}`);
            const end = new Date(`${ws.productionDate}T${dt.endTime}`);
            const durationHours = ((end - start) / (1000 * 60 * 60)).toFixed(2);

            downtimes.push({
                id: `dt_ws_${ws.id}_${index}`,
                worksheetId: ws.id,
                worksheetNumber: ws.worksheetNumber,
                date: ws.productionDate,
                machineId: ws.machineId,
                machineName: ws.machineName,
                shift: ws.shift,
                startTime: dt.startTime,
                endTime: dt.endTime,
                duration: parseFloat(durationHours),
                category: dt.category,
                description: dt.description,
                reportedBy: ws.shiftLead,
                source: 'worksheet'
            });
        });
    });

    return downtimes;
};

/**
 * Get performance metrics from worksheets
 * Calculates performance KPIs from worksheet data
 */
export const getPerformanceFromWorksheets = (worksheets) => {
    const totalTarget = worksheets.reduce((sum, ws) => sum + ws.targetProduction, 0);
    const totalActual = worksheets.reduce((sum, ws) => sum + ws.actualProduction, 0);
    const totalDowntime = worksheets.reduce((sum, ws) => {
        return sum + ws.downtimes.reduce((dtSum, dt) => {
            const start = new Date(`2000-01-01T${dt.startTime}`);
            const end = new Date(`2000-01-01T${dt.endTime}`);
            return dtSum + ((end - start) / (1000 * 60 * 60));
        }, 0);
    }, 0);

    const avgAchievement = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : 0;

    // Calculate by machine
    const byMachine = {};
    worksheets.forEach(ws => {
        if (!byMachine[ws.machineId]) {
            byMachine[ws.machineId] = {
                machineId: ws.machineId,
                machineName: ws.machineName,
                totalTarget: 0,
                totalActual: 0,
                totalDowntime: 0,
                worksheetCount: 0
            };
        }

        byMachine[ws.machineId].totalTarget += ws.targetProduction;
        byMachine[ws.machineId].totalActual += ws.actualProduction;
        byMachine[ws.machineId].worksheetCount += 1;

        ws.downtimes.forEach(dt => {
            const start = new Date(`2000-01-01T${dt.startTime}`);
            const end = new Date(`2000-01-01T${dt.endTime}`);
            byMachine[ws.machineId].totalDowntime += ((end - start) / (1000 * 60 * 60));
        });
    });

    // Calculate by shift
    const byShift = {};
    worksheets.forEach(ws => {
        if (!byShift[ws.shift]) {
            byShift[ws.shift] = {
                shift: ws.shift,
                totalTarget: 0,
                totalActual: 0,
                totalDowntime: 0,
                worksheetCount: 0
            };
        }

        byShift[ws.shift].totalTarget += ws.targetProduction;
        byShift[ws.shift].totalActual += ws.actualProduction;
        byShift[ws.shift].worksheetCount += 1;

        ws.downtimes.forEach(dt => {
            const start = new Date(`2000-01-01T${dt.startTime}`);
            const end = new Date(`2000-01-01T${dt.endTime}`);
            byShift[ws.shift].totalDowntime += ((end - start) / (1000 * 60 * 60));
        });
    });

    return {
        overall: {
            totalTarget,
            totalActual,
            totalDowntime: totalDowntime.toFixed(2),
            avgAchievement: parseFloat(avgAchievement),
            worksheetCount: worksheets.length
        },
        byMachine: Object.values(byMachine).map(m => ({
            ...m,
            achievement: m.totalTarget > 0 ? ((m.totalActual / m.totalTarget) * 100).toFixed(1) : 0,
            totalDowntime: m.totalDowntime.toFixed(2)
        })),
        byShift: Object.values(byShift).map(s => ({
            ...s,
            achievement: s.totalTarget > 0 ? ((s.totalActual / s.totalTarget) * 100).toFixed(1) : 0,
            totalDowntime: s.totalDowntime.toFixed(2)
        }))
    };
};

/**
 * Get OEE (Overall Equipment Effectiveness) data from worksheets
 */
export const getOEEFromWorksheets = (worksheets) => {
    return worksheets.map(ws => {
        // Calculate planned production time (in hours)
        const startTime = new Date(`2000-01-01T${ws.workStartTime}`);
        const endTime = new Date(`2000-01-01T${ws.workEndTime}`);
        const breakTime = new Date(`2000-01-01T${ws.breakTime}`);

        let plannedTime = (endTime - startTime) / (1000 * 60 * 60);
        if (plannedTime < 0) plannedTime += 24; // Handle overnight shifts

        // Subtract break time (assume 1 hour break)
        plannedTime -= 1;

        // Calculate downtime
        const downtime = ws.downtimes.reduce((sum, dt) => {
            const start = new Date(`2000-01-01T${dt.startTime}`);
            const end = new Date(`2000-01-01T${dt.endTime}`);
            return sum + ((end - start) / (1000 * 60 * 60));
        }, 0);

        // Operating time = Planned time - Downtime
        const operatingTime = plannedTime - downtime;

        // Availability = Operating Time / Planned Time
        const availability = plannedTime > 0 ? (operatingTime / plannedTime) * 100 : 0;

        // Performance = Actual Production / Target Production
        const performance = ws.targetProduction > 0
            ? (ws.actualProduction / ws.targetProduction) * 100
            : 0;

        // Quality = assume 100% for now (can be enhanced with quality data)
        const quality = 100;

        // OEE = Availability × Performance × Quality
        const oee = (availability * performance * quality) / 10000;

        return {
            id: ws.id,
            worksheetNumber: ws.worksheetNumber,
            date: ws.productionDate,
            machineId: ws.machineId,
            machineName: ws.machineName,
            shift: ws.shift,
            plannedTime: plannedTime.toFixed(2),
            operatingTime: operatingTime.toFixed(2),
            downtime: downtime.toFixed(2),
            availability: availability.toFixed(1),
            performance: performance.toFixed(1),
            quality: quality.toFixed(1),
            oee: oee.toFixed(1)
        };
    });
};

/**
 * Get machine utilization data from worksheets
 */
export const getMachineUtilizationFromWorksheets = (worksheets) => {
    const utilization = {};

    worksheets.forEach(ws => {
        if (!utilization[ws.machineId]) {
            utilization[ws.machineId] = {
                machineId: ws.machineId,
                machineName: ws.machineName,
                totalPlannedHours: 0,
                totalOperatingHours: 0,
                totalDowntimeHours: 0,
                worksheetCount: 0
            };
        }

        // Calculate hours
        const startTime = new Date(`2000-01-01T${ws.workStartTime}`);
        const endTime = new Date(`2000-01-01T${ws.workEndTime}`);
        let plannedHours = (endTime - startTime) / (1000 * 60 * 60);
        if (plannedHours < 0) plannedHours += 24;
        plannedHours -= 1; // Subtract break

        const downtimeHours = ws.downtimes.reduce((sum, dt) => {
            const start = new Date(`2000-01-01T${dt.startTime}`);
            const end = new Date(`2000-01-01T${dt.endTime}`);
            return sum + ((end - start) / (1000 * 60 * 60));
        }, 0);

        utilization[ws.machineId].totalPlannedHours += plannedHours;
        utilization[ws.machineId].totalOperatingHours += (plannedHours - downtimeHours);
        utilization[ws.machineId].totalDowntimeHours += downtimeHours;
        utilization[ws.machineId].worksheetCount += 1;
    });

    return Object.values(utilization).map(u => ({
        ...u,
        utilizationRate: u.totalPlannedHours > 0
            ? ((u.totalOperatingHours / u.totalPlannedHours) * 100).toFixed(1)
            : 0,
        totalPlannedHours: u.totalPlannedHours.toFixed(2),
        totalOperatingHours: u.totalOperatingHours.toFixed(2),
        totalDowntimeHours: u.totalDowntimeHours.toFixed(2)
    }));
};

/**
 * Export all worksheet integration functions
 */
export default {
    getProductionFromWorksheets,
    getDowntimeFromWorksheets,
    getPerformanceFromWorksheets,
    getOEEFromWorksheets,
    getMachineUtilizationFromWorksheets
};
