# Quick Filter Table Documentation

## Overview

The `quick-filter-table` allows you to easily get a searchable, filterable, sortable data table with minimal boiler plate code.

---

## Installation

Include the library's CSS and JavaScript files in your HTML file:

```html
<link href="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.js"></script>
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
    <link href="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.js"></script>
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

<details>
    <summary>Click here to expand live playground</summary>
    <div id="container-1"></div>
    <script type="module">
        import { createPlayground } from 'https://cdn.jsdelivr.net/npm/livecodes@0.13.0';

        createPlayground('#container-1', {
            params: {
                scripts: [
                    'https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.js',
                ],
                stylesheets: [
                    'https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.css',
                ],
                html: '<div id="app1"></div>',
                js: `
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
                });`,
            },
        });
    </script>
</details>

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

To access an array of items nested within the returned data, provide a `items_key` to specify the location.
```js
QuickFilterTable.renderApp("app1", {
  items_url: "relative/path/to/data.json",
  items_key: "people.search.results.items",
  headers: [
    { text: "Name", value: "name", filter: "distinct" },
    { text: "Age", value: "age", filter: "numberRange" },
    { text: "City", value: "city", filter: "text" },
  ],
});
```

Data will be fetched on load using a `GET` request using the `axios` library.

<details>
    <summary>Click here to expand live playground</summary>
    <div id="container-2"></div>
    <script type="module">
        import { createPlayground } from 'https://cdn.jsdelivr.net/npm/livecodes@0.13.0';

        createPlayground('#container-2', {
            params: {
                scripts: [
                    'https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.js',
                ],
                stylesheets: [
                    'https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.css',
                ],
                html: '<div id="app1"></div>',
                js: `
                QuickFilterTable.renderApp("app1", {
                    items_url: 'https://mshafer1.github.io/quick-filter-table/example/path/to/file.json',
                    items_path: 'feed.items',
                    headers: [
                        { text: "Name", value: "name", filter: "distinct" },
                        { text: "Age", value: "age", filter: "numberRange" },
                        { text: "City", value: "city", filter: "text" },
                    ],
                });`,
            },
        });
    </script>
</details>

---

## Data manipulation

`items_map` provides a method to create calculated columns.

If `items_map` is provided, then each item in the array is passed to this function before processing.

```js
QuickFilterTable.renderApp("app1", {
    items: [
    { first_name: "Alice", last_name: "Apple", age: 30, city: "New York" },
    { first_name: "Bob", last_name: "Banana", age: 25, city: "Los Angeles" },
    { first_name: "Charlie", last_name: "Cherry", age: 35, city: "Chicago" },
    { first_name: "David", last_name: "Date", age: 28, city: "Miami" },
    ],
    items_map: function(item) {
        item.name = `${item.last_name}, ${item.first_name}`
        return item
    },
    headers: [
    { text: "Name", value: "name", filter: "distinct" },
    { text: "Age", value: "age", filter: "numberRange" },
    { text: "City", value: "city", filter: "text" },
    ],
});
```

<details>
    <summary>Click here to expand live playground</summary>
    <div id="container-2"></div>
    <script type="module">
        import { createPlayground } from 'https://cdn.jsdelivr.net/npm/livecodes@0.13.0';

        createPlayground('#container-2', {
            params: {
                scripts: [
                    'https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.js',
                ],
                stylesheets: [
                    'https://cdn.jsdelivr.net/gh/mshafer1/quick-filter-table@1.1.0/quick-filter-table/dist/quick-filter-table.css',
                ],
                html: '<div id="app1"></div>',
                js: `
                QuickFilterTable.renderApp("app1", {
                    items: [
                    { first_name: "Alice", last_name: "Apple", age: 30, city: "New York" },
                    { first_name: "Bob", last_name: "Banana", age: 25, city: "Los Angeles" },
                    { first_name: "Charlie", last_name: "Cherry", age: 35, city: "Chicago" },
                    { first_name: "David", last_name: "Date", age: 28, city: "Miami" },
                    ],
                    items_map: function(item) {
                        item.name = `${item.last_name}, ${item.first_name}`
                        return item
                    },
                    headers: [
                    { text: "Name", value: "name", filter: "multiDistinct" },
                    { text: "Age", value: "age", filter: "numberRange" },
                    { text: "City", value: "city", filter: "text" },
                    ],
                });`,
            },
        });
    </script>
</details>

---

## Header options

**NOTE:** The order of items in the `headers` array specifies the order of the columns displayed.

| Name | Required? | Default | Description |
| ---- | --------- | --------| ----- |
| `text` | Yes | \- | The name to show at the top of the column |
| `value` | Yes | \- | The name of the field in each object to show |
| `sortable` | No | `true` | Whether or not to allow this headers column to be sorted |
| `html` | No | `false` | When true, the contents of `item[value]` will be loaded in as raw HTML. Useful for showing links |
| `filter` | No | `null` | If specified, provide filter options. See [#Filters](#Filters) for details |


---

## Filters

### Distinct Filter
Filters by unique values in a column. Example:
```js
{ text: "Name", value: "name", filter: "distinct" }
```

### DistinctMulti Filter
Filters by unique values in a column, uses check boxes to allow multiple choices. Example:
```js
{ text: "Name", value: "name", filter: "distinctMulti" }
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

Note: Values for this filter are parsed using the JavaScript `parseFloat`, and NaN is considered to not be a match.
