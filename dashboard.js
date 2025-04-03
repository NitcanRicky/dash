// Dashboard Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Show loading overlay
    showLoadingOverlay();
    
    // Check if data is already loaded
    if (DATA.sales.length === 0) {
        // If data not loaded yet, wait a moment for data.js to finish
        setTimeout(() => {
            // Initialize data with default date range (30 days)
            initializeDashboard();
            
            // Event Listeners
            initializeEventListeners();
        }, 500);
    } else {
        // Data already loaded, proceed with initialization
        initializeDashboard();
        
        // Event Listeners
        initializeEventListeners();
    }
});

// Global state for dashboard
const dashboardState = {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    currentSection: 'overview',
    theme: 'light',
    salesTrendView: 'daily',
    categoryChartType: 'pie',
    topProductsCount: 10,
    forecastDays: 30,
    demographicFilter: 'age',
    cityDemographicFilter: 'age',
    productTimeView: 'category',
    segmentationAxis: 'purchase',
    anomalyType: 'sales'
};

// Chart objects for later reference and updating
const charts = {};

// Initialize Dashboard with data
function initializeDashboard() {
    // Set default date range in UI
    document.getElementById('start-date').valueAsDate = dashboardState.startDate;
    document.getElementById('end-date').valueAsDate = dashboardState.endDate;
    
    // Load dashboard data and render sections
    loadDashboardData().then(() => {
        // Initialize products section even if not visible initially
        renderProductsSection();
        
        // Hide loading overlay after everything is loaded
        hideLoadingOverlay();
    }).catch(error => {
        showNotification('error', 'Error Loading Data', error.message);
        hideLoadingOverlay();
    });
}

// Load data and render dashboard sections
async function loadDashboardData() {
    try {
        // Check if DataService is available
        if (typeof DataService === 'undefined') {
            throw new Error('DataService is not defined. Please make sure data.js is loaded correctly.');
        }
        
        // Render each section (the active one will be visible)
        renderOverviewSection();
        renderCustomersSection();
        renderProductsSection();
        renderGeographySection();
        
        // Only render predictions section if it hasn't been initialized yet
        const predictionsSection = document.querySelector('#predictions');
        if (predictionsSection && !predictionsSection.hasAttribute('data-initialized')) {
            renderPredictionsSection();
            predictionsSection.setAttribute('data-initialized', 'true');
        }
        
        // Show notification
        showNotification('success', 'Data Loaded', 'Dashboard data has been updated.');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        throw error;
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    // Navigation menu
    document.querySelectorAll('.sidebar nav ul li').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('change', function() {
        toggleTheme(this.checked);
    });
    
    // Time range selector
    document.getElementById('time-range').addEventListener('change', function() {
        updateTimeRange(this.value);
    });
    
    // Custom date range toggle
    document.getElementById('date-picker-toggle').addEventListener('click', function() {
        toggleCustomDateRange();
    });
    
    // Apply custom date range
    document.getElementById('apply-date-range').addEventListener('click', function() {
        applyCustomDateRange();
    });
    
    // Export button
    document.getElementById('export-data').addEventListener('click', function() {
        showExportModal();
    });
    
    // Close modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        hideExportModal();
    });
    
    // Cancel export
    document.getElementById('cancel-export').addEventListener('click', function() {
        hideExportModal();
    });
    
    // Confirm export
    document.getElementById('confirm-export').addEventListener('click', function() {
        exportDashboardData();
    });
    
    // Sales trend view controls
    document.querySelectorAll('.chart-control[data-view]').forEach(button => {
        button.addEventListener('click', function() {
            updateSalesTrendView(this.getAttribute('data-view'));
        });
    });
    
    // Category chart type selector
    document.getElementById('category-chart-view').addEventListener('change', function() {
        updateCategoryChartType(this.value);
    });
    
    // Top products count selector
    document.getElementById('top-products-count').addEventListener('change', function() {
        updateTopProductsCount(parseInt(this.value));
    });
    
    // Demographic filter selector
    document.getElementById('demographic-filter').addEventListener('change', function() {
        updateDemographicFilter(this.value);
    });
    
    // City demographic filter selector
    document.getElementById('city-demographic-filter').addEventListener('change', function() {
        updateCityDemographicFilter(this.value);
    });
    
    // Forecast timeframe selector
    document.getElementById('forecast-timeframe').addEventListener('change', function() {
        updateForecastTimeframe(parseInt(this.value));
    });
    
    // Product time view selector
    document.getElementById('product-time-view').addEventListener('change', function() {
        updateProductTimeView(this.value);
    });
    
    // Cross-Category Sales visualization controls
    const categoryCorrelationControls = document.querySelectorAll('#products .chart-header .chart-control[data-view="force"]');
    if (categoryCorrelationControls.length) {
        categoryCorrelationControls.forEach(button => {
            button.addEventListener('click', function() {
                renderCategoryCorrelation(); // Re-render the visualization
            });
        });
    }
    
    // Segmentation controls
    document.querySelectorAll('.segment-control[data-axis]').forEach(button => {
        button.addEventListener('click', function() {
            updateSegmentationAxis(this.getAttribute('data-axis'));
        });
    });
    
    // Anomaly controls
    document.querySelectorAll('.anomaly-control[data-type]').forEach(button => {
        button.addEventListener('click', function() {
            updateAnomalyType(this.getAttribute('data-type'));
        });
    });
}

// Switch between dashboard sections
function switchSection(section) {
    // Update active nav item
    document.querySelectorAll('.sidebar nav ul li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.sidebar nav ul li[data-section="${section}"]`).classList.add('active');
    
    // Hide all sections and show selected one
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');
    
    // Update state
    dashboardState.currentSection = section;
    
    // Re-render specific visualizations for the section
    if (section === 'customers') {
        // Make sure customer segmentation is properly rendered
        setTimeout(() => renderCustomerSegmentation(), 0);
    }
}

// Toggle light/dark theme
function toggleTheme(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        dashboardState.theme = 'dark';
    } else {
        document.documentElement.removeAttribute('data-theme');
        dashboardState.theme = 'light';
    }
    
    // Update all charts with new theme
    updateChartsTheme();
}

// Update charts for the new theme
function updateChartsTheme() {
    // Get theme colors
    const isDark = dashboardState.theme === 'dark';
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
    
    // Update each chart
    Object.values(charts).forEach(chart => {
        if (chart && chart.options) {
            // Update scales grid colors
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    if (scale.grid) scale.grid.color = gridColor;
                    if (scale.ticks) scale.ticks.color = textColor;
                });
            }
            
            // Update title and legend text color
            if (chart.options.plugins && chart.options.plugins.title) {
                chart.options.plugins.title.color = textColor;
            }
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            chart.update();
        }
    });
    
    // Re-render D3 charts
    if (dashboardState.currentSection === 'products') {
        renderProductTreemap();
        renderCategoryCorrelation();
    } else if (dashboardState.currentSection === 'customers') {
        renderCustomerSegmentation();
    } else if (dashboardState.currentSection === 'geography') {
        renderStayDurationChart();
        renderGeoHeatmap();
    }
}

// Update time range based on select value
function updateTimeRange(days) {
    const end = new Date();
    const start = new Date(new Date().setDate(end.getDate() - parseInt(days)));
    
    dashboardState.startDate = start;
    dashboardState.endDate = end;
    
    // Update date inputs
    document.getElementById('start-date').valueAsDate = start;
    document.getElementById('end-date').valueAsDate = end;
    
    // Reload dashboard with new date range
    showLoadingOverlay();
    loadDashboardData().then(() => {
        hideLoadingOverlay();
    });
}

// Toggle custom date range inputs visibility
function toggleCustomDateRange() {
    const customRange = document.getElementById('custom-date-range');
    customRange.classList.toggle('hidden');
}

// Apply custom date range from inputs
function applyCustomDateRange() {
    const startDate = document.getElementById('start-date').valueAsDate;
    const endDate = document.getElementById('end-date').valueAsDate;
    
    if (!startDate || !endDate) {
        showNotification('error', 'Invalid Date Range', 'Please select both start and end dates.');
        return;
    }
    
    if (startDate > endDate) {
        showNotification('error', 'Invalid Date Range', 'Start date cannot be after end date.');
        return;
    }
    
    dashboardState.startDate = startDate;
    dashboardState.endDate = endDate;
    
    // Hide custom range panel
    document.getElementById('custom-date-range').classList.add('hidden');
    
    // Reload dashboard with new date range
    showLoadingOverlay();
    loadDashboardData().then(() => {
        hideLoadingOverlay();
    });
}

