class TireRecyclingAnalyzer {
    constructor() {
        this.baselineProcess = this.createBaselineProcess();
        this.proposedProcess = this.createProposedProcess();
        this.customScenarios = this.loadCustomScenarios();
        this.currentScenario = 'baseline';
        this.annualThroughput = 3000; // tires per year
        this.tireWeight = 5.4; // tonnes per tire
        this.products = [
            { id: 'rubber-crumb', name: 'Rubber Crumb', yield: 60, price: 230 },
            { id: 'steel-wire', name: 'Steel Wire', yield: 15, price: 150 }
        ]; // default products
        this.capitalCosts = [
            { id: 'land', name: 'Land Purchase', cost: 500000, depreciationYears: 0, description: 'Land acquisition for facility' },
            { id: 'building', name: 'Building & Infrastructure', cost: 1200000, depreciationYears: 25, description: 'Facility construction and infrastructure' },
            { id: 'permits', name: 'Permits & Legal', cost: 50000, depreciationYears: 5, description: 'Environmental permits and legal setup' }
        ]; // default capital costs
        this.currentEditingStep = null;
        this.currentEditingProduct = null;
        this.currentEditingCapitalCost = null;
        
        this.initializeEventListeners();
        this.populateScenarioDropdown();
        this.renderCapitalCostsTable();
        this.renderProductTable();
        this.renderSwimLane();
        this.updateCostAnalysis();
        this.renderCharts();
    }

    createBaselineProcess() {
        return [
            {
                id: 'collection',
                name: 'Tire Collection',
                department: 'collection',
                equipmentCost: 50000,
                laborCost: 200,
                energyCost: 50,
                maintenanceCost: 25,
                duration: 4,
                description: 'Collection from auto shops, dealerships, waste centers'
            },
            {
                id: 'tire-transportation',
                name: 'Tire Transportation to Facility',
                department: 'tire-transportation',
                equipmentCost: 80000,
                laborCost: 150,
                energyCost: 120,
                maintenanceCost: 40,
                duration: 2,
                description: 'Transport collected tires to recycling facility'
            },
            {
                id: 'sorting',
                name: 'Sorting & Inspection',
                department: 'processing',
                equipmentCost: 30000,
                laborCost: 300,
                energyCost: 30,
                maintenanceCost: 15,
                duration: 3,
                description: 'Sort and inspect tires for processing'
            },
            {
                id: 'rim-removal',
                name: 'Rim & Sidewall Removal',
                department: 'processing',
                equipmentCost: 120000,
                laborCost: 250,
                energyCost: 80,
                maintenanceCost: 60,
                duration: 2,
                description: 'Remove steel rims and cut sidewalls'
            },
            {
                id: 'shredding',
                name: 'Tire Shredding & Steel Separation',
                department: 'processing',
                equipmentCost: 380000,
                laborCost: 400,
                energyCost: 700,
                maintenanceCost: 265,
                duration: 6,
                description: 'Shred tires and separate steel wires magnetically'
            },
            {
                id: 'feedstock-transportation',
                name: 'Processed Feedstock Transportation',
                department: 'feedstock-transportation',
                equipmentCost: 40000,
                laborCost: 100,
                energyCost: 60,
                maintenanceCost: 20,
                duration: 1,
                description: 'Transport processed rubber feedstock to manufacturing'
            },
            {
                id: 'product-manufacturing',
                name: 'Rubber Product Manufacturing',
                department: 'product-manufacturing',
                equipmentCost: 300000,
                laborCost: 350,
                energyCost: 250,
                maintenanceCost: 150,
                duration: 8,
                description: 'Manufacture rubber products from processed feedstock'
            },
            {
                id: 'product-distribution',
                name: 'Product Distribution',
                department: 'product-distribution',
                equipmentCost: 60000,
                laborCost: 120,
                energyCost: 80,
                maintenanceCost: 30,
                duration: 2,
                description: 'Package and distribute finished products to market'
            }
        ];
    }

