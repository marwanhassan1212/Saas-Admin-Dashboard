// charts.js - Analytics Page Charts

document.addEventListener('DOMContentLoaded', () => {
    // Only init if we are on the analytics page (checking for the canvas elements)
    if(document.getElementById('trafficChart')) {
        initCharts();
    }
});

let trafficChart, deviceChart, retentionChart;

function initCharts() {
    const style = getComputedStyle(document.body);
    const textColor = style.getPropertyValue('--text-primary');
    const gridColor = style.getPropertyValue('--border-color');
    const primaryColor = style.getPropertyValue('--primary-color').trim();
    const successColor = style.getPropertyValue('--success-color').trim();
    const warningColor = style.getPropertyValue('--warning-color').trim();

    // Destroy existing charts if any
    if (trafficChart) trafficChart.destroy();
    if (deviceChart) deviceChart.destroy();
    if (retentionChart) retentionChart.destroy();

    // 1. Traffic Chart (Bar)
    const ctxTraffic = document.getElementById('trafficChart').getContext('2d');
    trafficChart = new Chart(ctxTraffic, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Organic',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: primaryColor,
                    borderRadius: 4
                },
                {
                    label: 'Paid',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    backgroundColor: 'rgba(79, 70, 229, 0.3)',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor }
                }
            },
            plugins: {
                legend: { labels: { color: textColor } }
            }
        }
    });

    // 2. Device Breakdown (Doughnut)
    const ctxDevice = document.getElementById('deviceChart').getContext('2d');
    deviceChart = new Chart(ctxDevice, {
        type: 'doughnut',
        data: {
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: [{
                data: [55, 30, 15],
                backgroundColor: [primaryColor, successColor, warningColor],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { color: textColor, padding: 20 } }
            }
        }
    });

    // 3. User Retention (Line)
    const ctxRetention = document.getElementById('retentionChart').getContext('2d');
    retentionChart = new Chart(ctxRetention, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [{
                label: 'Retention %',
                data: [100, 75, 60, 55, 45],
                borderColor: successColor,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: gridColor },
                    ticks: { color: textColor, callback: function(value) { return value + "%" } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

window.addEventListener('themeChanged', () => {
    if(document.getElementById('trafficChart')) {
        initCharts();
    }
});
