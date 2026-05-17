# Project Management System (PMS) - Context for Claude

## Project Overview
This is a **React-based Project Management System** for governmental bureaus built with modern web technologies. It's a starting codebase that provides authentication, role-based access control, and CRUD operations for managing users, roles, lookups, and other entities.

## Tech Stack

### Core Technologies
- **React 19.2.0** - UI library with React Compiler enabled
- **Vite 7.2.4** - Build tool and dev server
- **React Router 7.6.2** - Client-side routing
- **Redux Toolkit 2.8.2** - State management
- **TanStack Query 5.81.5** - Server state management with caching
- **Bootstrap 5.3.6** + **React Bootstrap 2.10.10** - UI framework
- **Formik 2.4.6** + **Yup 1.6.1** - Form handling and validation
- **i18next 25.2.1** - Internationalization (English, Amharic, Afan Oromo)
- **Axios 1.10.0** - HTTP client with interceptors

### Additional Libraries
- **TanStack Table 8.21.3** - Advanced data tables with sorting, filtering, pagination
- **React DnD** - Drag and drop functionality
- **React Arborist** - Tree view components
- **ExcelJS** + **jsPDF** - Export functionality
- **React Quill** - Rich text editor
- **React Select** - Advanced select components
- **React Ethiopian Calendar** - Ethiopian calendar support
- **Leaflet** - Map integration
- **Plotly.js** - Data visualization

### Development Tools
- **ESLint** - Code linting with React-specific rules
- **Prettier** - Code formatting
- **Husky** + **lint-staged** - Pre-commit hooks
- **Plop** - Code generator for pages and components
- **Sass** - CSS preprocessing

## Project Structure

```
pms_client/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, fonts, SCSS
│   │   ├── css/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── scss/                # Theme and component styles
│   ├── components/
│   │   ├── Common/              # Reusable components
│   │   │   ├── TableContainer/  # Advanced table component
│   │   │   ├── AdvancedSearch.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── DeleteModal.jsx
│   │   │   ├── AsyncSelectField.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── NumberField.jsx
│   │   │   ├── FileUploadField.jsx
│   │   │   ├── ExportToExcel.jsx
│   │   │   ├── ExportToPdf.jsx
│   │   │   ├── PrintTable.jsx
│   │   │   └── ... (40+ common components)
│   │   ├── CommonForBoth/       # Shared layout components
│   │   ├── HorizontalLayout/    # Horizontal navigation layout
│   │   ├── VerticalLayout/      # Vertical sidebar layout
│   │   ├── Menu.jsx
│   │   ├── NonAuthLayout.jsx
│   │   └── ProtectedLayout.jsx
│   ├── constants/
│   │   ├── constantTexts.js
│   │   └── layout.js
│   ├── helpers/                 # API helper functions
│   │   ├── axios.js             # Axios instance with interceptors
│   │   ├── roles_helper.js
│   │   ├── users_helper.js
│   │   ├── permissions_helper.js
│   │   ├── lookups_helper.js
│   │   ├── lookup_types_helper.js
│   │   └── locations_helper.js
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.jsx
│   │   ├── usePermissions.js
│   │   ├── usePageFilters.js    # URL-based filtering
│   │   ├── useUrlPagination.js
│   │   ├── useIsMobile.js
│   │   └── useResizeObserver.js
│   ├── locales/                 # Translation files
│   │   ├── eng/translation.json
│   │   ├── am/translation.json
│   │   └── or/translation.json
│   ├── pages/                   # Feature modules
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   ├── dashboard/
│   │   ├── roles/
│   │   │   ├── index.jsx        # List page
│   │   │   ├── Layout.jsx       # Route wrapper
│   │   │   ├── AddRole.jsx
│   │   │   ├── EditRole.jsx
│   │   │   ├── Form.jsx
│   │   │   └── columns.jsx      # Table column definitions
│   │   ├── users/
│   │   │   ├── index.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── AddUser.jsx
│   │   │   ├── EditUser.jsx
│   │   │   ├── Detail.jsx       # Detail view with tabs
│   │   │   ├── OverviewTab.jsx
│   │   │   ├── Form.jsx
│   │   │   └── columns.jsx
│   │   ├── lookup_types/
│   │   └── lookups/
│   ├── queries/                 # TanStack Query hooks
│   │   ├── roles_query.jsx
│   │   ├── users_query.jsx
│   │   ├── permissions_query.jsx
│   │   ├── lookups_query.jsx
│   │   ├── lookup_types_query.jsx
│   │   └── locations_query.jsx
│   ├── routes/
│   │   ├── index.jsx            # Route definitions
│   │   ├── AccessGuard.jsx      # Permission-based route guard
│   │   ├── roleRoutes.jsx
│   │   ├── userRoutes.jsx
│   │   ├── lookupRoutes.jsx
│   │   └── lookupTypeRoutes.jsx
│   ├── store/                   # Redux store
│   │   ├── index.js
│   │   ├── reducers.js
│   │   ├── auth/
│   │   │   └── authSlice.js     # Authentication state
│   │   └── layout/
│   │       └── layoutSlice.js   # Layout preferences
│   ├── utils/
│   │   ├── commonMethods.js
│   │   ├── validations.js
│   │   ├── layoutStorage.js
│   │   ├── exportColumnsForLists.jsx
│   │   ├── constants/
│   │   └── exportColumns/       # Export column definitions
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   ├── i18n.jsx                 # i18n configuration
│   ├── QueryProvider.jsx        # TanStack Query provider
│   └── index.css
├── plop-templates/              # Code generation templates
├── scripts/
│   └── remove-comments.mjs
├── .env                         # Environment variables
├── .gitignore
├── .husky/                      # Git hooks
├── eslint.config.mjs
├── package.json
├── plopfile.js                  # Code generator config
├── prettier.config.js
├── vite.config.js
└── README.md
```

