---
description: 'Analyze the entire codebase and generate a comprehensive developer overview document'
agent: 'agent'
tools: ['vscode', 'read/readFile', 'read/getTaskOutput', 'edit', 'search', 'better-auth/search', 'todo']
---

# Create Extensive Developer Overview

You are a senior full-stack developer with deep expertise in React Native, Expo Router, TypeScript, Convex backend architecture, and state management patterns (Zustand). Your task is to thoroughly analyze the codebase structure and generate a comprehensive developer overview document that serves as an onboarding guide for new developers.

## Primary Task

Analyze the entire codebase at `${workspaceFolder}` and create an extensive, structured developer overview that documents:

1. **Project Architecture & Tech Stack** - High-level technology choices and why they matter
2. **Directory Structure** - Purpose and organization of each directory
3. **Key Files & Their Roles** - Important files that new developers must understand
4. **Core Patterns & Conventions** - Established patterns for styling, state management, typing, and component structure
5. **Frontend Architecture** (React Native + Expo Router) - How screens, routing, and components are organized
6. **Backend Architecture** (Convex) - How server functions are structured and used
7. **State Management** - Zustand vs Convex decision trees and usage patterns
8. **Styling System** - NativeWind + CSS variables architecture and how to use theme tokens
9. **Type Safety Approach** - TypeScript strict mode and type inference from Convex
10. **Development Workflows** - How to start development, run on devices, deploy, etc.
11. **Common Patterns & Anti-patterns** - What to do and what to avoid
12. **Cross-platform Considerations** - iOS, Android, Web differences
13. **Environment & Configuration** - Setup, environment variables, project config
14. **Dependencies & Tooling** - Key dependencies and what they do
15. **Performance & Optimization** - React compiler, new architecture, optimization patterns

## Instructions

### Phase 1: Codebase Exploration
1. **Examine package.json** - Identify all major dependencies and scripts
2. **Review project structure** - Walk through each directory and understand its purpose
3. **Analyze key configuration files**:
   - `app.json` (Expo config)
   - `tsconfig.json` (TypeScript configuration)
   - `tailwind.config.ts` (NativeWind theme configuration)
   - `.github/copilot-instructions.md` (existing developer guidelines)
4. **Map out the app structure**:
   - Explore `app/` directory for Expo Router setup
   - Examine `convex/` directory for backend functions
   - Review `lib/stores/` for Zustand stores
   - Check `lib/utils.ts` and `lib/theme.ts` for shared utilities
   - Analyze `styles/global.css` for theme variables

### Phase 2: Component & Function Analysis
1. **Frontend Components** - Review key components in `app/` to understand:
   - Routing structure and how Expo Router is used
   - Component patterns and organization
   - State management integration (Zustand + Convex)
2. **Backend Functions** - Examine `convex/` to understand:
   - Query/mutation/action patterns
   - Function naming conventions
   - Type generation and API usage
3. **State Stores** - Analyze `lib/stores/` to understand:
   - Zustand store patterns
   - Persistence and AsyncStorage usage
   - Store composition and reusability

### Phase 3: Pattern Documentation
1. **Identify recurring patterns**:
   - How are components styled?
   - How is server data fetched and managed?
   - How is client state handled?
   - How are forms and validation structured?
2. **Document best practices** evident in the codebase
3. **Note anti-patterns to avoid** based on code structure

### Phase 4: Integration & Workflow Documentation
1. **Development workflow** - How to start the project locally
2. **Environment setup** - .env configuration and Convex setup
3. **Build & deployment** - How to build for different platforms
4. **Type generation** - How Convex generates types
5. **Testing approach** (if applicable)

## Output Requirements

Create a markdown document named `DEVELOPER_OVERVIEW.md` in the `docs/` directory with the following structure:

```markdown
# Extensive Developer Overview

## 1. Project Architecture & Tech Stack
- Overview of technology choices
- Rationale for each choice
- Key integrations

## 2. Directory Structure
- `app/` - Purpose and contents
- `convex/` - Purpose and contents
- `lib/` - Purpose and contents
- `styles/` - Purpose and contents
- Other directories...

## 3. Key Files Reference
- file.tsx - Purpose and when to edit
- convex/function.ts - Purpose and usage
- ...

## 4. Frontend Architecture
### Routing (Expo Router)
- How file-based routing works
- Route structure and conventions
- Navigation patterns

### Components & Screens
- Component organization
- Screen hierarchy
- Reusable component patterns

## 5. Backend Architecture (Convex)
### Function Structure
- Query pattern
- Mutation pattern
- Action pattern
- Type generation

### Database Integration
- How data flows from backend to frontend
- Real-time subscriptions
- Data validation

## 6. State Management
### Decision Tree
- When to use Zustand
- When to use Convex
- Anti-patterns to avoid

### Zustand Stores
- Available stores and their purpose
- How to create new stores
- Store persistence

### Convex Integration
- Using useQuery()
- Using useMutation()
- Real-time updates

## 7. Styling & Theming
### NativeWind + CSS Variables
- Available semantic tokens
- How to use classNames
- Theme switching

### CSS Variables System
- Theme variables defined in global.css
- Dark mode support
- Customization patterns

## 8. TypeScript & Type Safety
- Strict mode enabled
- Path aliases
- Type inference from Convex
- Common typing patterns

## 9. Development Workflows
### Local Development
- Terminal setup (Convex + Expo)
- Environment variables
- Common commands

### Platform-Specific Development
- iOS development
- Android development
- Web development

### Version Control & Branching
- Branch conventions
- Commit patterns

## 10. Common Patterns
### ✅ Good Patterns
- [Specific examples from codebase]

### ❌ Anti-patterns to Avoid
- [Specific examples to avoid]

## 11. Dependencies & Key Libraries
- React Native
- Expo Router
- Convex
- Zustand
- NativeWind
- TypeScript
- Others...

## 12. Performance & Optimization
- React Compiler enabled
- New Architecture usage
- Optimization best practices

## 13. Troubleshooting & Common Issues
- Connection issues
- Type errors
- Environment setup problems

## 14. Quick Reference
- Useful commands
- File locations
- Documentation links
```

## Quality Assurance

### Success Criteria
✅ Document is comprehensive yet organized - a new developer can understand the entire architecture
✅ All major directories and key files are documented with purpose and context
✅ State management patterns are clearly explained with decision trees
✅ Development workflows are step-by-step and actionable
✅ Common patterns are identified with code examples from the actual codebase
✅ Cross-platform considerations are documented
✅ The document references or incorporates existing guidance from `.github/copilot-instructions.md`

### Validation Steps
1. **Coverage Check** - Ensure all directories in the workspace are documented
2. **Pattern Accuracy** - Verify patterns documented match actual code
3. **Clarity Test** - Can a junior developer understand the architecture from this document?
4. **Completeness** - Are development workflows fully explained?
5. **Actionability** - Can developers follow the guidance to accomplish real tasks?

### Additional Notes
- Include specific code examples from the actual codebase where helpful
- Reference line numbers when pointing to specific implementations
- Use clear, consistent formatting with proper markdown structure
- Keep technical depth appropriate for both junior and senior developers
- Ensure the document stays up-to-date friendly (note where updates may be needed)
- Include links to referenced files in the codebase where possible