    createProposedProcess() {
        return [
            {
                id: 'automated-collection',
                name: 'Automated Collection System',
                department: 'collection',
                equipmentCost: 120000,
                laborCost: 120,
                energyCost: 40,
                maintenanceCost: 60,
                duration: 2,
                description: 'Automated tire collection with IoT tracking'
            },
            {
                id: 'smart-tire-transportation',
                name: 'Smart Tire Transportation',
                department: 'tire-transportation',
                equipmentCost: 100000,
                laborCost: 100,
                energyCost: 80,
                maintenanceCost: 50,
                duration: 1.5,
                description: 'Route-optimized tire transportation to facility'
            },
            {
                id: 'ai-processing',
                name: 'AI-Powered Processing Line',
                department: 'processing',
                equipmentCost: 800000,
                laborCost: 300,
                energyCost: 400,
                maintenanceCost: 400,
                duration: 4,
                description: 'Integrated AI sorting, rim removal, shredding, and steel separation'
            },
            {
                id: 'automated-feedstock-transport',
                name: 'Automated Feedstock Transportation',
                department: 'feedstock-transportation',
                equipmentCost: 60000,
                laborCost: 60,
                energyCost: 40,
                maintenanceCost: 30,
                duration: 0.5,
                description: 'Automated conveyor system for processed feedstock'
            },
            {
                id: 'advanced-manufacturing',
                name: 'Advanced Product Manufacturing',
                department: 'product-manufacturing',
                equipmentCost: 450000,
                laborCost: 250,
                energyCost: 200,
                maintenanceCost: 225,
                duration: 6,
                description: 'Advanced manufacturing with quality control integration'
            },
            {
                id: 'smart-distribution',
                name: 'Smart Product Distribution',
                department: 'product-distribution',
                equipmentCost: 90000,
                laborCost: 80,
                energyCost: 50,
                maintenanceCost: 45,
                duration: 1,
                description: 'Automated packaging and intelligent distribution system'
            }
        ];
    }

    loadCustomScenarios() {
        try {
            const saved = localStorage.getItem('tireRecyclingScenarios');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading scenarios:', error);
            return {};
        }
    }

    saveCustomScenarios() {
        try {
            localStorage.setItem('tireRecyclingScenarios', JSON.stringify(this.customScenarios));
        } catch (error) {
            console.error('Error saving scenarios:', error);
        }
    }

    getCurrentProcess() {
        switch (this.currentScenario) {
            case 'baseline': return this.baselineProcess;
            case 'proposed': return this.proposedProcess;
            default: 
                return this.customScenarios[this.currentScenario]?.process || this.baselineProcess;
        }
    }

    populateScenarioDropdown() {
        const select = document.getElementById('scenarioSelect');
        const currentValue = select.value;
        
        // Clear existing options except baseline and proposed
        select.innerHTML = `
            <option value="baseline">Current Process (Baseline)</option>
            <option value="proposed">Proposed Process</option>
        `;
        
        // Add custom scenarios
        Object.keys(this.customScenarios).forEach(scenarioId => {
            const scenario = this.customScenarios[scenarioId];
            const option = document.createElement('option');
            option.value = scenarioId;
            option.textContent = scenario.name;
            select.appendChild(option);
        });
        
        // Restore selection if it still exists
        if (currentValue && (currentValue === 'baseline' || currentValue === 'proposed' || this.customScenarios[currentValue])) {
            select.value = currentValue;
        }
    }

    calculateStepCost(step) {
        const dailyEquipmentCost = (step.equipmentCost * 0.1) / 365; // 10% annual depreciation
        const totalDailyCost = dailyEquipmentCost + step.laborCost + step.energyCost + step.maintenanceCost;
        const annualCost = totalDailyCost * 365;
        const dailyTireCapacity = this.annualThroughput / 365;
        const dailyTonnageCapacity = dailyTireCapacity * this.tireWeight;
        
        return {
            daily: totalDailyCost,
            annual: annualCost,
            perTire: annualCost / this.annualThroughput,
            perTon: totalDailyCost / dailyTonnageCapacity,
            breakdown: {
                equipment: dailyEquipmentCost,
                labor: step.laborCost,
                energy: step.energyCost,
                maintenance: step.maintenanceCost
            }
        };
    }

    calculateTotalCosts() {
        const process = this.getCurrentProcess();
        let totalDaily = 0;
        let totalAnnual = 0;
        let totalEquipment = 0;
        const stepCosts = [];

        process.forEach(step => {
            const stepCost = this.calculateStepCost(step);
            totalDaily += stepCost.daily;
            totalAnnual += stepCost.annual;
            totalEquipment += step.equipmentCost;
            stepCosts.push({
                name: step.name,
                cost: stepCost.daily,
                percentage: 0 // Will be calculated after total is known
            });
        });

        // Calculate percentages
        stepCosts.forEach(step => {
            step.percentage = (step.cost / totalDaily * 100).toFixed(1);
        });

        // Calculate capital costs depreciation
        let totalCapitalCost = 0;
        let annualDepreciation = 0;
        
        this.capitalCosts.forEach(item => {
            totalCapitalCost += item.cost;
            if (item.depreciationYears > 0) {
                annualDepreciation += item.cost / item.depreciationYears;
            }
        });
        
        // Calculate revenue and profit from all products
        const annualTonnageInput = this.annualThroughput * this.tireWeight;
        let annualRevenue = 0;
        let totalYield = 0;
        
        this.products.forEach(product => {
            const productOutput = annualTonnageInput * (product.yield / 100);
            const productRevenue = productOutput * product.price;
            annualRevenue += productRevenue;
            totalYield += product.yield;
        });
        
        // Total annual cost includes operating costs + depreciation
        const totalAnnualCostWithDepreciation = totalAnnual + annualDepreciation;
        const annualProfit = annualRevenue - totalAnnualCostWithDepreciation;

        return {
            totalDaily,
            annualOperatingCost: totalAnnual,
            annualDepreciation,
            totalAnnualCost: totalAnnualCostWithDepreciation,
            totalCapitalCost,
            costPerTire: totalAnnualCostWithDepreciation / this.annualThroughput,
            costPerTon: totalDaily / ((this.annualThroughput / 365) * this.tireWeight),
            totalEquipment,
            stepCosts,
            departmentCosts: this.calculateDepartmentCosts(process),
            // Revenue calculations
            annualTonnageInput,
            totalYield,
            annualRevenue,
            annualProfit,
            profitMargin: annualRevenue > 0 ? (annualProfit / annualRevenue) * 100 : 0
        };
    }