// Show export modal
function showExportModal() {
    document.getElementById('export-modal').classList.add('active');
}

// Hide export modal
function hideExportModal() {
    document.getElementById('export-modal').classList.remove('active');
}

// Export dashboard data based on selected options
function exportDashboardData() {
    // Get selected sections to export
    const sections = [];
    if (document.getElementById('export-overview').checked) sections.push('overview');
    if (document.getElementById('export-customers').checked) sections.push('customers');
    if (document.getElementById('export-products').checked) sections.push('products');
    if (document.getElementById('export-geography').checked) sections.push('geography');
    if (document.getElementById('export-predictions').checked) sections.push('predictions');
    
    // Get format
    let format = 'csv';
    if (document.getElementById('format-excel').checked) format = 'excel';
    if (document.getElementById('format-pdf').checked) format = 'pdf';
    
    // Mock export functionality
    showNotification('info', 'Export Started', `Exporting ${sections.join(', ')} data in ${format.toUpperCase()} format...`);
    
    // Simulate export process
    setTimeout(() => {
        hideExportModal();
        showNotification('success', 'Export Complete', `Dashboard data has been exported in ${format.toUpperCase()} format.`);
    }, 1500);
}

// Update sales trend view (daily, weekly, monthly)
function updateSalesTrendView(view) {
    // Update UI
    document.querySelectorAll('.chart-control[data-view]').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.chart-control[data-view="${view}"]`).classList.add('active');
    
    // Update state
    dashboardState.salesTrendView = view;
    
    // Update chart
    updateSalesTrendChart();
}

// Update category chart type (pie, bar)
function updateCategoryChartType(type) {
    dashboardState.categoryChartType = type;
    updateCategorySalesChart();
}

// Update top products count
function updateTopProductsCount(count) {
    dashboardState.topProductsCount = count;
    updateTopProductsChart();
}

// Update demographic filter
function updateDemographicFilter(filter) {
    dashboardState.demographicFilter = filter;
    updateDemographicPurchasesChart();
}

// Update city demographic filter
function updateCityDemographicFilter(filter) {
    dashboardState.cityDemographicFilter = filter;
    updateCityDemographicChart();
}

// Update forecast timeframe
function updateForecastTimeframe(days) {
    dashboardState.forecastDays = days;
    updateSalesForecastChart();
}

// Update product time view
function updateProductTimeView(view) {
    dashboardState.productTimeView = view;
    updateProductTimeChart();
}

// Update segmentation axis
function updateSegmentationAxis(axis) {
    // Update UI
    document.querySelectorAll('.segment-control[data-axis]').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.segment-control[data-axis="${axis}"]`).classList.add('active');
    
    dashboardState.segmentationAxis = axis;
    renderCustomerSegmentation();
}

// Update anomaly type
function updateAnomalyType(type) {
    // Update UI
    document.querySelectorAll('.anomaly-control[data-type]').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.anomaly-control[data-type="${type}"]`).classList.add('active');
    
    dashboardState.anomalyType = type;
    updateAnomalyDetectionChart();
}

// Show loading overlay
function showLoadingOverlay() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

// Hide loading overlay
function hideLoadingOverlay() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

// Show notification
function showNotification(type, title, message) {
    const container = document.getElementById('notification-container');
    const id = 'notification-' + Date.now();
    
    const notification = document.createElement('div');
    notification.id = id;
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <div class="notification-close">&times;</div>
    `;
    
    container.appendChild(notification);
    
    // Add event listener to close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        removeNotification(id);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        removeNotification(id);
    }, 5000);
}

// Remove notification by ID
function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.add('exiting');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300); // Match the CSS animation duration
    }
}

// Get chart colors from CSS variable
function getChartColors() {
    const colors = getComputedStyle(document.documentElement)
        .getPropertyValue('--chart-colors')
        .split(',')
        .map(color => color.trim());
    return colors;
}

// Get text color from current theme
function getTextColor() {
    return getComputedStyle(document.documentElement)
        .getPropertyValue('--text-primary')
        .trim();
}

// Get grid color from current theme
function getGridColor() {
    return getComputedStyle(document.documentElement)
        .getPropertyValue('--border-color')
        .trim();
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);
}

// Format percentage
function formatPercentage(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value / 100);
}

// Format numbers with comma separators
function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

// Calculate percentage change
function calculatePercentChange(current, previous) {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
}

// Update chart configuration for current theme
function applyChartStyle(config) {
    const textColor = getTextColor();
    const gridColor = getGridColor();
    
    // Apply to scales if they exist
    if (config.options && config.options.scales) {
        Object.values(config.options.scales).forEach(scale => {
            if (scale.grid) scale.grid.color = gridColor;
            if (scale.ticks) scale.ticks.color = textColor;
        });
    }
    
    // Apply to plugins if they exist
    if (config.options && config.options.plugins) {
        if (config.options.plugins.title) {
            config.options.plugins.title.color = textColor;
        }
        if (config.options.plugins.legend) {
            config.options.plugins.legend.labels = config.options.plugins.legend.labels || {};
            config.options.plugins.legend.labels.color = textColor;
        }
    }
    
    return config;
}

// Section rendering functions
function renderOverviewSection() {
    updateKPICards();
    updateSalesTrendChart();
    updateCategorySalesChart();
    updateTopProductsChart();
}

function renderCustomersSection() {
    updateAgeDistributionChart();
    updateGenderDistributionChart();
    
    // Ensure the customer segmentation is properly initialized
    // Use setTimeout to let the DOM fully render first
    setTimeout(() => renderCustomerSegmentation(), 0);
    
    updateDemographicPurchasesChart();
}

function renderProductsSection() {
    // Use setTimeout to ensure the DOM elements are fully rendered and have dimensions
    setTimeout(() => {
        renderProductTreemap();
        renderCategoryCorrelation();
    }, 50);
    
    updatePriceRangeChart();
    updateProductTimeChart();
}

function renderGeographySection() {
    updateCitySalesChart();
    renderStayDurationChart();
    updateCityDemographicChart();
    renderGeoHeatmap();
}

function renderPredictionsSection() {
    const container = document.querySelector('#predictions');
    if (!container || container.hasAttribute('data-initialized')) return;

    // Create controls for forecast variables
    const controlsHtml = `
        <div class="forecast-controls">
            <div class="control-group">
                <label style="color: var(--text-primary);">Marketing Spend Impact:</label>
                <input type="range" id="marketing-impact" min="0" max="200" step="10" value="100">
                <span class="value-display" style="color: var(--text-primary);">100%</span>
            </div>
            <div class="control-group">
                <label style="color: var(--text-primary);">Growth Rate:</label>
                <input type="range" id="growth-rate" min="-50" max="50" step="5" value="0">
                <span class="value-display" style="color: var(--text-primary);">0%</span>
            </div>
            <div class="control-group">
                <label style="color: var(--text-primary);">Product Pricing:</label>
                <select id="pricing-strategy" style="color: var(--text-primary); background: var(--card-bg);">
                    <option value="normal">Normal Pricing</option>
                    <option value="premium">Premium (+20%)</option>
                    <option value="discount">Discount (-20%)</option>
                </select>
            </div>
            <div class="control-group">
                <label style="color: var(--text-primary);">Customer Retention:</label>
                <select id="retention-rate" style="color: var(--text-primary); background: var(--card-bg);">
                    <option value="high">High (90%)</option>
                    <option value="medium" selected>Medium (75%)</option>
                    <option value="low">Low (60%)</option>
                </select>
            </div>
        </div>
        <div class="charts-container">
            <div class="chart-wrapper">
                <h3>Sales Forecast</h3>
                <canvas id="sales-forecast-chart"></canvas>
            </div>
        </div>
    `;

    container.innerHTML = controlsHtml;

    // Initialize event listeners for controls
    document.getElementById('marketing-impact').addEventListener('input', function(e) {
        e.target.nextElementSibling.textContent = e.target.value + '%';
        updatePredictions();
    });

    document.getElementById('growth-rate').addEventListener('input', function(e) {
        e.target.nextElementSibling.textContent = e.target.value + '%';
        updatePredictions();
    });

    document.getElementById('pricing-strategy').addEventListener('change', updatePredictions);
    document.getElementById('retention-rate').addEventListener('change', updatePredictions);

    // Initial render
    updatePredictions();
}

