export default function (plop) {
  // Helper to convert snake_case or kebab-case to PascalCase
  plop.setHelper('pascalCase', (text) => {
    return text
      .split(/[_-]/) // Split by underscore or hyphen
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  });

  // Helper to convert snake_case or kebab-case to camelCase
  plop.setHelper('camelCase', (text) => {
    const words = text.split(/[_-]/);
    return (
      words[0].toLowerCase() +
      words
        .slice(1)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('')
    );
  });

  // Helper to create readable name (Title Case with spaces)
  plop.setHelper('readableName', (text) => {
    return text
      .split(/[_-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });

  // Helper to capitalize first letter (kept for backward compatibility)
  plop.setHelper('capitalize', (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  });

  // Helper to uppercase
  plop.setHelper('uppercase', (text) => {
    return text.toUpperCase();
  });

  // Helper to pluralize (simple version)
  plop.setHelper('pluralize', (text) => {
    // Handle multi-word names by pluralizing the last word
    const words = text.split(/[_-]/);
    const lastWord = words[words.length - 1];
    const pluralized = lastWord.endsWith('y')
      ? lastWord.slice(0, -1) + 'ies'
      : lastWord + 's';
    words[words.length - 1] = pluralized;
    return words.join('_');
  });

  // Helper to check equality
  plop.setHelper('eq', function (a, b) {
    return a === b;
  });

  // Helper to check not equal
  plop.setHelper('ne', function (a, b) {
    return a !== b;
  });

  // Helper to get field type for Yup validation
  plop.setHelper('yupType', (type) => {
    const typeMap = {
      Number: 'number',
      String: 'string',
      Boolean: 'boolean',
      Date: 'date',
    };
    return typeMap[type] || 'string';
  });

  // Helper to get form component based on type
  plop.setHelper('formComponent', (type, fieldId, label) => {
    const componentMap = {
      Number: `            <NumberField
              formik={formik}
              fieldId={'${fieldId}'}
              label={t('${label}')}
            />`,
      Select: `            <AsyncSelectField
              formik={formik}
              fieldId={'${fieldId}'}
              label={t('${label}')}
              // TODO: Add options for this select field
            />`,
      Boolean: `            <Input
              type="checkbox"
              formik={formik}
              fieldId={'${fieldId}'}
              label={t('${label}')}
            />`,
      Date: `            <DatePicker
              formik={formik}
              fieldId={'${fieldId}'}
              label={t('${label}')}
            />`,
      default: `            <Input formik={formik} fieldId={'${fieldId}'} label={t('${label}')} />`,
    };
    return componentMap[type] || componentMap['default'];
  });

  plop.setGenerator('page', {
    description: 'Generate a new page with all components',
    prompts: [
      {
        type: 'input',
        name: 'pageName',
        message: 'What is the page name? (e.g., project, user, user_role)',
      },
      {
        type: 'input',
        name: 'primaryKey',
        message:
          'What is the primary key field name? (e.g., id, prj_id, emp_pk)',
        default: 'id',
      },
      {
        type: 'input',
        name: 'columns',
        message:
          'Enter columns in format: name:type (e.g., title:String, budget:Number, status:Select, is_active:Boolean)',
      },
    ],
    actions: (data) => {
      const pageName = data.pageName.toLowerCase();
      const pascalPageName = plop.getHelper('pascalCase')(pageName);
      const camelPageName = plop.getHelper('camelCase')(pageName);
      const pluralPageName = plop.getHelper('pluralize')(pageName);

      // Parse columns with types
      const columnList = data.columns.split(',').map((col) => {
        const [name, type] = col.trim().split(':');
        return {
          name: name.trim(),
          type: type ? type.trim() : 'String',
          label: name.trim().replace(/_/g, ' '),
        };
      });

      data.columns = columnList;
      data.permissionPrefix = pageName.replace(/_/g, '');

      // Add formatted names to data for path interpolation
      data.pascalPageName = pascalPageName;
      data.camelPageName = camelPageName;
      data.pluralPageName = pluralPageName;

      const actions = [
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/index.jsx',
          templateFile: 'plop-templates/PageIndex.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/columns.jsx',
          templateFile: 'plop-templates/Columns.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/Form.jsx',
          templateFile: 'plop-templates/Form.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/Add{{pascalPageName}}.jsx',
          templateFile: 'plop-templates/AddPage.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/Edit{{pascalPageName}}.jsx',
          templateFile: 'plop-templates/EditPage.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/queries/{{pluralPageName}}_query.jsx',
          templateFile: 'plop-templates/Query.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/helpers/{{pluralPageName}}_helper.js',
          templateFile: 'plop-templates/Helper.js.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/Layout.jsx',
          templateFile: 'plop-templates/Layout.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/OverviewTab.jsx',
          templateFile: 'plop-templates/OverviewTab.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
            displayNameField: columnList.find(
              (col) => col.name === 'title' || col.name === 'name'
            )?.name,
          },
        },
        {
          type: 'add',
          path: 'src/pages/{{pageName}}/Detail.jsx',
          templateFile: 'plop-templates/Detail.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pluralPageName,
            pageName,
            primaryKey: data.primaryKey,
          },
        },
        {
          type: 'add',
          path: 'src/routes/{{camelPageName}}Routes.jsx',
          templateFile: 'plop-templates/Routes.jsx.hbs',
          data: {
            capitalizedPageName: pascalPageName,
            pageName,
            hasChildRoutes: false,
          },
        },
        {
          type: 'add',
          path: 'src/utils/exportColumns/{{camelPageName}}ExportColumns.js',
          templateFile: 'plop-templates/ExportColumns.js.hbs',
          data: {
            pageName,
            camelCaseName: camelPageName,
          },
        },
      ];

      return actions;
    },
  });

  plop.setGenerator('child-page', {
    description: 'Generate a child page component (for tabs/navigation)',
    prompts: [
      {
        type: 'input',
        name: 'parentName',
        message: 'What is the parent page name? (e.g., project, employee)',
      },
      {
        type: 'input',
        name: 'childName',
        message:
          'What is the child component name? (e.g., project_payment, user_role)',
      },
      {
        type: 'input',
        name: 'primaryKey',
        message:
          'What is the child primary key field name? (e.g., id, payment_id, task_id)',
        default: 'id',
      },
      {
        type: 'input',
        name: 'columns',
        message:
          'Enter columns in format: name:type (e.g., amount:Number, payment_date:Date, status:String)',
      },
    ],
    actions: (data) => {
      const parentName = data.parentName.toLowerCase();
      const childName = data.childName.toLowerCase();

      // Use new helpers for proper formatting
      const pascalChildName = plop.getHelper('pascalCase')(childName);
      const camelChildName = plop.getHelper('camelCase')(childName);
      const readableChildName = plop.getHelper('readableName')(childName);
      const pluralChildName = plop.getHelper('pluralize')(childName);

      // Parse columns with types
      const columnList = data.columns.split(',').map((col) => {
        const [name, type] = col.trim().split(':');
        return {
          name: name.trim(),
          type: type ? type.trim() : 'String',
          label: name.trim().replace(/_/g, ' '),
        };
      });
      data.columns = columnList;
      data.permissionPrefix = childName.replace(/_/g, '');

      // Add formatted names to data for path interpolation
      data.pascalChildName = pascalChildName;
      data.camelChildName = camelChildName;
      data.pluralChildName = pluralChildName;

      // Create a single data object with all variables
      const templateData = {
        // Original variables for child templates
        capitalizedParentName: plop.getHelper('pascalCase')(parentName),
        capitalizedChildName: pascalChildName,
        parentName,
        childName,
        camelChildName,
        readableChildName,
        pluralChildName,
        primaryKey: data.primaryKey,

        // Mapped variables for reusing page templates
        capitalizedPageName: pascalChildName,
        pageName: childName,
        pluralPageName: pluralChildName,
      };

      const actions = [
        {
          type: 'add',
          path: 'src/pages/{{childName}}/index.jsx',
          templateFile: 'plop-templates/ChildIndex.jsx.hbs',
          data: templateData,
        },
        {
          type: 'add',
          path: 'src/pages/{{childName}}/columns.jsx',
          templateFile: 'plop-templates/ChildColumns.jsx.hbs',
          data: templateData,
        },
        {
          type: 'add',
          path: 'src/pages/{{childName}}/{{pascalChildName}}FormModal.jsx',
          templateFile: 'plop-templates/FormModal.jsx.hbs',
          data: templateData,
        },
        {
          type: 'add',
          path: 'src/queries/{{pluralChildName}}_query.jsx',
          templateFile: 'plop-templates/Query.jsx.hbs',
          data: templateData,
        },
        {
          type: 'add',
          path: 'src/helpers/{{pluralChildName}}_helper.js',
          templateFile: 'plop-templates/Helper.js.hbs',
          data: templateData,
        },
        {
          type: 'add',
          path: 'src/utils/exportColumns/{{camelChildName}}ExportColumns.js',
          templateFile: 'plop-templates/ExportColumns.js.hbs',
          data: {
            pageName: childName,
            camelCaseName: camelChildName,
            columns: columnList,
          },
        },
      ];

      return actions;
    },
  });
  plop.setGenerator('page-advanced', {
    description: 'Generate a new page with AdvancedSearch (no tree)',
    prompts: [
      {
        type: 'input',
        name: 'pageName',
        message: 'What is the page name? (e.g., user, role, user_role)',
      },
      {
        type: 'input',
        name: 'primaryKey',
        message:
          'What is the primary key field name? (e.g., id, user_id, role_id)',
        default: 'id',
      },
      {
        type: 'input',
        name: 'columns',
        message:
          'Enter columns in format: name:type (e.g., first_name:String, last_name:String, email:String, age:Number)',
      },
    ],
    actions: (data) => {
      const pageName = data.pageName.toLowerCase();
      const pascalPageName = plop.getHelper('pascalCase')(pageName);
      const camelPageName = plop.getHelper('camelCase')(pageName);
      const pluralPageName = plop.getHelper('pluralize')(pageName);

      // Parse columns with types
      const columnList = data.columns.split(',').map((col) => {
        const [name, type] = col.trim().split(':');
        return {
          name: name.trim(),
          type: type ? type.trim() : 'String',
          label: name.trim().replace(/_/g, ' '),
        };
      });

      data.columns = columnList;
      data.permissionPrefix = pageName.replace(/_/g, '');

      // Add formatted names to data for path interpolation
      data.pascalPageName = pascalPageName;
      data.camelPageName = camelPageName;
      data.pluralPageName = pluralPageName;

      const templateData = {
        capitalizedPageName: pascalPageName,
        pluralPageName,
        pageName,
        primaryKey: data.primaryKey,
      };

      const actions = [
        // Main page with AdvancedSearch
        {
          type: 'add',
          path: 'src/pages/{{pageName}}s/index.jsx',
          templateFile: 'plop-templates/PageIndexAdvanced.jsx.hbs',
          data: templateData,
        },
        // Columns file
        {
          type: 'add',
          path: 'src/pages/{{pageName}}s/columns.jsx',
          templateFile: 'plop-templates/ColumnsAdvanced.jsx.hbs',
          data: templateData,
        },
        // Form component (reuse existing Form template)
        {
          type: 'add',
          path: 'src/pages/{{pageName}}s/Form.jsx',
          templateFile: 'plop-templates/Form.jsx.hbs',
          data: templateData,
        },
        // Add page
        {
          type: 'add',
          path: 'src/pages/{{pageName}}s/Add{{pascalPageName}}.jsx',
          templateFile: 'plop-templates/AddPage.jsx.hbs',
          data: templateData,
        },
        // Edit page
        {
          type: 'add',
          path: 'src/pages/{{pageName}}s/Edit{{pascalPageName}}.jsx',
          templateFile: 'plop-templates/EditPage.jsx.hbs',
          data: templateData,
        },
        // Layout with search config
        {
          type: 'add',
          path: 'src/pages/{{pageName}}s/Layout.jsx',
          templateFile: 'plop-templates/Layout.jsx.hbs',
          data: templateData,
        },
        // Detail page with navigation
        {
          type: 'add',
          path: 'src/pages/{{pageName}}s/Detail.jsx',
          templateFile: 'plop-templates/Detail.jsx.hbs',
          data: templateData,
        },
        // Overview tab
        {
          type: 'add',
          path: 'src/pages/{{pageName}}s/OverviewTab.jsx',
          templateFile: 'plop-templates/OverviewTab.jsx.hbs',
          data: templateData,
        },
        // Queries
        {
          type: 'add',
          path: 'src/queries/{{pluralPageName}}_query.jsx',
          templateFile: 'plop-templates/Query.jsx.hbs',
          data: templateData,
        },
        // Helpers
        {
          type: 'add',
          path: 'src/helpers/{{pluralPageName}}_helper.js',
          templateFile: 'plop-templates/Helper.js.hbs',
          data: templateData,
        },
        // Export columns
        {
          type: 'add',
          path: 'src/utils/exportColumns/{{camelPageName}}ExportColumns.js',
          templateFile: 'plop-templates/ExportColumns.js.hbs',
          data: {
            pageName,
            camelCaseName: camelPageName,
          },
        },
        // Routes
        {
          type: 'add',
          path: 'src/routes/{{camelPageName}}Routes.jsx',
          templateFile: 'plop-templates/Routes.jsx.hbs',
          data: templateData,
        },
      ];

      return actions;
    },
  });
}
