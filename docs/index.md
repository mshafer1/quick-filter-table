[[_TOC_]]

# Quick Filter Table Documentation

## Overview

The `quick-filter-table` allows you to easily get a searchable, filterable, sortable data table with minimal boiler plate code.

---

## Installation

Include the library's CSS and JavaScript files in your HTML file:

```html
<link href="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.0.1/quick-filter-table/dist/quick-filter-table.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.0.1/quick-filter-table/dist/quick-filter-table.js"></script>
```

See versions list at [github.com/quick-filter-table/releases](https://github.com/mshafer1/quick-filter-table/releases)

---

## Usage

### Basic Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quick Filter Table Example</title>
    <link href="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.0.1/quick-filter-table/dist/quick-filter-table.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.0.1/quick-filter-table/dist/quick-filter-table.js"></script>
    <script>
      function init() {
        QuickFilterTable.renderApp("app1", {
          items: [
            { name: "Alice", age: 30, city: "New York" },
            { name: "Bob", age: 25, city: "Los Angeles" },
            { name: "Charlie", age: 35, city: "Chicago" },
            { name: "David", age: 28, city: "Miami" },
          ],
          headers: [
            { text: "Name", value: "name", filter: "distinct" },
            { text: "Age", value: "age", filter: "numberRange" },
            { text: "City", value: "city", filter: "text" },
          ],
        });
      }

      window.addEventListener("DOMContentLoaded", init);
    </script>
  </head>
  <body>
    <div id="app1"></div>
  </body>
</html>
```

---

## Dynamic Data Loading

Instead of providing the `items` array directly, you can load data dynamically using the `items_url` property:

```js
QuickFilterTable.renderApp("app1", {
  items_url: "relative/path/to/data.json",
  headers: [
    { text: "Name", value: "name", filter: "distinct" },
    { text: "Age", value: "age", filter: "numberRange" },
    { text: "City", value: "city", filter: "text" },
  ],
});
```

Data will be fetched on load using a `GET` request using the `axios` library.

---

## Filters

### Distinct Filter
Filters by unique values in a column. Example:
```js
{ text: "Name", value: "name", filter: "distinct" }
```

### Text Filter
Filters by partial or full text match. Example:
```js
{ text: "City", value: "city", filter: "text" }
```

### Number Range Filter
Provides a number range slider to filter rows.
```js
{ text: "Age", value: "age", filter: "numberRange" }
```

Note: Values for this filter are parse using the JavaScript `parseFloat`, and NaN is considered to not be a match.