function updatePredictions() {
    updateSalesForecastChart();
}

function updateSalesForecastChart() {
    const canvas = document.getElementById('sales-forecast-chart');
    if (!canvas) return;

    // Get the raw marketing impact value (0-200%)
    const rawMarketingImpact = parseFloat(document.getElementById('marketing-impact').value) / 100;
    
    // Apply diminishing returns to marketing impact
    // Using a modified logarithmic function for diminishing returns
    // When marketing spend is reduced (< 100%), the impact decreases more gradually
    // When marketing spend is increased (> 100%), the impact increases with diminishing returns
    let marketingImpact;
    if (rawMarketingImpact <= 1) {
        // For decreased marketing spend (0-100%)
        // Using square root function for more gradual decrease
        marketingImpact = Math.sqrt(rawMarketingImpact);
    } else {
        // For increased marketing spend (100-200%)
        // Using logarithmic function for diminishing returns
        // log(x + 1) where x is the percentage above 100%
        const extraSpend = rawMarketingImpact - 1; // How much above 100%
        marketingImpact = 1 + Math.log(extraSpend + 1) / Math.log(2);
    }

    const growthRate = parseFloat(document.getElementById('growth-rate').value) / 100;
    const pricingStrategy = document.getElementById('pricing-strategy').value;
    const retentionRate = document.getElementById('retention-rate').value;

    // Get historical sales data from the last 90 days using DataService
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    const historicalData = DataService.getSalesByDay(startDate, new Date());
    
    // Calculate baseline metrics
    const avgDailySales = historicalData.reduce((sum, day) => sum + day.total, 0) / historicalData.length;
    const stdDev = Math.sqrt(historicalData.reduce((sum, day) => {
        return sum + Math.pow(day.total - avgDailySales, 2);
    }, 0) / historicalData.length);

    // Generate forecast data
    const dates = [];
    const actualValues = [];
    const forecastValues = [];
    const upperBound = [];
    const lowerBound = [];

    // Include last 30 days of historical data
    const last30Days = historicalData.slice(-30);
    last30Days.forEach(day => {
        dates.push(new Date(day.date));
        actualValues.push(day.total);
        forecastValues.push(null);
        upperBound.push(null);
        lowerBound.push(null);
    });

    // Generate forecast
    const lastDate = dates[dates.length - 1];
    let lastValue = actualValues[actualValues.length - 1];

    // Apply pricing strategy multiplier
    let pricingMultiplier = 1;
    switch(pricingStrategy) {
        case 'premium': pricingMultiplier = 1.2; break;
        case 'discount': pricingMultiplier = 0.8; break;
    }

    // Apply retention rate impact
    let retentionMultiplier = 1;
    switch(retentionRate) {
        case 'high': retentionMultiplier = 1.1; break;
        case 'low': retentionMultiplier = 0.9; break;
    }

    // Monthly seasonality factors (based on historical retail patterns)
    const monthlySeasonality = {
        0: 0.8,  // January (Post-holiday drop)
        1: 0.7,  // February
        2: 0.9,  // March (Spring shopping)
        3: 1.0,  // April
        4: 1.1,  // May (Mother's Day)
        5: 1.2,  // June (Summer start)
        6: 1.3,  // July (Summer sales)
        7: 1.25, // August (Back to school)
        8: 1.0,  // September
        9: 1.1,  // October (Early holiday shopping)
        10: 1.4, // November (Black Friday)
        11: 1.6  // December (Holiday season)
    };

    // Holiday events and their impact factors
    const holidays = [
        { month: 1, day: 1, name: "New Year's Day", factor: 0.7 },
        { month: 2, day: 14, name: "Valentine's Day", factor: 1.4 },
        { month: 5, day: 10, name: "Mother's Day", factor: 1.5 }, // Approximate date
        { month: 6, day: 20, name: "Father's Day", factor: 1.3 }, // Approximate date
        { month: 11, day: 25, name: "Black Friday", factor: 2.5 },
        { month: 11, day: 28, name: "Cyber Monday", factor: 2.0 }, // Approximate date
        { month: 12, day: 24, name: "Christmas Eve", factor: 2.0 },
        { month: 12, day: 26, name: "After Christmas", factor: 1.8 }
    ];

    for (let i = 1; i <= 30; i++) {
        const forecastDate = new Date(lastDate);
        forecastDate.setDate(forecastDate.getDate() + i);
        dates.push(forecastDate);
        
        // Apply weekly seasonality
        const dayOfWeek = forecastDate.getDay();
        let seasonalFactor = 1;
        
        // Weekly patterns
        switch(dayOfWeek) {
            case 0: // Sunday
                seasonalFactor = 0.8;
                break;
            case 6: // Saturday
                seasonalFactor = 1.3;
                break;
            case 5: // Friday
                seasonalFactor = 1.4;
                break;
            default: // Mon-Thu
                seasonalFactor = 1;
        }

        // Apply monthly seasonality
        const monthFactor = monthlySeasonality[forecastDate.getMonth()];
        seasonalFactor *= monthFactor;

        // Check for holidays and apply their impact
        const month = forecastDate.getMonth() + 1;
        const day = forecastDate.getDate();
        const holiday = holidays.find(h => h.month === month && h.day === day);
        if (holiday) {
            seasonalFactor *= holiday.factor;
        }

        // Apply marketing impact
        seasonalFactor *= marketingImpact;
        
        // Calculate forecast value with compound growth and all factors
        const timeFactor = Math.pow(1 + growthRate, i / 365); // Annualized growth rate
        const forecastValue = lastValue * seasonalFactor * pricingMultiplier * retentionMultiplier * timeFactor;
        
        actualValues.push(null);
        forecastValues.push(forecastValue);
        upperBound.push(forecastValue * (1 + stdDev/avgDailySales));
        lowerBound.push(forecastValue * (1 - stdDev/avgDailySales));
        
        // Update last value for next iteration
        lastValue = forecastValue;
    }

    const config = {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Historical Sales',
                    data: actualValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: false
                },
                {
                    label: 'Forecast',
                    data: forecastValues,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Upper Bound',
                    data: upperBound,
                    borderColor: 'rgba(255, 159, 64, 0.2)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Lower Bound',
                    data: lowerBound,
                    borderColor: 'rgba(255, 159, 64, 0.2)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM d'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Sales Amount ($)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    position: 'top'
                }
            }
        }
    };

    // Apply theme-specific styling
    applyChartStyle(config);

    // Create or update chart
    if (charts.salesForecast) {
        charts.salesForecast.data = config.data;
        charts.salesForecast.options = config.options;
        charts.salesForecast.update();
    } else {
        charts.salesForecast = new Chart(canvas, config);
    }
}

function updateCustomerLTVChart() {
    const canvas = document.getElementById('customer-ltv-chart');
    if (!canvas) return;

    const growthRate = parseFloat(document.getElementById('growth-rate').value) / 100;
    const marketCondition = document.getElementById('market-condition').value;

    // Calculate customer segments based on historical data
    const customerSegments = [
        { name: 'High Value', ltv: 5000 * (1 + growthRate) },
        { name: 'Medium Value', ltv: 2500 * (1 + growthRate) },
        { name: 'Low Value', ltv: 1000 * (1 + growthRate) }
    ];

    // Apply market condition adjustments
    const marketFactor = marketCondition === 'boom' ? 1.2 : (marketCondition === 'recession' ? 0.8 : 1);
    customerSegments.forEach(segment => segment.ltv *= marketFactor);

    const config = {
        type: 'bar',
        data: {
            labels: customerSegments.map(s => s.name),
            datasets: [{
                label: 'Predicted Lifetime Value',
                data: customerSegments.map(s => s.ltv),
                backgroundColor: getChartColors(),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Customer LTV ($)'
                    }
                }
            }
        }
    };

    // Apply theme-specific styling
    applyChartStyle(config);

    // Create or update chart
    if (charts.customerLTV) {
        charts.customerLTV.data = config.data;
        charts.customerLTV.options = config.options;
        charts.customerLTV.update();
    } else {
        charts.customerLTV = new Chart(canvas, config);
    }
}

