# Tire Recycling Financial Analysis Tool

A comprehensive web-based tool for analyzing tire recycling processes with interactive swim lane diagrams, cost analysis, and multi-scenario planning capabilities.

## 🚀 Live Demo

**[View Live Application](https://menghanzhao.github.io/tireco-financial-analysis/)**

## 📋 Overview

This tool helps entrepreneurs and analysts evaluate tire recycling ventures by:
- Visualizing process workflows with swim lane diagrams
- Calculating detailed cost breakdowns for each process step
- Comparing different scenarios (baseline vs proposed vs custom)
- Performing multi-scenario financial analysis
- Exporting diagrams and data for presentations

## ✨ Features

### 📊 Interactive Swim Lane Diagrams
- Visual representation of tire recycling processes organized by department
- Click any process step to edit costs, duration, and details
- Automatic cost calculations displayed on each step
- Real-time updates when parameters change

### 💰 Comprehensive Cost Analysis
- **Equipment Costs**: One-time capital investments with depreciation
- **Operating Costs**: Daily labor, energy, and maintenance expenses
- **Cost Per Ton**: Automatically calculated based on throughput
- **Annual Projections**: Full year cost estimates
- **Break-even Analysis**: Revenue targets with margin calculations

### 🎯 Multi-Scenario Management
- **Baseline Process**: Current industry standard (10 steps)
- **Proposed Process**: Optimized automated solution (8 steps)
- **Custom Scenarios**: Create unlimited custom processes
- **Scenario Comparison**: Side-by-side cost and efficiency analysis

### 📈 Visual Analytics
- **Cost Breakdown Charts**: Pie charts showing cost distribution by process step
- **Revenue Analysis**: Bar charts comparing costs vs revenue scenarios
- **Comparison Tables**: Detailed metric comparisons between scenarios

### 💾 Data Persistence
- Scenarios saved to browser localStorage
- Settings persist between sessions
- Export capabilities for diagrams and data

## 🏗️ Technical Architecture

### File Structure
```
tireco-financial-analysis/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # Core JavaScript application logic
└── README.md           # Documentation (this file)
```

### Core Components

#### 1. TireRecyclingAnalyzer Class (`script.js`)
The main application class that manages all functionality:

```javascript
class TireRecyclingAnalyzer {
    constructor() {
        this.baselineProcess = this.createBaselineProcess();    // Built-in baseline
        this.proposedProcess = this.createProposedProcess();    // Built-in proposed
        this.customScenarios = this.loadCustomScenarios();     // User-created scenarios
        this.currentScenario = 'baseline';                     // Active scenario
        this.throughput = 10;                                  // Daily throughput (tons)
    }
}
```

#### 2. Process Data Structure
Each process step contains:
```javascript
{
    id: 'unique-identifier',
    name: 'Process Step Name',
    department: 'department-category',
    equipmentCost: 50000,      // One-time equipment cost ($)
    laborCost: 200,           // Daily labor cost ($)
    energyCost: 50,           // Daily energy cost ($)
    maintenanceCost: 25,      // Daily maintenance cost ($)
    duration: 4,              // Process duration (hours)
    description: 'Step description'
}
```

#### 3. Cost Calculation Engine
```javascript
calculateStepCost(step) {
    const dailyEquipmentCost = (step.equipmentCost * 0.1) / 365; // 10% annual depreciation
    const totalDailyCost = dailyEquipmentCost + step.laborCost + step.energyCost + step.maintenanceCost;
    return {
        daily: totalDailyCost,
        perTon: totalDailyCost / this.throughput,
        breakdown: { equipment, labor, energy, maintenance }
    };
}
```

### Key Methods

#### Scenario Management
- `createScenario()`: Creates new custom scenarios
- `saveCurrentScenario()`: Saves scenario to localStorage
- `deleteCurrentScenario()`: Removes custom scenarios
- `populateScenarioDropdown()`: Updates UI dropdown

#### Process Visualization
- `renderSwimLane()`: Generates swim lane diagram
- `renderCharts()`: Creates cost breakdown and revenue charts
- `updateCostAnalysis()`: Refreshes all financial calculations

#### Data Persistence
- `loadCustomScenarios()`: Retrieves saved scenarios from localStorage
- `saveCustomScenarios()`: Persists scenarios to localStorage

## 🎨 User Interface

### Control Panel
- **Scenario Dropdown**: Switch between baseline, proposed, and custom scenarios
- **Scenario Management Buttons**:
  - `+` Create new scenario
  - `💾` Save current scenario
  - `🗑️` Delete custom scenario
- **Throughput Input**: Adjust daily processing capacity
- **Action Buttons**: Add steps, export diagrams, compare scenarios

### Process Flow Diagram
- **Department Swim Lanes**: Organized by Collection, Transportation, Processing, etc.
- **Process Steps**: Interactive boxes showing costs and duration
- **Flow Arrows**: Visual process flow indicators

### Financial Dashboard
- **Summary Cards**: Total daily cost, cost per ton, annual cost, break-even revenue
- **Cost Breakdown Chart**: Doughnut chart showing cost distribution
- **Revenue Analysis Chart**: Bar chart comparing costs vs revenue scenarios

## 📊 Built-in Scenarios

### Baseline Process (Current Industry Standard)
10-step traditional process:
1. Tire Collection
2. Transportation
3. Sorting & Inspection
4. Rim & Sidewall Removal
5. Primary Shredding
6. Secondary Shredding
7. Steel Separation
8. Granulation & Refinement
9. Quality Control
10. Packaging & Storage

**Estimated Costs**: ~$170/ton, ~$1.15M equipment investment

### Proposed Process (Automated Optimization)
8-step automated process:
1. Automated Collection System
2. Smart Transportation
3. AI-Powered Sorting
4. Automated Processing Line
5. Advanced Multi-Stage Separation
6. Precision Granulation
7. Automated Quality Control
8. Smart Packaging System

**Estimated Costs**: ~$137/ton, ~$1.5M equipment investment
**Benefits**: 19% cost reduction, improved efficiency

## 💡 Usage Guide

### Getting Started
1. Open the application in your web browser
2. Review the baseline process and costs
3. Switch to "Proposed Process" to see the optimized version
4. Use "Compare Scenarios" to see detailed differences

### Creating Custom Scenarios
1. Click the `+` button next to the scenario dropdown
2. Enter a name and description for your scenario
3. Choose a base scenario (baseline, proposed, or current)
4. Click "Create Scenario"
5. Modify process steps as needed

### Editing Process Steps
1. Click any process step in the swim lane diagram
2. Modify costs, duration, and other parameters
3. Click "Save Step" to apply changes
4. The system automatically creates a custom scenario if editing built-in processes

### Analyzing Results
- Review the financial dashboard for key metrics
- Use the cost breakdown chart to identify major cost drivers
- Compare revenue scenarios to assess profitability
- Export diagrams for presentations and reports

## 🔧 Customization

### Adding New Departments
Modify the department options in the step editor:
```javascript
<select id="stepDepartment">
    <option value="collection">Collection</option>
    <option value="transportation">Transportation</option>
    <option value="processing">Processing</option>
    <option value="separation">Separation</option>
    <option value="quality">Quality Control</option>
    <option value="packaging">Packaging</option>
    <option value="new-department">New Department</option>  // Add here
</select>
```

### Modifying Cost Calculations
Update the cost calculation logic in `calculateStepCost()`:
```javascript
// Example: Change depreciation rate from 10% to 15%
const dailyEquipmentCost = (step.equipmentCost * 0.15) / 365;
```

### Adding Revenue Scenarios
Modify the revenue scenarios in `renderRevenueChart()`:
```javascript
const revenueScenarios = [
    { name: 'Conservative ($200/ton)', value: 200 },
    { name: 'Market Average ($230/ton)', value: 230 },
    { name: 'Optimistic ($260/ton)', value: 260 },
    { name: 'Premium Market ($300/ton)', value: 300 }  // Add new scenarios
];
```

## 🌐 Browser Compatibility

- **Chrome**: ✅ Fully supported
- **Firefox**: ✅ Fully supported
- **Safari**: ✅ Fully supported
- **Edge**: ✅ Fully supported

### Requirements
- Modern browser with JavaScript enabled
- localStorage support for data persistence
- Canvas support for chart rendering

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with side-by-side charts
- **Tablet**: Optimized layout with stacked components
- **Mobile**: Single-column layout with touch-friendly controls

## 🔐 Data Privacy

- All data is stored locally in your browser's localStorage
- No data is transmitted to external servers
- Scenarios and settings persist only on your device
- Clear browser data to reset all scenarios

## 🚀 Deployment

### GitHub Pages (Current)
The application is deployed using GitHub Pages at:
`https://menghanzhao.github.io/tireco-financial-analysis/`

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required - pure HTML/CSS/JavaScript

### Custom Deployment
The application can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

## 🤝 Contributing

This tool was created for tire recycling venture analysis. Contributions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙋‍♀️ Support

For questions or issues:
1. Check the browser console for error messages
2. Ensure localStorage is enabled
3. Try refreshing the page to reset the application
4. Clear browser data if scenarios become corrupted

---

**Built with ❤️ for sustainable tire recycling ventures**