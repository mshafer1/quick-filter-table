# quick-filter-table

A quick data-table viewer tool (with filtering/sorting enabled)

# Usage

Load the CSS and JS files:

```
<link href="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.0.1/quick-filter-table/dist/quick-filter-table.css"
    rel="stylesheet" />
<script
    src="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.0.1/quick-filter-table/dist/quick-filter-table.js"></script>
```

(full example)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Test quick filter table</title>
    <!-- Load stylesheets and library -->
    <link
      href="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.0.1/quick-filter-table/dist/quick-filter-table.css"
      rel="stylesheet"
    />
    <script src="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.0.1/quick-filter-table/dist/quick-filter-table.js"></script>
    <script>
      function init() {
        QuickFilterTable.renderApp("app1", {
          items: [
            { name: "Alice", age: 30, city: "New York" },
            { name: "Bob", age: 25, city: "Los Angeles" },
            { name: "Charlie", age: 35, city: "Chicago" },
            { name: "David", age: 28, city: "Miami" },
            { name: "Eve", age: 22, city: "Seattle" },
            { name: "Frank", age: 33, city: "Boston" },
            { name: "Grace", age: 27, city: "San Francisco" },
            { name: "Hannah", age: 29, city: "Austin" },
            { name: "Ian", age: 31, city: "Denver" },
            { name: "Judy", age: 26, city: "Portland" },
            { name: "Kevin", age: 34, city: "Atlanta" },
            { name: "Laura", age: 24, city: "Philadelphia" },
            { name: "Mallory", age: 32, city: "Dallas" },
            { name: "Niaj", age: 23, city: "Houston" },
            { name: "Olivia", age: 28, city: "San Diego" },
          ],
          headers: [
            { text: "Name", value: "name" },
            { text: "Age", value: "age" },
            { text: "City", value: "city" },
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

To have the items loaded dynamically, instead of "items", provide "items_url".

Example:

```js
QuickFilterTable.renderApp("app1", {
  items_url: "relative/path/to/data.json",
  headers: [
    { text: "Name", value: "name" },
    { text: "Age", value: "age" },
    { text: "City", value: "city" },
  ],
});
```