function updateChurnRiskChart() {
    const canvas = document.getElementById('churn-risk-chart');
    if (!canvas) return;

    const marketCondition = document.getElementById('market-condition').value;
    
    // Calculate risk factors based on market conditions
    const baseChurnRisk = marketCondition === 'recession' ? 0.25 : (marketCondition === 'boom' ? 0.15 : 0.2);
    
    const riskCategories = [
        { name: 'High Risk', percentage: baseChurnRisk + 0.1 },
        { name: 'Medium Risk', percentage: baseChurnRisk },
        { name: 'Low Risk', percentage: baseChurnRisk - 0.1 }
    ];

    const config = {
        type: 'doughnut',
        data: {
            labels: riskCategories.map(c => c.name),
            datasets: [{
                data: riskCategories.map(c => c.percentage * 100),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    };

    // Apply theme-specific styling
    applyChartStyle(config);

    // Create or update chart
    if (charts.churnRisk) {
        charts.churnRisk.data = config.data;
        charts.churnRisk.options = config.options;
        charts.churnRisk.update();
    } else {
        charts.churnRisk = new Chart(canvas, config);
    }
}

// KPI Card Updates
function updateKPICards() {
    // Get data from two periods to calculate changes
    const currentPeriodSales = DataService.getSales(dashboardState.startDate, dashboardState.endDate);
    
    // Calculate previous period of same length
    const periodLength = dashboardState.endDate - dashboardState.startDate;
    const previousPeriodEnd = new Date(dashboardState.startDate);
    const previousPeriodStart = new Date(previousPeriodEnd);
    previousPeriodStart.setTime(previousPeriodStart.getTime() - periodLength);
    
    const previousPeriodSales = DataService.getSales(previousPeriodStart, previousPeriodEnd);
    
    // Total Sales
    const currentTotalSales = currentPeriodSales.reduce((sum, sale) => sum + sale.purchase_amount, 0);
    const previousTotalSales = previousPeriodSales.reduce((sum, sale) => sum + sale.purchase_amount, 0);
    const salesChange = calculatePercentChange(currentTotalSales, previousTotalSales);
    
    document.querySelector('#total-sales .kpi-value').textContent = formatCurrency(currentTotalSales);
    document.querySelector('#total-sales .kpi-change').textContent = 
        `${salesChange >= 0 ? '+' : ''}${salesChange.toFixed(1)}% `;
    document.querySelector('#total-sales .kpi-change').appendChild(
        document.createElement('span')
    ).textContent = 'vs last period';
    document.querySelector('#total-sales .kpi-change').className = 
        `kpi-change ${salesChange < 0 ? 'negative' : ''}`;
    
    // Average Order Value
    const currentAvgOrder = currentPeriodSales.length ? 
        currentTotalSales / currentPeriodSales.length : 0;
    const previousAvgOrder = previousPeriodSales.length ? 
        previousPeriodSales.reduce((sum, sale) => sum + sale.purchase_amount, 0) / previousPeriodSales.length : 0;
    const avgOrderChange = calculatePercentChange(currentAvgOrder, previousAvgOrder);
    
    document.querySelector('#avg-order .kpi-value').textContent = formatCurrency(currentAvgOrder);
    document.querySelector('#avg-order .kpi-change').textContent = 
        `${avgOrderChange >= 0 ? '+' : ''}${avgOrderChange.toFixed(1)}% `;
    document.querySelector('#avg-order .kpi-change').appendChild(
        document.createElement('span')
    ).textContent = 'vs last period';
    document.querySelector('#avg-order .kpi-change').className = 
        `kpi-change ${avgOrderChange < 0 ? 'negative' : ''}`;
    
    // Customer Count (unique customers)
    const currentCustomers = new Set(currentPeriodSales.map(sale => sale.user_id)).size;
    const previousCustomers = new Set(previousPeriodSales.map(sale => sale.user_id)).size;
    const customerChange = calculatePercentChange(currentCustomers, previousCustomers);
    
    document.querySelector('#customer-count .kpi-value').textContent = formatNumber(currentCustomers);
    document.querySelector('#customer-count .kpi-change').textContent = 
        `${customerChange >= 0 ? '+' : ''}${customerChange.toFixed(1)}% `;
    document.querySelector('#customer-count .kpi-change').appendChild(
        document.createElement('span')
    ).textContent = 'vs last period';
    document.querySelector('#customer-count .kpi-change').className = 
        `kpi-change ${customerChange < 0 ? 'negative' : ''}`;
    
    // Conversion Rate (mocked as we don't have visit data)
    const currentConversion = 2.5 + Math.random();
    const previousConversion = 2.3 + Math.random();
    const conversionChange = calculatePercentChange(currentConversion, previousConversion);
    
    document.querySelector('#conversion-rate .kpi-value').textContent = `${currentConversion.toFixed(1)}%`;
    document.querySelector('#conversion-rate .kpi-change').textContent = 
        `${conversionChange >= 0 ? '+' : ''}${conversionChange.toFixed(1)}% `;
    document.querySelector('#conversion-rate .kpi-change').appendChild(
        document.createElement('span')
    ).textContent = 'vs last period';
    document.querySelector('#conversion-rate .kpi-change').className = 
        `kpi-change ${conversionChange < 0 ? 'negative' : ''}`;
}

// Sales Trend Chart
function updateSalesTrendChart() {
    const canvas = document.getElementById('sales-trend-chart');
    
    // Get data based on view (daily, weekly, monthly)
    let salesData;
    let timeUnit;
    
    switch (dashboardState.salesTrendView) {
        case 'weekly':
            salesData = DataService.getSalesByWeek(dashboardState.startDate, dashboardState.endDate);
            timeUnit = 'week';
            break;
        case 'monthly':
            salesData = DataService.getSalesByMonth(dashboardState.startDate, dashboardState.endDate);
            timeUnit = 'month';
            break;
        case 'daily':
        default:
            salesData = DataService.getSalesByDay(dashboardState.startDate, dashboardState.endDate);
            timeUnit = 'day';
            break;
    }
    
    // Prepare chart data
    const labels = salesData.map(item => {
        if (timeUnit === 'month') return item.month;
        if (timeUnit === 'week') return item.week;
        return item.date;
    });
    
    const data = salesData.map(item => item.total);
    const counts = salesData.map(item => item.count);
    
    // Chart configuration
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Sales Amount',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderColor: '#4361ee',
                    borderWidth: 2,
                    data: data,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Order Count',
                    backgroundColor: 'transparent',
                    borderColor: '#f72585',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    data: counts,
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: timeUnit === 'day' || timeUnit === 'week' ? 'time' : 'category',
                    time: {
                        unit: timeUnit,
                        tooltipFormat: timeUnit === 'day' ? 'MMM d, yyyy' : timeUnit === 'week' ? 'wo, yyyy' : 'MMM yyyy'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false,
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.datasetIndex === 0) {
                                label += formatCurrency(context.parsed.y);
                            } else {
                                label += formatNumber(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
        }
    };
    
    // Apply theme-specific styling
    applyChartStyle(config);
    
    // Create or update chart
    if (charts.salesTrend) {
        charts.salesTrend.data = config.data;
        charts.salesTrend.options = config.options;
        charts.salesTrend.update();
    } else {
        charts.salesTrend = new Chart(canvas, config);
    }
}

// Category Sales Chart (Pie or Bar)
function updateCategorySalesChart() {
    const canvas = document.getElementById('category-sales-chart');
    const categorySales = DataService.getSalesByCategory(dashboardState.startDate, dashboardState.endDate);
    const chartColors = getChartColors();
    
    // Sort by total sales
    categorySales.sort((a, b) => b.total - a.total);
    
    // Prepare chart data
    const labels = categorySales.map(cat => cat.name);
    const data = categorySales.map(cat => cat.total);
    
    let config;
    
    if (dashboardState.categoryChartType === 'pie') {
        config = {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: chartColors.slice(0, categorySales.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.parsed;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };
    } else { // Bar chart
        config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales by Category',
                    data: data,
                    backgroundColor: chartColors[0],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0',
                            drawBorder: false,
                        },
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatCurrency(context.parsed.x);
                            }
                        }
                    }
                }
            }
        };
    }
    
    // Apply theme-specific styling
    applyChartStyle(config);
    
    // Destroy existing chart if type has changed
    if (charts.categorySales && charts.categorySales.config.type !== config.type) {
        charts.categorySales.destroy();
        charts.categorySales = null;
    }
    
    // Create or update chart
    if (charts.categorySales) {
        charts.categorySales.data = config.data;
        charts.categorySales.options = config.options;
        charts.categorySales.update();
    } else {
        charts.categorySales = new Chart(canvas, config);
    }
}