## Architecture Patterns

### 1. Authentication & Authorization

**Token-Based Authentication:**
- JWT tokens stored in Redux state
- Refresh tokens handled via HTTP-only cookies
- Automatic token refresh every 5 minutes
- Axios interceptors for attaching tokens and handling 401 errors

**Permission System:**
- Django-style permissions (e.g., `auth.view_group`, `accounts.add_user`)
- `usePermissions` hook for checking permissions
- `AccessGuard` component for route-level protection
- Permission checks in UI components to show/hide actions

**Key Files:**
- `src/store/auth/authSlice.js` - Auth state management
- `src/helpers/axios.js` - HTTP client with interceptors
- `src/hooks/useAuth.jsx` - Auth hook
- `src/hooks/usePermissions.js` - Permission checking
- `src/routes/AccessGuard.jsx` - Route guard component

### 2. Data Fetching Pattern (TanStack Query)

**Query Structure:**
```javascript
// queries/roles_query.jsx
export const useFetchRoles = (params = {}, isActive = true) => {
  return useQuery({
    queryKey: ['role', 'fetch', params],
    queryFn: () => getRoles(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: isActive,
  });
};
```

**Mutation Structure:**
```javascript
export const useAddRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRole,
    meta: {
      successMessage: t('role_added_successfully'),
      errorMessage: t('role_add_failed'),
    },
    onMutate: async (newRole) => {
      // Optimistic updates
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['role'] });
    },
  });
};
```

