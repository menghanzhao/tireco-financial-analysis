class TireRecyclingAnalyzer {
    constructor() {
        this.baselineProcess = this.createBaselineProcess();
        this.proposedProcess = this.createProposedProcess();
        this.customScenarios = this.loadCustomScenarios();
        this.currentScenario = 'baseline';
        this.throughput = 10; // tons per day
        this.currentEditingStep = null;
        
        this.initializeEventListeners();
        this.populateScenarioDropdown();
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
                id: 'transportation',
                name: 'Transportation',
                department: 'transportation',
                equipmentCost: 80000,
                laborCost: 150,
                energyCost: 120,
                maintenanceCost: 40,
                duration: 2,
                description: 'Transport to recycling facility'
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
                description: 'Sort reusable vs non-reusable tires'
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
                id: 'primary-shredding',
                name: 'Primary Shredding',
                department: 'processing',
                equipmentCost: 200000,
                laborCost: 200,
                energyCost: 300,
                maintenanceCost: 100,
                duration: 4,
                description: 'Cut tires into 2-inch pieces'
            },
            {
                id: 'secondary-shredding',
                name: 'Secondary Shredding',
                department: 'processing',
                equipmentCost: 150000,
                laborCost: 180,
                energyCost: 250,
                maintenanceCost: 75,
                duration: 3,
                description: 'Further reduce to smaller chips'
            },
            {
                id: 'steel-separation',
                name: 'Steel Separation',
                department: 'separation',
                equipmentCost: 180000,
                laborCost: 220,
                energyCost: 150,
                maintenanceCost: 90,
                duration: 2,
                description: 'Magnetic separation of steel wires'
            },
            {
                id: 'granulation',
                name: 'Granulation & Refinement',
                department: 'processing',
                equipmentCost: 250000,
                laborCost: 200,
                energyCost: 200,
                maintenanceCost: 125,
                duration: 4,
                description: 'Create uniform rubber granules'
            },
            {
                id: 'quality-control',
                name: 'Quality Control',
                department: 'quality',
                equipmentCost: 50000,
                laborCost: 150,
                energyCost: 20,
                maintenanceCost: 25,
                duration: 1,
                description: 'Testing and quality assurance'
            },
            {
                id: 'packaging',
                name: 'Packaging & Storage',
                department: 'packaging',
                equipmentCost: 40000,
                laborCost: 100,
                energyCost: 30,
                maintenanceCost: 20,
                duration: 2,
                description: 'Package final products for sale'
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
                id: 'smart-transportation',
                name: 'Smart Transportation',
                department: 'transportation',
                equipmentCost: 100000,
                laborCost: 100,
                energyCost: 80,
                maintenanceCost: 50,
                duration: 1.5,
                description: 'Route-optimized transportation system'
            },
            {
                id: 'ai-sorting',
                name: 'AI-Powered Sorting',
                department: 'processing',
                equipmentCost: 150000,
                laborCost: 150,
                energyCost: 60,
                maintenanceCost: 75,
                duration: 1,
                description: 'Computer vision-based tire sorting'
            },
            {
                id: 'automated-processing',
                name: 'Automated Processing Line',
                department: 'processing',
                equipmentCost: 400000,
                laborCost: 200,
                energyCost: 200,
                maintenanceCost: 200,
                duration: 3,
                description: 'Integrated rim removal and shredding'
            },
            {
                id: 'advanced-separation',
                name: 'Advanced Multi-Stage Separation',
                department: 'separation',
                equipmentCost: 300000,
                laborCost: 150,
                energyCost: 120,
                maintenanceCost: 150,
                duration: 2,
                description: 'Enhanced magnetic and air separation'
            },
            {
                id: 'precision-granulation',
                name: 'Precision Granulation',
                department: 'processing',
                equipmentCost: 350000,
                laborCost: 180,
                energyCost: 180,
                maintenanceCost: 175,
                duration: 3,
                description: 'High-precision rubber granule production'
            },
            {
                id: 'automated-qc',
                name: 'Automated Quality Control',
                department: 'quality',
                equipmentCost: 100000,
                laborCost: 80,
                energyCost: 40,
                maintenanceCost: 50,
                duration: 0.5,
                description: 'Automated testing and quality assurance'
            },
            {
                id: 'smart-packaging',
                name: 'Smart Packaging System',
                department: 'packaging',
                equipmentCost: 80000,
                laborCost: 60,
                energyCost: 25,
                maintenanceCost: 40,
                duration: 1,
                description: 'Automated packaging with inventory tracking'
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
        return {
            daily: totalDailyCost,
            perTon: totalDailyCost / this.throughput,
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
        let totalEquipment = 0;
        const stepCosts = [];

        process.forEach(step => {
            const stepCost = this.calculateStepCost(step);
            totalDaily += stepCost.daily;
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

        return {
            totalDaily,
            costPerTon: totalDaily / this.throughput,
            annualCost: totalDaily * 365,
            totalEquipment,
            stepCosts,
            breakEvenRevenue: (totalDaily / this.throughput) * 1.2 // 20% margin
        };
    }

    initializeEventListeners() {
        document.getElementById('scenarioSelect').addEventListener('change', (e) => {
            this.currentScenario = e.target.value;
            this.renderSwimLane();
            this.updateCostAnalysis();
            this.renderCharts();
            this.updateScenarioButtons();
        });

        document.getElementById('throughput').addEventListener('input', (e) => {
            this.throughput = parseFloat(e.target.value) || 10;
            this.updateCostAnalysis();
            this.renderCharts();
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
        
        // Group steps by department
        const departments = {};
        process.forEach(step => {
            if (!departments[step.department]) {
                departments[step.department] = [];
            }
            departments[step.department].push(step);
        });

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
                    <div class="step-cost">Daily Cost: $${cost.daily.toFixed(2)}</div>
                    <div class="step-cost">Per Ton: $${cost.perTon.toFixed(2)}</div>
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

    formatDepartmentName(dept) {
        return dept.charAt(0).toUpperCase() + dept.slice(1).replace('-', ' ');
    }

    updateCostAnalysis() {
        const costs = this.calculateTotalCosts();
        
        document.getElementById('totalDailyCost').textContent = `$${costs.totalDaily.toFixed(2)}`;
        document.getElementById('costPerTon').textContent = `$${costs.costPerTon.toFixed(2)}`;
        document.getElementById('annualCost').textContent = `$${costs.annualCost.toLocaleString()}`;
        document.getElementById('breakEvenRevenue').textContent = `$${costs.breakEvenRevenue.toFixed(2)}`;
    }

    renderCharts() {
        this.renderCostBreakdownChart();
        this.renderRevenueChart();
    }

    renderCostBreakdownChart() {
        const ctx = document.getElementById('costBreakdownChart').getContext('2d');
        const costs = this.calculateTotalCosts();
        
        if (this.costBreakdownChart) {
            this.costBreakdownChart.destroy();
        }
        
        this.costBreakdownChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: costs.stepCosts.map(step => step.name),
                datasets: [{
                    data: costs.stepCosts.map(step => step.cost),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
                        '#4BC0C0', '#FF6384'
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
                                const percentage = ((value / costs.totalDaily) * 100).toFixed(1);
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
        
        // Revenue scenarios based on market prices
        const revenueScenarios = [
            { name: 'Conservative ($200/ton)', value: 200 },
            { name: 'Market Average ($230/ton)', value: 230 },
            { name: 'Optimistic ($260/ton)', value: 260 }
        ];
        
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }
        
        this.revenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: revenueScenarios.map(s => s.name),
                datasets: [
                    {
                        label: 'Revenue per Ton',
                        data: revenueScenarios.map(s => s.value),
                        backgroundColor: '#36A2EB'
                    },
                    {
                        label: 'Cost per Ton',
                        data: revenueScenarios.map(() => costs.costPerTon),
                        backgroundColor: '#FF6384'
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
                                return '$' + value;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                            }
                        }
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
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TireRecyclingAnalyzer();
});