// Top Products Chart
function updateTopProductsChart() {
    const canvas = document.getElementById('top-products-chart');
    
    // Get top products from data service
    const topProducts = DataService.getTopProducts(dashboardState.startDate, dashboardState.endDate, dashboardState.topProductsCount);
    
    // Prepare chart data
    const labels = topProducts.map(product => product.name);
    const data = topProducts.map(product => product.total);
    const backgroundColors = getChartColors();
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales',
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${formatCurrency(context.raw)}`;
                        },
                        afterLabel: function(context) {
                            const product = topProducts[context.dataIndex];
                            return `Category: ${product.category}`;
                        }
                    }
                }
            },
            // Add layout option to constrain the chart size
            layout: {
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            }
        }
    };
    
    // Apply theme-specific styling
    applyChartStyle(config);
    
    // Create or update chart
    if (charts.topProducts) {
        charts.topProducts.data = config.data;
        charts.topProducts.options = config.options;
        charts.topProducts.update();
    } else {
        charts.topProducts = new Chart(canvas, config);
    }
    
    // Add resize handler to handle window resizing
    const resizeChart = debounce(() => {
        if (charts.topProducts) {
            charts.topProducts.resize();
        }
    }, 250);
    
    window.addEventListener('resize', resizeChart);
}

// Age Distribution Chart
function updateAgeDistributionChart() {
    const canvas = document.getElementById('age-distribution-chart');
    const ageDistribution = DataService.getAgeDistribution(dashboardState.startDate, dashboardState.endDate);
    
    // Prepare chart data
    const labels = ageDistribution.map(item => item.age_group);
    const data = ageDistribution.map(item => item.count);
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Customers',
                data: data,
                backgroundColor: getChartColors()[2],
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false,
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
    
    // Apply theme-specific styling
    applyChartStyle(config);
    
    // Create or update chart
    if (charts.ageDistribution) {
        charts.ageDistribution.data = config.data;
        charts.ageDistribution.options = config.options;
        charts.ageDistribution.update();
    } else {
        charts.ageDistribution = new Chart(canvas, config);
    }
}

// Gender Distribution Chart
function updateGenderDistributionChart() {
    const canvas = document.getElementById('gender-distribution-chart');
    const genderDistribution = DataService.getGenderDistribution(dashboardState.startDate, dashboardState.endDate);
    
    // Prepare chart data
    const labels = genderDistribution.map(item => item.gender);
    const data = genderDistribution.map(item => item.count);
    const chartColors = [getChartColors()[0], getChartColors()[1]];
    
    // Chart configuration
    const config = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: chartColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const value = context.parsed;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    };
    
    // Apply theme-specific styling
    applyChartStyle(config);
    
    // Create or update chart
    if (charts.genderDistribution) {
        charts.genderDistribution.data = config.data;
        charts.genderDistribution.options = config.options;
        charts.genderDistribution.update();
    } else {
        charts.genderDistribution = new Chart(canvas, config);
    }
}

// D3.js Customer Segmentation Chart
function renderCustomerSegmentation() {
    const container = document.getElementById('customer-segmentation-chart');
    if (!container) return; // Safety check in case the container doesn't exist yet
    
    container.innerHTML = ''; // Clear container
    
    const width = container.clientWidth;
    const height = container.clientHeight || 400; // Provide a fallback height if clientHeight is 0
    
    // Increased margins to provide more space for labels
    const margin = { top: 30, right: 120, bottom: 50, left: 60 };
    
    // Define customer segments
    const segments = [
        { name: "High Value", color: getChartColors()[0] },
        { name: "Loyal", color: getChartColors()[2] },
        { name: "Promising", color: getChartColors()[3] },
        { name: "At Risk", color: getChartColors()[1] }
    ];
    
    // Create more realistic data with actual segment logic
    const data = [];
    
    // High Value - high purchase and high CLV (mostly top right)
    for (let i = 0; i < 50; i++) {
        data.push({
            id: data.length,
            x: 0.7 + (Math.random() * 0.3), // Purchase amount (high)
            y: 0.7 + (Math.random() * 0.3), // CLV (high)
            size: 6 + Math.random() * 2, // More consistent sizes
            segment: 0 // High Value
        });
    }
    
    // Loyal - moderate purchase and high-moderate CLV (middle-top area)
    for (let i = 0; i < 60; i++) {
        data.push({
            id: data.length,
            x: 0.3 + (Math.random() * 0.5), // Purchase amount (moderate)
            y: 0.5 + (Math.random() * 0.4), // CLV (high-moderate)
            size: 6 + Math.random() * 2, // More consistent sizes
            segment: 1 // Loyal
        });
    }
    
    // Promising - low-moderate purchase but good CLV potential (bottom-right area)
    for (let i = 0; i < 40; i++) {
        data.push({
            id: data.length,
            x: 0.4 + (Math.random() * 0.4), // Purchase amount (low-moderate)
            y: 0.1 + (Math.random() * 0.4), // CLV (moderate)
            size: 6 + Math.random() * 2, // More consistent sizes
            segment: 2 // Promising
        });
    }
    
    // At Risk - various purchase levels but low CLV (left area)
    for (let i = 0; i < 30; i++) {
        data.push({
            id: data.length,
            x: Math.random() * 0.4, // Purchase amount (varied but often low)
            y: 0.2 + (Math.random() * 0.5), // CLV (low-moderate)
            size: 6 + Math.random() * 2, // More consistent sizes
            segment: 3 // At Risk
        });
    }
    
    // Add some noise and outliers
    for (let i = 0; i < 20; i++) {
        const segment = Math.floor(Math.random() * segments.length);
        data.push({
            id: data.length,
            x: Math.random(),
            y: Math.random(),
            size: 4 + Math.random() * 2, // More consistent sizes
            segment: segment
        });
    }
    
    // Create a responsive SVG container with viewBox
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Create scales
    const xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([margin.left, width - margin.right]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height - margin.bottom, margin.top]);
    
    // Format function for tick labels
    const formatAxisLabel = d => (d * 100).toFixed(0) + '%';
    
    // Add X axis with visible tick labels
    const xAxis = svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale)
            .ticks(5)
            .tickFormat(formatAxisLabel));
    
    // Style the axis lines and ticks
    xAxis.select('.domain').attr('stroke', getGridColor());
    xAxis.selectAll('.tick line').attr('stroke', getGridColor());
    xAxis.selectAll('.tick text').attr('fill', getTextColor()).attr('font-size', '10px');
    
    // Add Y axis with visible tick labels
    const yAxis = svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale)
            .ticks(5)
            .tickFormat(formatAxisLabel));
    
    // Style the axis lines and ticks
    yAxis.select('.domain').attr('stroke', getGridColor());
    yAxis.selectAll('.tick line').attr('stroke', getGridColor());
    yAxis.selectAll('.tick text').attr('fill', getTextColor()).attr('font-size', '10px');
    
    // Add grid lines for better readability
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale)
            .ticks(5)
            .tickSize(-(height - margin.top - margin.bottom))
            .tickFormat(''))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').attr('stroke', getGridColor()).attr('stroke-opacity', 0.2));
    
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale)
            .ticks(5)
            .tickSize(-(width - margin.left - margin.right))
            .tickFormat(''))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').attr('stroke', getGridColor()).attr('stroke-opacity', 0.2));
    
    // Draw circles
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', d => d.size)
        .attr('fill', d => segments[d.segment].color)
        .attr('opacity', 0.85) // Increased opacity for better visibility
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event, d) {
            // Highlight the circle on hover
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke', '#fff')
                .attr('stroke-width', 2)
                .attr('r', d.size * 1.2);
            
            // Create tooltip
            const tooltip = d3.select(container)
                .append('div')
                .attr('class', 'd3-tooltip')
                .style('opacity', 0)
                .style('position', 'absolute')
                .style('pointer-events', 'none');
            
            // Format values for display
            const xValue = (d.x * 100).toFixed(0) + '%';
            const yValue = (d.y * 100).toFixed(0) + '%';
            const segmentName = segments[d.segment].name;
            
            // Populate tooltip content
            tooltip.html(`
                <div><strong>Segment:</strong> ${segmentName}</div>
                <div><strong>${dashboardState.segmentationAxis === 'recency' ? 'Recency' : 
                            dashboardState.segmentationAxis === 'frequency' ? 'Frequency' : 
                            'Purchase Amount'}:</strong> ${xValue}</div>
                <div><strong>Lifetime Value:</strong> ${yValue}</div>
            `);
            
            // Position tooltip near mouse pointer
            tooltip.style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px')
                .transition()
                .duration(200)
                .style('opacity', 1);
            
            // Store tooltip in data for removal on mouseout
            d._tooltip = tooltip;
        })
        .on('mousemove', function(event, d) {
            // Update tooltip position as mouse moves
            if (d._tooltip) {
                d._tooltip
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            }
        })
        .on('mouseout', function(event, d) {
            // Restore circle appearance
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke', '#fff')
                .attr('stroke-width', 0.5)
                .attr('r', d.size);
            
            // Remove tooltip
            if (d._tooltip) {
                d._tooltip.transition()
                    .duration(200)
                    .style('opacity', 0)
                    .remove();
                delete d._tooltip;
            }
        });
    
    // Add X axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10) // Moved up for better visibility
        .attr('text-anchor', 'middle')
        .style('font-size', '14px') // Increased font size
        .style('font-weight', 'bold') // Made text bold
        .style('fill', getTextColor())
        .text(() => {
            switch (dashboardState.segmentationAxis) {
                case 'frequency': return 'Purchase Frequency';
                case 'recency': return 'Purchase Recency';
                default: return 'Purchase Amount';
            }
        });
    
    // Add Y axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(height / 2))
        .attr('y', 20) // Adjusted position for better visibility
        .attr('text-anchor', 'middle')
        .style('font-size', '14px') // Increased font size
        .style('font-weight', 'bold') // Made text bold
        .style('fill', getTextColor())
        .text('Customer Lifetime Value');
    
    // Improved legend with better positioning
    const legendX = width - margin.right + 30; // Position to the right of the chart
    const legendY = margin.top;
    
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${legendX}, ${legendY})`);
    
    // Add legend title
    legend.append('text')
        .attr('x', 0)
        .attr('y', -10)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', getTextColor())
        .text('Customer Segments');
    
    // Add background for better visibility
    legend.append('rect')
        .attr('x', -10)
        .attr('y', -15)
        .attr('width', 100)
        .attr('height', segments.length * 25 + 10)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', 'rgba(255,255,255,0.1)')
        .attr('stroke', getGridColor())
        .attr('stroke-width', 1);
    
    segments.forEach((segment, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 25})`);
        
        legendRow.append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 8)
            .attr('fill', segment.color)
            .attr('opacity', 0.85);
        
        legendRow.append('text')
            .attr('x', 25)
            .attr('y', 14)
            .style('font-size', '12px')
            .style('fill', getTextColor())
            .text(segment.name);
    });
    
    // Add responsive behavior - redraw on window resize
    const resizeChart = () => {
        container.innerHTML = '';
        renderCustomerSegmentation();
    };
    
    // Add resize event listener with debounce
    const debouncedResize = debounce(resizeChart, 250);
    window.addEventListener('resize', debouncedResize);
    
    // Cleanup function to remove event listener when chart is destroyed
    container._cleanupResize = () => {
        window.removeEventListener('resize', debouncedResize);
    };
}

// Helper function for debouncing resize events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Demographic Purchases Chart
function updateDemographicPurchasesChart() {
    const canvas = document.getElementById('demographic-purchases-chart');
    
    // Get demographic data based on selected filter
    let labels = [];
    let datasets = [];
    
    // Get category data
    const categories = DataService.getSalesByCategory(dashboardState.startDate, dashboardState.endDate);
    const chartColors = getChartColors();
    
    // Define category names mapping
    const categoryNames = {
        1: "Electronics",
        2: "Clothing",
        3: "Home & Kitchen",
        4: "Beauty & Personal Care",
        5: "Books & Media",
        6: "Sports & Outdoors",
        7: "Toys & Games",
        8: "Groceries",
        9: "Furniture",
        10: "Automotive"
    };
    
    if (dashboardState.demographicFilter === 'age') {
        labels = ["0-17", "18-25", "26-35", "36-45", "46-55", "56-65", "65+"];
        
        // Generate a dataset for each major category
        categories.slice(0, 5).forEach((category, index) => {
            const data = labels.map(() => Math.floor(Math.random() * 10000 + 1000));
            datasets.push({
                label: category.name,
                data: data,
                backgroundColor: chartColors[index % chartColors.length],
                borderWidth: 0
            });
        });
    } else if (dashboardState.demographicFilter === 'gender') {
        labels = ["Male", "Female"];
        
        // Generate a dataset for each major category
        categories.slice(0, 5).forEach((category, index) => {
            const data = labels.map(() => Math.floor(Math.random() * 10000 + 1000));
            datasets.push({
                label: category.name,
                data: data,
                backgroundColor: chartColors[index % chartColors.length],
                borderWidth: 0
            });
        });
    } else if (dashboardState.demographicFilter === 'occupation') {
        labels = ["Healthcare", "IT", "Business", "Education", "Engineering", "Sales", "Other"];
        
        // Generate a dataset for each major category
        categories.slice(0, 5).forEach((category, index) => {
            const data = labels.map(() => Math.floor(Math.random() * 10000 + 1000));
            datasets.push({
                label: category.name,
                data: data,
                backgroundColor: chartColors[index % chartColors.length],
                borderWidth: 0
            });
        });
    } else if (dashboardState.demographicFilter === 'marital') {
        labels = ["Single", "Married"];
        
        // Generate a dataset for each major category
        categories.slice(0, 5).forEach((category, index) => {
            const data = labels.map(() => Math.floor(Math.random() * 10000 + 1000));
            datasets.push({
                label: category.name,
                data: data,
                backgroundColor: chartColors[index % chartColors.length],
                borderWidth: 0
            });
        });
    }
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false,
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            }
        }
    };
    
    // Apply theme-specific styling
    applyChartStyle(config);
    
    // Create or update chart
    if (charts.demographicPurchases) {
        charts.demographicPurchases.data = config.data;
        charts.demographicPurchases.options = config.options;
        charts.demographicPurchases.update();
    } else {
        charts.demographicPurchases = new Chart(canvas, config);
    }
}

// Product Treemap Visualization
function renderProductTreemap() {
    // Get sales data by category
    const categorySales = DataService.getSalesByCategory(dashboardState.startDate, dashboardState.endDate);
    
    // Create the treemap container
    const container = document.getElementById('product-treemap-chart');
    if (!container) return; // Safety check if container doesn't exist
    
    container.innerHTML = '';
    
    // Set up dimensions
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    
    // Check if container has dimensions yet
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom || 300; // Fallback height
    
    if (width <= 0) {
        // If container doesn't have width yet, retry after a delay
        setTimeout(() => renderProductTreemap(), 100);
        return;
    }
    
    // Create SVG element
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Prepare treemap data
    const root = d3.hierarchy({ children: categorySales })
        .sum(d => d.total || 0)
        .sort((a, b) => b.value - a.value);
    
    // Create treemap layout
    d3.treemap()
        .size([width, height])
        .padding(4)
        (root);
    
    // Generate color scale
    const colorScale = d3.scaleOrdinal()
        .domain(categorySales.map(d => d.name))
        .range(getChartColors());
    
    // Draw rectangles for each node
    svg.selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .style('stroke', 'white')
            .style('fill', d => colorScale(d.data.name))
            .style('opacity', 0.9);
    
    // Add category name text
    svg.selectAll('text.name')
        .data(root.leaves())
        .enter()
        .append('text')
            .attr('class', 'name')
            .attr('x', d => d.x0 + 5)
            .attr('y', d => d.y0 + 20)
            .text(d => d.data.name)
            .attr('font-size', '12px')
            .attr('fill', 'white')
            .each(function(d) {
                // Hide text if it's too wide for the rectangle
                const textWidth = this.getComputedTextLength();
                const rectWidth = d.x1 - d.x0;
                if (textWidth > rectWidth - 10) {
                    d3.select(this).style('display', 'none');
                }
            });
    
    // Add sales amount text
    svg.selectAll('text.amount')
        .data(root.leaves())
        .enter()
        .append('text')
            .attr('class', 'amount')
            .attr('x', d => d.x0 + 5)
            .attr('y', d => d.y0 + 40)
            .text(d => formatCurrency(d.data.total))
            .attr('font-size', '10px')
            .attr('fill', 'white')
            .each(function(d) {
                // Hide text if it's too wide for the rectangle
                const textWidth = this.getComputedTextLength();
                const rectWidth = d.x1 - d.x0;
                if (textWidth > rectWidth - 10 || (d.y1 - d.y0) < 50) {
                    d3.select(this).style('display', 'none');
                }
            });
    
    // Add interactivity - tooltip on hover
    svg.selectAll('rect')
        .on('mouseover', function(event, d) {
            d3.select(this).style('opacity', 1);
            
            // Create tooltip
            d3.select(container)
                .append('div')
                .attr('class', 'treemap-tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0,0,0,0.8)')
                .style('color', 'white')
                .style('padding', '10px')
                .style('border-radius', '5px')
                .style('left', event.pageX - container.getBoundingClientRect().left + 'px')
                .style('top', event.pageY - container.getBoundingClientRect().top + 'px')
                .style('pointer-events', 'none')
                .html(`
                    <strong>${d.data.name}</strong><br>
                    Sales: ${formatCurrency(d.data.total)}<br>
                    Items Sold: ${d.data.count}
                `);
        })
        .on('mousemove', function(event) {
            d3.select('.treemap-tooltip')
                .style('left', event.pageX - container.getBoundingClientRect().left + 10 + 'px')
                .style('top', event.pageY - container.getBoundingClientRect().top + 10 + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).style('opacity', 0.9);
            d3.select('.treemap-tooltip').remove();
        });
    
    // Add window resize event listener
    const resizeChart = debounce(() => {
        container.innerHTML = '';
        renderProductTreemap();
    }, 250);
    
    window.addEventListener('resize', resizeChart);
}

// Category Correlation Visualization
function renderCategoryCorrelation() {
    // Get sales data
    const sales = DataService.getSales(dashboardState.startDate, dashboardState.endDate);
    
    // Set up container
    const container = document.getElementById('category-correlation-chart');
    if (!container) return; // Safety check if container doesn't exist
    
    container.innerHTML = '';
    
    // Set up dimensions with optimized margins
    const margin = { top: 15, right: 15, bottom: 15, left: 15 }; // Slightly increased margins
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom || 450; // Increased fallback height
    
    if (width <= 0) {
        // If container doesn't have width yet, retry after a delay
        setTimeout(() => renderCategoryCorrelation(), 100);
        return;
    }
    
    // Create a map of user purchases by category
    const userPurchases = {};
    sales.forEach(sale => {
        const userId = sale.user_id;
        const categoryId = sale.category_id;
        
        if (!userPurchases[userId]) {
            userPurchases[userId] = new Set();
        }
        
        userPurchases[userId].add(categoryId);
    });
    
    // Count occurrences of category pairs
    const categoryPairs = {};
    const categoryNames = {};
    const categoryTotals = {};
    
    // Get category names and initialize totals
    sales.forEach(sale => {
        const categoryId = sale.category_id;
        categoryNames[categoryId] = sale.category_name;
        categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + 1;
    });
    
    // Calculate category pairs
    Object.values(userPurchases).forEach(categories => {
        const categoryArray = Array.from(categories);
        
        for (let i = 0; i < categoryArray.length; i++) {
            for (let j = i + 1; j < categoryArray.length; j++) {
                const cat1 = categoryArray[i];
                const cat2 = categoryArray[j];
                
                const pairKey = `${cat1}-${cat2}`;
                const reversePairKey = `${cat2}-${cat1}`;
                
                if (categoryPairs[pairKey]) {
                    categoryPairs[pairKey].count++;
                } else if (categoryPairs[reversePairKey]) {
                    categoryPairs[reversePairKey].count++;
                } else {
                    categoryPairs[pairKey] = {
                        source: cat1,
                        target: cat2,
                        count: 1
                    };
                }
            }
        }
    });
    
    // Convert to array and sort by count - limit to fewer connections for clarity
    const links = Object.values(categoryPairs)
        .sort((a, b) => b.count - a.count)
        .slice(0, 12); // Reduced to prevent overcrowding
    
    // Create nodes array
    const categoryIds = [...new Set([...links.map(d => d.source), ...links.map(d => d.target)])];
    const nodes = categoryIds.map(id => ({
        id,
        name: categoryNames[id],
        value: categoryTotals[id] || 0
    }));
    
    // Create SVG container
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Create visualization container
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Add a light background to the visualization area for better contrast
    g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'var(--card-bg)')
        .attr('rx', 8)
        .attr('opacity', 0.5);
    
    // Simplified forces for better layout
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(d => 100))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => Math.sqrt(d.value) * 2.5 + 15))
        .force('x', d3.forceX(width / 2).strength(0.07))
        .force('y', d3.forceY(height / 2).strength(0.07));
    
    // Create links with varying thickness
    const link = g.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke-width', d => Math.max(1.5, Math.log(d.count) * 2))
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6);
    
    // Create nodes with size based on value
    const node = g.append('g')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node-group')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // Add circles to node groups
    node.append('circle')
        .attr('r', d => Math.min(Math.sqrt(d.value) * 2.2, 30))
        .attr('fill', (d, i) => getChartColors()[i % getChartColors().length])
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);
    
    // Add text labels with better visibility
    node.append('text')
        .text(d => d.name)
        .attr('text-anchor', 'middle')
        .attr('dy', d => -Math.min(Math.sqrt(d.value) * 2.2, 30) - 8)
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', 'var(--text-primary)')
        .style('filter', 'drop-shadow(0px 0px 2px var(--card-bg))')
        .style('pointer-events', 'none');
    
    // Calculate safe boundary to keep nodes in view
    const nodeRadius = 35; // Maximum possible node radius with padding
    const safeX = (d) => Math.max(nodeRadius, Math.min(width - nodeRadius, d.x));
    const safeY = (d) => Math.max(nodeRadius, Math.min(height - nodeRadius, d.y));
    
    // Update positions on each simulation tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => safeX(d.source))
            .attr('y1', d => safeY(d.source))
            .attr('x2', d => safeX(d.target))
            .attr('y2', d => safeY(d.target));
        
        node
            .attr('transform', d => `translate(${safeX(d)}, ${safeY(d)})`);
    });
    
    // Define drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = safeX({x: event.x});
        d.fy = safeY({y: event.y});
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    // Add a tooltip for additional information
    const tooltip = d3.select(container)
        .append('div')
        .attr('class', 'd3-tooltip')
        .style('opacity', 0);
    
    node.on('mouseover', function(event, d) {
        tooltip.transition()
            .duration(200)
            .style('opacity', 0.9);
        tooltip.html(`
            <strong>${d.name}</strong><br>
            Total: ${formatNumber(d.value)} sales
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });
    
    // Add event listener to redraw when window is resized
    const resizeChart = debounce(() => {
        renderCategoryCorrelation();
    }, 250);
    
    window.addEventListener('resize', resizeChart);
    
    // Add this chart to our charts object to manage it later
    charts.categoryCorrelation = {
        update: renderCategoryCorrelation,
        resize: resizeChart
    };
}