    calculateDepartmentCosts(process) {
        const departmentCosts = {};
        let transportationTotal = 0;
        
        process.forEach(step => {
            const stepCost = this.calculateStepCost(step);
            
            // Group transportation sub-departments
            if (step.department === 'tire-transportation' || 
                step.department === 'feedstock-transportation' || 
                step.department === 'product-distribution') {
                transportationTotal += stepCost.daily;
            } else {
                // Use original department for non-transportation steps
                const dept = step.department;
                if (!departmentCosts[dept]) {
                    departmentCosts[dept] = 0;
                }
                departmentCosts[dept] += stepCost.daily;
            }
        });
        
        // Add transportation total if there are transportation steps
        if (transportationTotal > 0) {
            departmentCosts['transportation'] = transportationTotal;
        }
        
        return departmentCosts;
    }

    initializeEventListeners() {
        document.getElementById('scenarioSelect').addEventListener('change', (e) => {
            this.currentScenario = e.target.value;
            this.renderSwimLane();
            this.updateCostAnalysis();
            this.renderCharts();
            this.updateScenarioButtons();
        });

        document.getElementById('annualThroughput').addEventListener('input', (e) => {
            this.annualThroughput = parseFloat(e.target.value) || 3000;
            this.renderProductTable(); // Update product revenues
            this.updateCostAnalysis();
            this.renderCharts();
        });

        // Product management
        document.getElementById('addProduct').addEventListener('click', () => {
            this.showProductEditor();
        });

        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        document.getElementById('cancelProductEdit').addEventListener('click', () => {
            this.hideProductEditor();
        });

        // Capital costs management
        document.getElementById('addCapitalCost').addEventListener('click', () => {
            this.showCapitalCostEditor();
        });

        document.getElementById('capitalCostForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCapitalCost();
        });

        document.getElementById('cancelCapitalCostEdit').addEventListener('click', () => {
            this.hideCapitalCostEditor();
        });

        document.getElementById('addStep').addEventListener('click', () => {
            this.showStepEditor();
        });

        document.getElementById('exportDiagram').addEventListener('click', () => {
            this.exportDiagram();
        });

        document.getElementById('compareScenarios').addEventListener('click', () => {
            this.showComparison();
        });

        // Scenario management
        document.getElementById('addScenario').addEventListener('click', () => {
            this.showScenarioEditor();
        });

        document.getElementById('saveScenario').addEventListener('click', () => {
            this.saveCurrentScenario();
        });

        document.getElementById('deleteScenario').addEventListener('click', () => {
            this.deleteCurrentScenario();
        });

