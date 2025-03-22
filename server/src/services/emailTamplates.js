const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

/**
 * Loads and compiles a Handlebars template.
 * @param {string} templateName - The name of the template file (without extension).
 * @param {object} data - The data to pass into the template.
 * @returns {string} - The compiled HTML.
 */
const loadTemplate = (templateName, data) => {
  try {
    // Build the full path to the template file. 
    const filePath = path.join(__dirname, 'Templates', `${templateName}.hbs`);
    // Read the template file synchronously 
    const templateSource = fs.readFileSync(filePath, 'utf8');
    // Compile the template with Handlebars
    const template = handlebars.compile(templateSource);
    
    // Add current year to data for copyright notices
    const enhancedData = {
      ...data,
      currentYear: new Date().getFullYear()
    };
    
    // Return the compiled HTML
    return template(enhancedData);
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    // Return a fallback template if the requested one can't be loaded
    return `<p>Hello ${data.name || 'there'},</p><p>This is a system generated message.</p>`;
  }
};

module.exports = { loadTemplate };