// Product Price Range Analysis
function updatePriceRangeChart() {
    const canvas = document.getElementById('price-range-chart');
    
    // Get all products
    const products = DATA.products;
    
    // Calculate price ranges
    const priceRanges = [
        { range: "Below $50", count: 0 },
        { range: "$50-$100", count: 0 },
        { range: "$100-$250", count: 0 },
        { range: "$250-$500", count: 0 },
        { range: "$500-$1000", count: 0 },
        { range: "$1000+", count: 0 }
    ];
    
    // Count products in each price range
    products.forEach(product => {
        const price = product.price;
        
        if (price < 50) priceRanges[0].count++;
        else if (price < 100) priceRanges[1].count++;
        else if (price < 250) priceRanges[2].count++;
        else if (price < 500) priceRanges[3].count++;
        else if (price < 1000) priceRanges[4].count++;
        else priceRanges[5].count++;
    });
    
    // Get sales data for the current period
    const sales = DataService.getSales(dashboardState.startDate, dashboardState.endDate);
    
    // Calculate sales for each price range
    const priceRangeSales = [
        { range: "Below $50", sales: 0 },
        { range: "$50-$100", sales: 0 },
        { range: "$100-$250", sales: 0 },
        { range: "$250-$500", sales: 0 },
        { range: "$500-$1000", sales: 0 },
        { range: "$1000+", sales: 0 }
    ];
    
    // Sum sales for each price range
    sales.forEach(sale => {
        const product = DATA.products.find(p => p.id === sale.product_id);
        if (!product) return;
        
        const price = product.price;
        
        if (price < 50) priceRangeSales[0].sales += sale.purchase_amount;
        else if (price < 100) priceRangeSales[1].sales += sale.purchase_amount;
        else if (price < 250) priceRangeSales[2].sales += sale.purchase_amount;
        else if (price < 500) priceRangeSales[3].sales += sale.purchase_amount;
        else if (price < 1000) priceRangeSales[4].sales += sale.purchase_amount;
        else priceRangeSales[5].sales += sale.purchase_amount;
    });
    
    // Prepare chart data
    const data = {
        labels: priceRanges.map(range => range.range),
        datasets: [
            {
                type: 'bar',
                label: 'Number of Products',
                data: priceRanges.map(range => range.count),
                backgroundColor: '#4361ee',
                borderColor: '#4361ee',
                borderWidth: 1,
                yAxisID: 'y',
                order: 2 // Higher order means it's drawn first (behind other elements)
            },
            {
                type: 'line',
                label: 'Sales Amount',
                data: priceRangeSales.map(range => range.sales),
                backgroundColor: '#f72585',
                borderColor: '#f72585',
                borderWidth: 2,
                pointBackgroundColor: '#f72585',
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBorderColor: '#fff',
                pointBorderWidth: 1,
                yAxisID: 'y1',
                order: 1, // Lower order means it's drawn last (in front of other elements)
                z: 10 // Higher z value to ensure it's on top
            }
        ]
    };
    
    // Chart configuration
    const config = {
        type: 'bar', // Change to 'scatter' as the base type
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Products'
                    },
                    grid: {
                        color: '#e2e8f0'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Sales Amount'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw;
                            
                            if (context.datasetIndex === 0) {
                                return `${label}: ${value} products`;
                            } else {
                                return `${label}: ${formatCurrency(value)}`;
                            }
                        }
                    }
                }
            }
        }
    };
    
    // Apply theme-specific styling
    applyChartStyle(config);
    
    // Create or update chart
    if (charts.priceRange) {
        charts.priceRange.data = data;
        charts.priceRange.options = config.options;
        charts.priceRange.update();
    } else {
        charts.priceRange = new Chart(canvas, config);
    }
}