        document.getElementById('stepForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveStep();
        });

        document.getElementById('scenarioForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createScenario();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.hideStepEditor();
        });

        document.getElementById('cancelScenarioEdit').addEventListener('click', () => {
            this.hideScenarioEditor();
        });

        document.getElementById('deleteStep').addEventListener('click', () => {
            this.deleteStep();
        });

        // Chart view toggle
        document.querySelectorAll('input[name="chartView"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.renderCostBreakdownChart();
            });
        });

        this.updateScenarioButtons();
    }

    updateScenarioButtons() {
        const isCustomScenario = this.currentScenario !== 'baseline' && this.currentScenario !== 'proposed';
        const saveBtn = document.getElementById('saveScenario');
        const deleteBtn = document.getElementById('deleteScenario');
        
        if (isCustomScenario) {
            saveBtn.title = 'Update Scenario';
            deleteBtn.style.display = 'inline-flex';
        } else {
            saveBtn.title = 'Save as New Scenario';
            deleteBtn.style.display = 'none';
        }
    }

    showScenarioEditor() {
        const editor = document.getElementById('scenarioEditor');
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.addEventListener('click', () => this.hideScenarioEditor());
        document.body.appendChild(overlay);
        
        // Reset form
        document.getElementById('scenarioForm').reset();
        document.getElementById('baseScenario').value = this.currentScenario === 'baseline' || this.currentScenario === 'proposed' ? this.currentScenario : 'current';
        
        editor.style.display = 'block';
    }

    hideScenarioEditor() {
        document.getElementById('scenarioEditor').style.display = 'none';
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    createScenario() {
        const name = document.getElementById('scenarioName').value.trim();
        const description = document.getElementById('scenarioDescription').value.trim();
        const baseScenario = document.getElementById('baseScenario').value;
        
        if (!name) {
            alert('Please enter a scenario name');
            return;
        }
        
        // Generate unique ID
        const scenarioId = 'scenario-' + Date.now();
        
        // Get base process
        let baseProcess;
        switch (baseScenario) {
            case 'baseline':
                baseProcess = this.baselineProcess;
                break;
            case 'proposed':
                baseProcess = this.proposedProcess;
                break;
            case 'current':
                baseProcess = this.getCurrentProcess();
                break;
            default:
                baseProcess = this.baselineProcess;
        }
        
        // Create new scenario
        this.customScenarios[scenarioId] = {
            name: name,
            description: description,
            createdAt: new Date().toISOString(),
            process: JSON.parse(JSON.stringify(baseProcess)) // Deep copy
        };
        
        this.saveCustomScenarios();
        this.populateScenarioDropdown();
        
        // Switch to new scenario
        this.currentScenario = scenarioId;
        document.getElementById('scenarioSelect').value = scenarioId;
        
        this.hideScenarioEditor();
        this.renderSwimLane();
        this.updateCostAnalysis();
        this.renderCharts();
        this.updateScenarioButtons();
    }

    saveCurrentScenario() {
        if (this.currentScenario === 'baseline' || this.currentScenario === 'proposed') {
            // Save as new scenario
            this.showScenarioEditor();
        } else {
            // Update existing custom scenario
            if (this.customScenarios[this.currentScenario]) {
                this.customScenarios[this.currentScenario].process = JSON.parse(JSON.stringify(this.getCurrentProcess()));
                this.customScenarios[this.currentScenario].updatedAt = new Date().toISOString();
                this.saveCustomScenarios();
                alert('Scenario updated successfully!');
            }
        }
    }

    deleteCurrentScenario() {
        if (this.currentScenario === 'baseline' || this.currentScenario === 'proposed') {
            alert('Cannot delete built-in scenarios');
            return;
        }
        
        if (confirm('Are you sure you want to delete this scenario?')) {
            delete this.customScenarios[this.currentScenario];
            this.saveCustomScenarios();
            this.populateScenarioDropdown();
            
            // Switch back to baseline
            this.currentScenario = 'baseline';
            document.getElementById('scenarioSelect').value = 'baseline';
            
            this.renderSwimLane();
            this.updateCostAnalysis();
            this.renderCharts();
            this.updateScenarioButtons();
        }
    }

    renderSwimLane() {
        const swimLane = document.getElementById('swimLane');
        const process = this.getCurrentProcess();
        
        // Group steps by logical department for display
        const departments = this.groupStepsByLogicalDepartment(process);

        swimLane.innerHTML = '';
        
        Object.entries(departments).forEach(([dept, steps]) => {
            const departmentDiv = document.createElement('div');
            departmentDiv.className = 'department';
            
            const header = document.createElement('div');
            header.className = 'department-header';
            header.textContent = this.formatDepartmentName(dept);
            
            const stepsContainer = document.createElement('div');
            stepsContainer.className = 'department-steps';
            
            steps.forEach((step, index) => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'process-step';
                stepDiv.dataset.stepId = step.id;
                
                const cost = this.calculateStepCost(step);
                
                stepDiv.innerHTML = `
                    <div class="step-title">${step.name}</div>
                    <div class="step-cost">Annual Cost: $${cost.annual.toLocaleString()}</div>
                    <div class="step-cost">Per Tire: $${cost.perTire.toFixed(2)}</div>
                    <div class="step-duration">Duration: ${step.duration}h</div>
                `;
                
                stepDiv.addEventListener('click', () => {
                    this.editStep(step.id);
                });
                
                stepsContainer.appendChild(stepDiv);
                
                if (index < steps.length - 1) {
                    const arrow = document.createElement('div');
                    arrow.className = 'step-arrow';
                    arrow.innerHTML = '→';
                    stepsContainer.appendChild(arrow);
                }
            });
            
            departmentDiv.appendChild(header);
            departmentDiv.appendChild(stepsContainer);
            swimLane.appendChild(departmentDiv);
        });
    }

    groupStepsByLogicalDepartment(process) {
        const departments = {};
        const transportationSteps = [];
        
        process.forEach(step => {
            // Group transportation sub-departments under Transportation
            if (step.department === 'tire-transportation' || 
                step.department === 'feedstock-transportation' || 
                step.department === 'product-distribution') {
                transportationSteps.push(step);
            } else {
                // Use original department for non-transportation steps
                const dept = step.department;
                if (!departments[dept]) {
                    departments[dept] = [];
                }
                departments[dept].push(step);
            }
        });
        
        // Add all transportation steps under Transportation department
        if (transportationSteps.length > 0) {
            departments['transportation'] = transportationSteps;
        }
        
        return departments;
    }

    formatDepartmentName(dept) {
        return dept.charAt(0).toUpperCase() + dept.slice(1).replace('-', ' ');
    }

    updateCostAnalysis() {
        const costs = this.calculateTotalCosts();
        
        document.getElementById('totalAnnualCost').textContent = `$${costs.totalAnnualCost.toLocaleString()}`;
        document.getElementById('totalCapitalCost').textContent = `$${costs.totalCapitalCost.toLocaleString()}`;
        document.getElementById('annualRevenue').textContent = `$${costs.annualRevenue.toLocaleString()}`;
        
        // Color code profit based on profitability
        const profitElement = document.getElementById('annualProfit');
        profitElement.textContent = `$${costs.annualProfit.toLocaleString()}`;
        
        // Update profit card styling based on profitability
        const profitCard = profitElement.closest('.cost-card');
        if (costs.annualProfit > 0) {
            profitCard.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        } else {
            profitCard.style.background = 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)';
        }
        
        // Also update the capital costs table totals
        this.updateCapitalCostTotals();
    }

    renderCharts() {
        this.renderCostBreakdownChart();
        this.renderRevenueChart();
    }

    renderCostBreakdownChart() {
        const ctx = document.getElementById('costBreakdownChart').getContext('2d');
        const costs = this.calculateTotalCosts();
        const viewMode = document.querySelector('input[name="chartView"]:checked')?.value || 'steps';
        
        if (this.costBreakdownChart) {
            this.costBreakdownChart.destroy();
        }
        
        let chartData, chartLabels;
        
        if (viewMode === 'departments') {
            // Department-level view
            chartLabels = Object.keys(costs.departmentCosts).map(dept => this.formatDepartmentName(dept));
            chartData = Object.values(costs.departmentCosts);
        } else {
            // Step-level view
            chartLabels = costs.stepCosts.map(step => step.name);
            chartData = costs.stepCosts.map(step => step.cost);
        }
        
        this.costBreakdownChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [{
                    data: chartData,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6B6B', '#4ECDC4',
                        '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3',
                        '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = chartData.reduce((sum, val) => sum + val, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        const costs = this.calculateTotalCosts();
        
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }
        
        this.revenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Annual Financial Performance'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [costs.annualRevenue],
                        backgroundColor: '#36A2EB'
                    },
                    {
                        label: 'Operating Cost',
                        data: [costs.annualOperatingCost],
                        backgroundColor: '#FF6384'
                    },
                    {
                        label: 'Depreciation',
                        data: [costs.annualDepreciation],
                        backgroundColor: '#FFA500'
                    },
                    {
                        label: 'Profit',
                        data: [costs.annualProfit],
                        backgroundColor: costs.annualProfit > 0 ? '#28a745' : '#dc3545'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    showStepEditor(stepId = null) {
        this.currentEditingStep = stepId;
        const editor = document.getElementById('processEditor');
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.addEventListener('click', () => this.hideStepEditor());
        document.body.appendChild(overlay);
        
        if (stepId) {
            const step = this.getCurrentProcess().find(s => s.id === stepId);
            if (step) {
                document.getElementById('stepName').value = step.name;
                document.getElementById('stepDepartment').value = step.department;
                document.getElementById('equipmentCost').value = step.equipmentCost;
                document.getElementById('laborCost').value = step.laborCost;
                document.getElementById('energyCost').value = step.energyCost;
                document.getElementById('maintenanceCost').value = step.maintenanceCost;
                document.getElementById('duration').value = step.duration;
                document.getElementById('deleteStep').style.display = 'inline-block';
            }
        } else {
            document.getElementById('stepForm').reset();
            document.getElementById('deleteStep').style.display = 'none';
        }
        
        editor.style.display = 'block';
    }

    hideStepEditor() {
        document.getElementById('processEditor').style.display = 'none';
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.currentEditingStep = null;
    }

    editStep(stepId) {
        this.showStepEditor(stepId);
    }

    saveStep() {
        const formData = {
            name: document.getElementById('stepName').value,
            department: document.getElementById('stepDepartment').value,
            equipmentCost: parseFloat(document.getElementById('equipmentCost').value) || 0,
            laborCost: parseFloat(document.getElementById('laborCost').value) || 0,
            energyCost: parseFloat(document.getElementById('energyCost').value) || 0,
            maintenanceCost: parseFloat(document.getElementById('maintenanceCost').value) || 0,
            duration: parseFloat(document.getElementById('duration').value) || 0
        };

        // Ensure we're working with a custom scenario
        if (this.currentScenario === 'baseline' || this.currentScenario === 'proposed') {
            // Create a new custom scenario based on current
            const scenarioId = 'scenario-' + Date.now();
            this.customScenarios[scenarioId] = {
                name: `Modified ${this.currentScenario === 'baseline' ? 'Baseline' : 'Proposed'}`,
                description: `Modified version of ${this.currentScenario} process`,
                createdAt: new Date().toISOString(),
                process: JSON.parse(JSON.stringify(this.getCurrentProcess()))
            };
            this.currentScenario = scenarioId;
            this.populateScenarioDropdown();
            document.getElementById('scenarioSelect').value = scenarioId;
        }

        const process = this.getCurrentProcess();

        if (this.currentEditingStep) {
            // Edit existing step
            const stepIndex = process.findIndex(s => s.id === this.currentEditingStep);
            if (stepIndex !== -1) {
                Object.assign(process[stepIndex], formData);
            }
        } else {
            // Add new step
            const newStep = {
                id: 'custom-' + Date.now(),
                ...formData,
                description: 'Custom process step'
            };
            process.push(newStep);
        }

        // Save custom scenario
        if (this.currentScenario !== 'baseline' && this.currentScenario !== 'proposed') {
            this.customScenarios[this.currentScenario].process = process;
            this.customScenarios[this.currentScenario].updatedAt = new Date().toISOString();
            this.saveCustomScenarios();
        }

        this.hideStepEditor();
        this.renderSwimLane();
        this.updateCostAnalysis();
        this.renderCharts();
        this.updateScenarioButtons();
    }

    deleteStep() {
        if (!this.currentEditingStep) return;
        
        if (confirm('Are you sure you want to delete this step?')) {
            // Ensure we're working with a custom scenario
            if (this.currentScenario === 'baseline' || this.currentScenario === 'proposed') {
                const scenarioId = 'scenario-' + Date.now();
                this.customScenarios[scenarioId] = {
                    name: `Modified ${this.currentScenario === 'baseline' ? 'Baseline' : 'Proposed'}`,
                    description: `Modified version of ${this.currentScenario} process`,
                    createdAt: new Date().toISOString(),
                    process: JSON.parse(JSON.stringify(this.getCurrentProcess()))
                };
                this.currentScenario = scenarioId;
                this.populateScenarioDropdown();
                document.getElementById('scenarioSelect').value = scenarioId;
            }

            const process = this.getCurrentProcess();
            const stepIndex = process.findIndex(s => s.id === this.currentEditingStep);
            if (stepIndex !== -1) {
                process.splice(stepIndex, 1);
            }
            
            // Save custom scenario
            if (this.currentScenario !== 'baseline' && this.currentScenario !== 'proposed') {
                this.customScenarios[this.currentScenario].process = process;
                this.customScenarios[this.currentScenario].updatedAt = new Date().toISOString();
                this.saveCustomScenarios();
            }
            
            this.hideStepEditor();
            this.renderSwimLane();
            this.updateCostAnalysis();
            this.renderCharts();
        }
    }

    showComparison() {
        const comparisonSection = document.getElementById('comparisonSection');
        const table = document.getElementById('comparisonTable').getElementsByTagName('tbody')[0];
        
        // Calculate costs for baseline and proposed scenarios
        const originalScenario = this.currentScenario;
        
        this.currentScenario = 'baseline';
        const baselineCosts = this.calculateTotalCosts();
        
        this.currentScenario = 'proposed';
        const proposedCosts = this.calculateTotalCosts();
        
        this.currentScenario = originalScenario;
        
        // Clear existing rows
        table.innerHTML = '';
        
        const metrics = [
            {
                name: 'Total Daily Cost',
                baseline: baselineCosts.totalDaily,
                proposed: proposedCosts.totalDaily,
                format: 'currency'
            },
            {
                name: 'Cost Per Ton',
                baseline: baselineCosts.costPerTon,
                proposed: proposedCosts.costPerTon,
                format: 'currency'
            },
            {
                name: 'Annual Cost',
                baseline: baselineCosts.annualCost,
                proposed: proposedCosts.annualCost,
                format: 'currency'
            },
            {
                name: 'Equipment Investment',
                baseline: baselineCosts.totalEquipment,
                proposed: proposedCosts.totalEquipment,
                format: 'currency'
            }
        ];
        
        metrics.forEach(metric => {
            const row = table.insertRow();
            const difference = metric.proposed - metric.baseline;
            const percentageChange = ((difference / metric.baseline) * 100).toFixed(1);
            
            row.innerHTML = `
                <td>${metric.name}</td>
                <td>${this.formatValue(metric.baseline, metric.format)}</td>
                <td>${this.formatValue(metric.proposed, metric.format)}</td>
                <td class="${difference > 0 ? 'negative-change' : difference < 0 ? 'positive-change' : 'neutral-change'}">
                    ${this.formatValue(difference, metric.format)} (${percentageChange}%)
                </td>
            `;
        });
        
        comparisonSection.style.display = 'block';
    }

    formatValue(value, format) {
        if (format === 'currency') {
            return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return value.toLocaleString();
    }

    exportDiagram() {
        const swimLaneElement = document.getElementById('swimLane');
        html2canvas(swimLaneElement, {
            backgroundColor: '#ffffff',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `tire-recycling-process-${this.currentScenario}-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }

    // Product Management Methods
    renderProductTable() {
        const tbody = document.getElementById('productTableBody');
        tbody.innerHTML = '';

        this.products.forEach(product => {
            const row = tbody.insertRow();
            const annualTonnageInput = this.annualThroughput * this.tireWeight;
            const productOutput = annualTonnageInput * (product.yield / 100);
            const productRevenue = productOutput * product.price;

            row.innerHTML = `
                <td>${product.name}</td>
                <td><input type="number" value="${product.yield}" min="0.1" max="100" step="0.1" 
                    onchange="window.analyzer.updateProductYield('${product.id}', this.value)"></td>
                <td><input type="number" value="${product.price}" min="0.01" step="0.01" 
                    onchange="window.analyzer.updateProductPrice('${product.id}', this.value)"></td>
                <td>$${productRevenue.toLocaleString()}</td>
                <td>
                    <div class="product-actions">
                        <button class="edit-product" onclick="window.analyzer.editProduct('${product.id}')">Edit</button>
                        <button class="delete-product" onclick="window.analyzer.deleteProduct('${product.id}')">Delete</button>
                    </div>
                </td>
            `;
        });

        this.updateProductTotals();
    }

    updateProductTotals() {
        let totalYield = 0;
        let totalRevenue = 0;
        const annualTonnageInput = this.annualThroughput * this.tireWeight;

        this.products.forEach(product => {
            totalYield += product.yield;
            const productOutput = annualTonnageInput * (product.yield / 100);
            totalRevenue += productOutput * product.price;
        });

        document.getElementById('totalYield').textContent = `${totalYield.toFixed(1)}%`;
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;

        // Update yield indicator
        const indicator = document.getElementById('yieldIndicator');
        indicator.textContent = `Total yield: ${totalYield.toFixed(1)}%`;
        
        // Remove all classes and add appropriate one
        indicator.className = 'yield-indicator';
        if (totalYield > 100) {
            indicator.classList.add('invalid');
            indicator.textContent += ' (Exceeds 100%)';
        } else if (totalYield > 95) {
            indicator.classList.add('warning');
            indicator.textContent += ' (Near maximum)';
        } else if (totalYield > 0) {
            indicator.classList.add('valid');
        }
    }

    updateProductYield(productId, newYield) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.yield = parseFloat(newYield) || 0;
            this.updateProductTotals();
            this.updateCostAnalysis();
            this.renderCharts();
        }
    }

    updateProductPrice(productId, newPrice) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.price = parseFloat(newPrice) || 0;
            this.updateProductTotals();
            this.updateCostAnalysis();
            this.renderCharts();
        }
    }

    showProductEditor(productId = null) {
        this.currentEditingProduct = productId;
        const editor = document.getElementById('productEditor');
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.addEventListener('click', () => this.hideProductEditor());
        document.body.appendChild(overlay);

        if (productId) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                document.getElementById('productName').value = product.name;
                document.getElementById('productYieldPercent').value = product.yield;
                document.getElementById('productPricePerTon').value = product.price;
            }
        } else {
            document.getElementById('productForm').reset();
        }

        // Hide warning initially
        document.getElementById('yieldWarning').style.display = 'none';
        
        editor.style.display = 'block';
    }

    hideProductEditor() {
        document.getElementById('productEditor').style.display = 'none';
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.currentEditingProduct = null;
    }

    editProduct(productId) {
        this.showProductEditor(productId);
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.renderProductTable();
            this.updateCostAnalysis();
            this.renderCharts();
        }
    }

    saveProduct() {
        const name = document.getElementById('productName').value.trim();
        const yieldPercent = parseFloat(document.getElementById('productYieldPercent').value) || 0;
        const price = parseFloat(document.getElementById('productPricePerTon').value) || 0;

        if (!name) {
            alert('Please enter a product name');
            return;
        }

        // Check if total yield would exceed 100%
        let totalYield = yieldPercent;
        this.products.forEach(product => {
            if (product.id !== this.currentEditingProduct) {
                totalYield += product.yield;
            }
        });

        if (totalYield > 100) {
            document.getElementById('yieldWarning').style.display = 'block';
            return;
        }

        if (this.currentEditingProduct) {
            // Edit existing product
            const product = this.products.find(p => p.id === this.currentEditingProduct);
            if (product) {
                product.name = name;
                product.yield = yieldPercent;
                product.price = price;
            }
        } else {
            // Add new product
            const newProduct = {
                id: 'product-' + Date.now(),
                name: name,
                yield: yieldPercent,
                price: price
            };
            this.products.push(newProduct);
        }

        this.hideProductEditor();
        this.renderProductTable();
        this.updateCostAnalysis();
        this.renderCharts();
    }

    // Capital Costs Management Methods
    renderCapitalCostsTable() {
        const tbody = document.getElementById('capitalCostsTableBody');
        tbody.innerHTML = '';

        this.capitalCosts.forEach(item => {
            const row = tbody.insertRow();
            const annualDepreciation = item.depreciationYears > 0 ? item.cost / item.depreciationYears : 0;

            row.innerHTML = `
                <td>${item.name}</td>
                <td><input type="number" value="${item.cost}" min="0" step="1000" 
                    onchange="window.analyzer.updateCapitalCost('${item.id}', 'cost', this.value)"></td>
                <td><input type="number" value="${item.depreciationYears}" min="0" max="50" 
                    onchange="window.analyzer.updateCapitalCost('${item.id}', 'depreciationYears', this.value)"></td>
                <td>$${annualDepreciation.toLocaleString()}</td>
                <td>
                    <div class="product-actions">
                        <button class="edit-product" onclick="window.analyzer.editCapitalCost('${item.id}')">Edit</button>
                        <button class="delete-product" onclick="window.analyzer.deleteCapitalCost('${item.id}')">Delete</button>
                    </div>
                </td>
            `;
        });

        this.updateCapitalCostTotals();
    }

    updateCapitalCostTotals() {
        let totalCapitalCost = 0;
        let totalAnnualDepreciation = 0;

        this.capitalCosts.forEach(item => {
            totalCapitalCost += item.cost;
            if (item.depreciationYears > 0) {
                totalAnnualDepreciation += item.cost / item.depreciationYears;
            }
        });

        document.getElementById('capitalCostTableTotal').textContent = `$${totalCapitalCost.toLocaleString()}`;
        document.getElementById('totalAnnualDepreciation').textContent = `$${totalAnnualDepreciation.toLocaleString()}`;
    }

    updateCapitalCost(itemId, field, newValue) {
        const item = this.capitalCosts.find(i => i.id === itemId);
        if (item) {
            if (field === 'cost') {
                item.cost = parseFloat(newValue) || 0;
            } else if (field === 'depreciationYears') {
                item.depreciationYears = parseFloat(newValue) || 0;
            }
            this.updateCapitalCostTotals();
            this.updateCostAnalysis();
            this.renderCharts();
        }
    }

    showCapitalCostEditor(itemId = null) {
        this.currentEditingCapitalCost = itemId;
        const editor = document.getElementById('capitalCostEditor');
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.addEventListener('click', () => this.hideCapitalCostEditor());
        document.body.appendChild(overlay);

        if (itemId) {
            const item = this.capitalCosts.find(i => i.id === itemId);
            if (item) {
                document.getElementById('capitalCostName').value = item.name;
                document.getElementById('capitalCostAmount').value = item.cost;
                document.getElementById('depreciationYears').value = item.depreciationYears;
                document.getElementById('capitalCostDescription').value = item.description || '';
            }
        } else {
            document.getElementById('capitalCostForm').reset();
        }

        editor.style.display = 'block';
    }

    hideCapitalCostEditor() {
        document.getElementById('capitalCostEditor').style.display = 'none';
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.currentEditingCapitalCost = null;
    }

    editCapitalCost(itemId) {
        this.showCapitalCostEditor(itemId);
    }

    deleteCapitalCost(itemId) {
        if (confirm('Are you sure you want to delete this capital cost item?')) {
            this.capitalCosts = this.capitalCosts.filter(i => i.id !== itemId);
            this.renderCapitalCostsTable();
            this.updateCostAnalysis();
            this.renderCharts();
        }
    }

    saveCapitalCost() {
        const name = document.getElementById('capitalCostName').value.trim();
        const cost = parseFloat(document.getElementById('capitalCostAmount').value) || 0;
        const depreciationYears = parseFloat(document.getElementById('depreciationYears').value) || 0;
        const description = document.getElementById('capitalCostDescription').value.trim();

        if (!name) {
            alert('Please enter an item name');
            return;
        }

        if (this.currentEditingCapitalCost) {
            // Edit existing item
            const item = this.capitalCosts.find(i => i.id === this.currentEditingCapitalCost);
            if (item) {
                item.name = name;
                item.cost = cost;
                item.depreciationYears = depreciationYears;
                item.description = description;
            }
        } else {
            // Add new item
            const newItem = {
                id: 'capital-' + Date.now(),
                name: name,
                cost: cost,
                depreciationYears: depreciationYears,
                description: description
            };
            this.capitalCosts.push(newItem);
        }

        this.hideCapitalCostEditor();
        this.renderCapitalCostsTable();
        this.updateCostAnalysis();
        this.renderCharts();
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.analyzer = new TireRecyclingAnalyzer();
});