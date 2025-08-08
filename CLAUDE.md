# Product Management System for Fitness Bloggers - Project Overview

## Project Context

This project implements a **full-stack web application** for fitness bloggers to manage affiliate products and track their promotional performance. See [`docs/task.md`](docs/task.md) for detailed requirements.

**Mission**: Enable fitness bloggers to efficiently add products for promotion and track their sales statistics through referral links.

## Project Architecture

### High-Level Structure
```
task1/
├── front/          # Next.js frontend dashboard
├── back/           # Mockoon API server (mock backend)
├── docs/           # Project requirements and documentation
└── CLAUDE.md       # This overview document
```

### Technology Stack
- **Frontend**: Next.js 15 + TypeScript + Shadcn/ui + Tailwind CSS
- **Backend**: Mockoon (mock API server for development)
- **Database**: JSON files (via Mockoon, simulating MongoDB structure)
- **State Management**: React Query + Zustand + Nuqs
- **Authentication**: Clerk (preconfigured in template)

### Development Approach
- **Frontend-first development** using existing dashboard template
- **Mock API backend** for rapid prototyping and development
- **Feature-based organization** with clear separation of concerns
- **AI-assisted development** using modern tools

## Core Features Overview

### 1. Product Management
- **Add/Edit Products**: Title, description, category, price, commission %
- **Product Categories**: Sports nutrition, equipment, clothing, gadgets
- **Product Listing**: Searchable and filterable table view

### 2. Referral System
- **Link Generation**: Unique referral links for each product
- **Link Display**: Easy copy/share functionality
- **Click Tracking**: Monitor link engagement (simulated)

### 3. Analytics Dashboard
- **Performance Metrics**: Click counts, potential earnings
- **Data Visualization**: Charts and graphs for insights
- **Top Performers**: Best-performing products tracking

### 4. User Interface
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Theme**: User preference support
- **Intuitive Navigation**: Dashboard-style layout

## Project Bootstrap Instructions

### Prerequisites
```bash
# Required tools
- Node.js 18+
- npm/pnpm
- Git
```

### Setup Steps

#### 1. Clone and Setup Frontend
```bash
cd front
npm install
cp env.example.txt .env.local
# Configure environment variables in .env.local
npm run dev
```
Frontend will be available at `http://localhost:3000`

#### 2. Setup Backend (Mockoon)
```bash
cd back
# Setup Mockoon server (instructions in back/CLAUDE.md)
# Server will run on http://localhost:3001
```

#### 3. Verify Integration
- Frontend should connect to backend API
- Test data should be visible in dashboard
- All CRUD operations should work

## Development Workflow

### Phase 1: Template Adaptation
1. ✅ **Template Analysis** - Understand existing structure
2. 🔄 **API Client Setup** - Configure axios + React Query
3. ⏳ **Remove Unused Features** - Clean up template
4. ⏳ **Update Navigation** - Modify for product management

### Phase 2: Core Features
1. ⏳ **Product Management** - CRUD operations
2. ⏳ **Analytics Dashboard** - Replace overview with stats
3. ⏳ **Settings Page** - User preferences
4. ⏳ **Referral Link System** - Generation and display

### Phase 3: Enhancement
1. ⏳ **Search & Filtering** - Improve product discovery
2. ⏳ **Data Visualization** - Charts and metrics
3. ⏳ **Export Features** - Data export functionality
4. ⏳ **Polish & UX** - Final improvements

## Directory-Specific Documentation

### Frontend (`front/`)
- **Architecture**: [`front/CLAUDE.md`](front/CLAUDE.md)
- **Patterns**: Component organization, state management, routing
- **Development**: Local development setup and best practices

### Backend (`back/`)
- **API Design**: `back/CLAUDE.md` (to be created)
- **Mock Data**: JSON structure and endpoints
- **Integration**: How frontend connects to backend

### Documentation (`docs/`)
- **Requirements**: [`docs/task.md`](docs/task.md) - Original assignment
- **Process**: Development process documentation (to be created)

## Progress Tracking

### 🎯 Project Milestones

#### Milestone 1: Foundation ✅
- [x] Project structure established
- [x] Frontend template analyzed
- [x] Architecture documentation created
- [x] Development environment ready

#### Milestone 2: Core Development 🔄
- [ ] API client integration
- [ ] Product management features
- [ ] Analytics dashboard
- [ ] Backend mock API setup

#### Milestone 3: Feature Complete ⏳
- [ ] All CRUD operations working
- [ ] Referral link system operational
- [ ] Analytics displaying real data
- [ ] Search and filtering implemented

#### Milestone 4: Polish & Deploy ⏳
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Error handling refinement
- [ ] Deployment preparation

### 🏗️ Component Status

| Feature | Frontend UI | API Integration | Backend Mock | Status |
|---------|------------|-----------------|--------------|--------|
| Product List | ✅ Template | ⏳ Pending | ⏳ Pending | In Progress |
| Add Product | ✅ Template | ⏳ Pending | ⏳ Pending | In Progress |
| Edit Product | ✅ Template | ⏳ Pending | ⏳ Pending | In Progress |
| Analytics | ⏳ Pending | ⏳ Pending | ⏳ Pending | Not Started |
| Settings | ⏳ Pending | ⏳ Pending | ⏳ Pending | Not Started |

## Quality Assurance

### Code Quality Standards
- **TypeScript**: Strict typing across all components
- **ESLint/Prettier**: Consistent code formatting
- **Component Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright (optional)

### Performance Targets
- **Load Time**: < 3 seconds first load
- **Bundle Size**: Optimized for production
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Meta tags and structured data

## Risk Mitigation

### Technical Risks
- **Template Compatibility**: Ensure all features work with base template
- **API Integration**: Mock-to-real API transition planning
- **State Management**: Complex state coordination across features
- **Performance**: Large product lists and analytics data

### Development Risks
- **Scope Creep**: Stick to core requirements first
- **Over-engineering**: Simple solutions preferred
- **Time Management**: 8-24 hour delivery window

## Success Metrics

### Functional Success
- [ ] All core features implemented and working
- [ ] CRUD operations complete and tested
- [ ] Analytics displaying meaningful data
- [ ] Responsive design on all devices

### Code Quality Success  
- [ ] Clean, maintainable codebase
- [ ] Proper error handling throughout
- [ ] TypeScript coverage > 95%
- [ ] No console errors in production

### User Experience Success
- [ ] Intuitive navigation and workflows
- [ ] Fast and responsive interactions
- [ ] Clear visual hierarchy and design
- [ ] Accessibility compliance

## Getting Help

### Documentation Hierarchy
1. **This file** - Project overview and coordination
2. **`front/CLAUDE.md`** - Frontend implementation details  
3. **`back/CLAUDE.md`** - Backend implementation details (TBD)
4. **`docs/task.md`** - Original requirements reference

### Development Support
- Use established patterns from template
- Follow architectural guidelines in respective CLAUDE.md files
- Maintain consistency across components and features
- Document new patterns as they emerge

---

*This document serves as the project's north star, coordinating development efforts across frontend and backend components while maintaining focus on delivery goals.*