// Product Performance Over Time
function updateProductTimeChart() {
    const canvas = document.getElementById('product-time-chart');
    
    let chartData;
    
    if (dashboardState.productTimeView === 'category') {
        // Get category sales over time
        chartData = DataService.getSalesByCategoryAndTime(
            dashboardState.startDate, 
            dashboardState.endDate,
            'monthly'
        );
    } else {
        // Get top 5 products
        const topProducts = DataService.getTopProducts(
            dashboardState.startDate, 
            dashboardState.endDate,
            5
        );
        
        // Get sales for each product over time
        const productIds = topProducts.map(p => p.id);
        const sales = DataService.getSales(dashboardState.startDate, dashboardState.endDate);
        
        // Group sales by product and month
        const salesByProductAndMonth = {};
        
        sales.forEach(sale => {
            if (!productIds.includes(sale.product_id)) return;
            
            const date = new Date(sale.date);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            const productId = sale.product_id;
            
            if (!salesByProductAndMonth[productId]) {
                salesByProductAndMonth[productId] = {};
            }
            
            if (!salesByProductAndMonth[productId][monthKey]) {
                salesByProductAndMonth[productId][monthKey] = 0;
            }
            
            salesByProductAndMonth[productId][monthKey] += sale.purchase_amount;
        });
        
        // Get all months in the date range
        const months = [];
        let currentDate = new Date(dashboardState.startDate);
        while (currentDate <= dashboardState.endDate) {
            const monthKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            months.push(monthKey);
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        // Format for chart
        chartData = {
            labels: months,
            datasets: topProducts.map((product, index) => {
                const color = getChartColors()[index % getChartColors().length];
                
                return {
                    label: product.name,
                    data: months.map(month => salesByProductAndMonth[product.id]?.[month] || 0),
                    borderColor: color,
                    backgroundColor: color + '20',
                    fill: false,
                    tension: 0.3
                };
            })
        };
    }
    
    // Chart configuration
    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw;
                            return `${label}: ${formatCurrency(value)}`;
                        }
                    }
                }
            }
        }
    };
    
    // Apply theme-specific styling
    applyChartStyle(config);
    
    // Create or update chart
    if (charts.productTime) {
        charts.productTime.data = chartData;
        charts.productTime.options = config.options;
        charts.productTime.update();
    } else {
        charts.productTime = new Chart(canvas, config);
    }
}