**Helper Functions:**
```javascript
// helpers/roles_helper.js
export const getRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/groups/?${queryString}` : '/groups/';
  return await get(url);
};
```

### 3. Page Structure Pattern

Each feature module follows this structure:

**1. Layout Component** - Manages URL-based filters
```javascript
// pages/roles/Layout.jsx
export default function RolesLayout() {
  const pageFilter = usePageFilters({
    textSearchKeys: ['name'],
    dateSearchKeys: ['created_at'],
  });
  return <Outlet context={{ pageFilter }} />;
}
```

**2. List Page** - Displays data table with search/filter
```javascript
// pages/roles/index.jsx
function Roles() {
  const { pageFilter } = useOutletContext();
  const { pagination, onChange } = useUrlPagination(
    pageFilter.filters,
    pageFilter.setFilters
  );
  
  return (
    <AdvancedSearch pageFilter={pageFilter} searchHook={useSearchRoles}>
      {({ result, isLoading }) => (
        <TableContainer
          data={result?.data ?? []}
          columns={columns}
          isLoading={isLoading}
          paginationState={pagination}
          onPaginationChange={onChange}
        />
      )}
    </AdvancedSearch>
  );
}
```

**3. Form Component** - Reusable form for add/edit
```javascript
// pages/roles/Form.jsx
export default function RoleForm({ formik, isEdit }) {
  return (
    <Form>
      <Input formik={formik} fieldId="name" label={t('name')} />
      {/* More fields */}
    </Form>
  );
}
```

**4. Add/Edit Pages** - Wrapper pages for forms
```javascript
// pages/roles/AddRole.jsx
export default function AddRole() {
  const addMutation = useAddRole();
  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: roleSchema,
    onSubmit: (values) => addMutation.mutate(values),
  });
  return <RoleForm formik={formik} isEdit={false} />;
}
```

**5. Columns Definition** - Table column configuration
```javascript
// pages/roles/columns.jsx
export const useRoleColumns = (handleDelete, hasPermission) => {
  return useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'created_at', header: 'Created' },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionsCell
          onEdit={() => navigate(`/roles/${row.original.id}/edit`)}
          onDelete={() => handleDelete(row.original)}
          canEdit={hasPermission('auth.change_group')}
          canDelete={hasPermission('auth.delete_group')}
        />
      ),
    },
  ], [handleDelete, hasPermission]);
};
```

### 4. Routing Pattern

**Route Definition:**
```javascript
// routes/roleRoutes.jsx
const roleRoutes = {
  path: '/roles',
  element: <RolesLayout />,
  permission: 'auth.view_group',
  children: [
    { index: true, element: <Roles /> },
    { path: 'add', element: <AddRole />, permission: 'auth.add_group' },
    { path: ':id/edit', element: <EditRole />, permission: 'auth.change_group' },
  ],
};
```

**Route Registration:**
```javascript
// routes/index.jsx
export const protectedRoutes = [
  roleRoutes,
  userRoutes,
  lookupRoutes,
  lookupTypeRoutes,
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/', element: <Dashboard /> },
];
```

### 5. URL-Based State Management

**usePageFilters Hook:**
- Manages filters in URL query parameters using `nuqs`
- Supports text search, dropdown filters, date ranges
- Automatic pagination reset on filter changes
- Provides `getApiParams()` for API calls

**Example Usage:**
```javascript
const pageFilter = usePageFilters({
  textSearchKeys: ['name', 'email'],
  dropdownSearchKeys: [
    { key: 'status', options: { active: 'Active', inactive: 'Inactive' } }
  ],
  dateSearchKeys: ['created_at'],
});

// URL: /users?name=john&status=active&page=2
// Automatically synced with URL
```

### 6. Advanced Search Component

**Features:**
- Primary filters (always visible)
- Secondary filters (collapsible)
- Cascading dropdowns (region → zone → woreda)
- Date range pickers (Ethiopian calendar support)
- Real-time URL synchronization
- Export search parameters

**Usage:**
```javascript
<AdvancedSearch
  pageFilter={pageFilter}
  searchHook={useSearchUsers}
  textSearchKeys={['name', 'email']}
  dropdownSearchKeys={[{ key: 'status', options: statusOptions }]}
  dateSearchKeys={['created_at']}
>
  {({ result, isLoading }) => (
    <TableContainer data={result?.data} isLoading={isLoading} />
  )}
</AdvancedSearch>
```

### 7. Table Component Features

**TableContainer Component:**
- Server-side and client-side pagination
- Column sorting and filtering
- Column visibility toggle
- Column pinning (sticky columns)
- Global search
- Export to Excel/PDF
- Print functionality
- Responsive design
- Custom cell renderers

**Example:**
```javascript
<TableContainer
  data={users}
  columns={userColumns}
  isLoading={isLoading}
  isPagination={true}
  isServerSidePagination={true}
  totalRows={totalRows}
  pageCount={pageCount}
  paginationState={pagination}
  onPaginationChange={onChange}
  isAddButton={hasPermission('accounts.add_user')}
  onAddClick={handleAdd}
  exportColumns={userExportColumns}