function updateCitySalesChart() {
    console.log('City sales chart would be updated here');
    // Placeholder implementation
}

// Placeholder implementations for remaining chart functions
function renderStayDurationChart() {
    console.log('Stay duration chart would be rendered here');
    document.getElementById('stay-duration-chart').innerHTML = 
        '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:var(--text-secondary);">Stay Duration Visualization</div>';
}

function updateCityDemographicChart() {
    console.log('City demographic chart would be updated here');
    // Placeholder implementation
}

function renderGeoHeatmap() {
    console.log('Geographic heatmap would be rendered here');
    document.getElementById('geo-heatmap-chart').innerHTML = 
        '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:var(--text-secondary);">Geographic Heatmap Visualization</div>';
}

function updateAnomalyDetectionChart() {
    console.log('Anomaly detection chart would be updated here');
    // Placeholder implementation
}

function updateCustomerSegmentsChart() {
    const canvas = document.getElementById('customer-segments-chart');
    
    // Define meaningful segment names
    const segmentNames = [
        "Loyal Customers",
        "High Spenders",
        "Frequent Shoppers",
        "New Customers",
        "At-Risk Customers",
        "Occasional Buyers",
        "One-Time Purchasers"
    ];
    
    // Simulated customer segment data
    const data = {
        labels: segmentNames,
        datasets: [{
            data: [25, 20, 18, 15, 12, 7, 3],
            backgroundColor: getChartColors(),
            borderWidth: 0
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        boxWidth: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% (${value})`;
                        }
                    }
                }
            }
        }
    };
    
    // Apply theme-specific styling
    applyChartStyle(config);
    
    // Create or update chart
    if (charts.customerSegments) {
        charts.customerSegments.data = config.data;
        charts.customerSegments.options = config.options;
        charts.customerSegments.update();
    } else {
        charts.customerSegments = new Chart(canvas, config);
    }
}

// These would follow similar patterns to the charts above,
// using D3.js for more complex visualizations and Chart.js for standard charts 