/>
```

## Code Generation (Plop)

The project includes Plop generators for scaffolding new pages:

### Generate Standard Page
```bash
npm run generate:page
```
Creates: index, Layout, Add, Edit, Form, columns, queries, helpers, routes

### Generate Child Page (for tabs)
```bash
npm run generate:child-page
```
Creates: index, columns, FormModal, queries, helpers

### Generate Advanced Page
```bash
npm run generate:page-advanced
```
Creates: page with AdvancedSearch integration

**Template Variables:**
- `pageName` - snake_case name (e.g., `user_role`)
- `primaryKey` - primary key field (default: `id`)
- `columns` - field definitions (e.g., `name:String,age:Number,status:Select`)

## API Integration

### Base Configuration
```javascript
// .env
VITE_NODE_ENV="development"
VITE_API_URL=http://127.0.0.1:8000/
VITE_FILE_URL=http://127.0.0.1:8000/
```

### API Endpoints Pattern
- **List:** `GET /api/v1/groups/` (with query params)
- **Detail:** `GET /api/v1/groups/:id/`
- **Create:** `POST /api/v1/groups/`
- **Update:** `PUT /api/v1/groups/:id/`
- **Partial Update:** `PATCH /api/v1/groups/:id/`
- **Delete:** `DELETE /api/v1/groups/:id/`
- **Custom Actions:** `POST /api/v1/groups/:id/add_permissions/`

### Response Format
```javascript
{
  data: [...],  // or single object
  pagination: {
    current_page: 1,
    per_page: 10,
    total: 100,
    total_pages: 10,
    has_next: true,
    has_prev: false
  }
}
```

## Internationalization (i18n)

**Supported Languages:**
- English (`eng`)
- Amharic (`am`)
- Afan Oromo (`or`)

**Usage:**
```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome_message')}</h1>;
}
```

**Translation Files:**
- `src/locales/eng/translation.json`
- `src/locales/am/translation.json`
- `src/locales/or/translation.json`

## Styling

**SCSS Structure:**
- `src/assets/scss/theme.scss` - Main theme file
- `src/assets/scss/custom/components/` - Component styles
- `src/assets/scss/custom/structure/` - Layout styles
- `src/assets/scss/custom/plugins/` - Third-party plugin styles
- `src/assets/scss/rtl/` - RTL support

**Bootstrap Customization:**
- Custom variables in `_root.scss`
- Component overrides in `custom/components/`
- Utility classes in `_helper.scss`

## Common Components

### Form Components
- `Input` - Text input with Formik integration
- `NumberField` - Number input with validation
- `AsyncSelectField` - Async dropdown with search
- `DatePicker` - Date picker with Ethiopian calendar
- `FileUploadField` - File upload with preview
- `ColorCodeInput` - Color picker
- `PhoneInput` - Phone number input

### UI Components
- `Breadcrumb` - Navigation breadcrumbs
- `DeleteModal` - Confirmation modal for deletions
- `DetailModal` - Modal for viewing details
- `RightOffCanvas` - Slide-in panel
- `IconButton` - Icon-based button
- `ColorBadge` - Colored badge component

### Data Components
- `TableContainer` - Advanced data table
- `TreeTableContainer` - Tree view with table
- `TreeForLists` - Hierarchical tree view
- `AdvancedSearch` - Search with filters
- `ExportToExcel` - Excel export functionality
- `ExportToPdf` - PDF export functionality
- `PrintTable` - Print functionality

### Layout Components
- `DetailLayout` - Standard detail page layout
- `DetailTabs` - Tabbed navigation for details
- `FormActionButtons` - Save/Cancel buttons
- `SpinnerOnDetail` - Loading spinner

## Development Workflow

### Running the Project
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Pre-commit Hooks
- Automatic linting and formatting via Husky
- Runs on staged files only

## Key Conventions

### Naming Conventions
- **Components:** PascalCase (e.g., `UserList.jsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.jsx`)
- **Helpers:** snake_case with `_helper` suffix (e.g., `users_helper.js`)
- **Queries:** snake_case with `_query` suffix (e.g., `users_query.jsx`)
- **Routes:** camelCase with `Routes` suffix (e.g., `userRoutes.jsx`)

### File Organization
- Group by feature, not by type
- Each feature has its own folder in `pages/`
- Shared components in `components/Common/`
- API logic in `helpers/` and `queries/`

### State Management
- **Local UI state:** React useState
- **Form state:** Formik
- **Server state:** TanStack Query
- **Global app state:** Redux (auth, layout)
- **URL state:** nuqs (filters, pagination)

### Permission Naming
- Format: `app_label.action_model`
- Examples: `auth.view_group`, `accounts.add_user`, `accounts.change_user`

## Common Tasks

### Adding a New Page
1. Run `npm run generate:page`
2. Enter page name (e.g., `project`)
3. Enter primary key (default: `id`)
4. Enter columns (e.g., `title:String,budget:Number,status:Select`)
5. Import route in `src/routes/index.jsx`
6. Add translations to locale files

### Adding a Permission Check
```javascript
import { usePermissions } from '../../hooks/usePermissions';

function MyComponent() {
  const { hasPermission } = usePermissions();
  
  return (
    <>
      {hasPermission('auth.add_group') && (
        <Button onClick={handleAdd}>Add</Button>
      )}
    </>
  );
}
```

### Adding a New API Endpoint
1. Create helper function in `helpers/`
2. Create query/mutation hook in `queries/`
3. Use hook in component

### Customizing Table Columns
```javascript
export const useMyColumns = () => {
  return useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ getValue }) => <strong>{getValue()}</strong>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      filterFn: 'equals',
      enableColumnFilter: true,
    },
  ], []);
};
```

## Environment Variables

```env
VITE_NODE_ENV="development"           # Environment mode
VITE_API_URL=http://127.0.0.1:8000/  # Backend API URL
VITE_FILE_URL=http://127.0.0.1:8000/ # File server URL
VITE_GEMINI_API_KEY=...              # Gemini API key (if used)
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- No IE11 support

## Performance Optimizations
- React Compiler enabled for automatic memoization
- Code splitting with lazy loading
- TanStack Query caching (5-minute stale time)
- Debounced search inputs
- Virtual scrolling for large lists (via react-arborist)

## Security Features
- JWT token authentication
- HTTP-only cookies for refresh tokens
- CSRF protection
- Permission-based access control
- Secure axios configuration
- Input validation with Yup

## Known Patterns to Follow

### 1. Always use translation keys
```javascript
// Good
<h1>{t('welcome_message')}</h1>

// Bad
<h1>Welcome</h1>
```

### 2. Use permission checks for actions
```javascript
// Good
{hasPermission('auth.add_group') && <AddButton />}

// Bad
<AddButton /> // Always visible
```

### 3. Use TanStack Query for server data
```javascript
// Good
const { data, isLoading } = useFetchRoles();

// Bad
const [data, setData] = useState([]);
useEffect(() => { fetchRoles().then(setData); }, []);
```

### 4. Use URL state for filters
```javascript
// Good
const pageFilter = usePageFilters({ textSearchKeys: ['name'] });

// Bad
const [searchTerm, setSearchTerm] = useState('');
```

### 5. Use Formik for forms
```javascript
// Good
const formik = useFormik({ initialValues, validationSchema, onSubmit });
<Input formik={formik} fieldId="name" />

// Bad
<input value={name} onChange={(e) => setName(e.target.value)} />
```

## Tips for Claude

1. **When creating new pages:** Use the Plop generator pattern as reference
2. **When adding API calls:** Follow the helper → query → component pattern
3. **When adding permissions:** Use Django-style permission strings
4. **When styling:** Use Bootstrap classes first, custom SCSS second
5. **When translating:** Add keys to all three locale files
6. **When handling forms:** Always use Formik + Yup validation
7. **When fetching data:** Use TanStack Query hooks
8. **When managing filters:** Use usePageFilters for URL synchronization
9. **When creating tables:** Use TableContainer with proper column definitions
10. **When checking permissions:** Use usePermissions hook consistently

## Project Goals
- Provide a solid foundation for governmental project management
- Maintain clean, consistent code patterns
- Support multiple languages (English, Amharic, Afan Oromo)
- Implement robust authentication and authorization
- Enable rapid feature development through code generation
- Ensure accessibility and responsive design
- Support data export and reporting capabilities
