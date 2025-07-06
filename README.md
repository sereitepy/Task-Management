# Property Filter Demo - README & Guide

This project is a full-featured property filtering UI built with **Next.js (App Router)** using `useSearchParams`, mock data, and reactive state. It includes filters, pagination, and sorting with URL synchronization, simulating a real-world property listing interface.

---

## 🔧 Technologies Used

* **React (via Next.js)**
* **Tailwind CSS** (for styling)
* `useState`, `useEffect` from React
* `useRouter`, `useSearchParams` from `next/navigation`

---

## 🔍 Key Features

1. Filtering by:

   * Status (checkboxes)
   * Type (checkboxes)
   * Price range (min/max)
   * Text search (name/description)
   * Sorting (by price, rating, last updated)
2. Pagination
3. State synced to URL via query parameters
4. Active filter tags with removal
5. Backend connection placeholder (mock data used in demo)

---

## 🔄 `useEffect(() => {}, [dependencies])`

### Basic Concept:

* `useEffect()` is a React hook that runs side effects like API calls, timers, or manually manipulating the DOM.
* The second argument (the **dependency array**) controls **when** the effect runs:

  * `[]` = run **once on mount**
  * `[varA, varB]` = run **every time `varA` or `varB` changes**

### In This Code:

```js
useEffect(() => {
    // Reads URL query params and initializes filter states
}, [searchParams]);
```

This runs every time the URL query parameters change, which in turn updates the filter states.

```js
useEffect(() => {
    // Simulates fetching properties from API
}, [searchParams]);
```

This also runs on query param change, re-filtering and re-paginating the mock data as if it were a real API response.

---

## 🧠 How Dropdowns Work

Dropdowns are typically made with a `<select>` tag:

```jsx
<select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
  <option value="">Sort by...</option>
  <option value="price">Price</option>
  <option value="rating">Rating</option>
</select>
```

### Logic Behind:

* `value` binds the dropdown to a piece of state (`sortBy`)
* `onChange` updates that state via handler function:

```js
const handleSortChange = (value) => {
  setSortBy(value);
  setCurrentPage(1);
  updateURL({ sortBy: value, page: 1 });
};
```

* Changing the dropdown will update the state and reflect in the URL

---

## 🔗 URL-Based State Management

This project uses the URL query string as the single source of truth:

* When the component mounts, we read from the URL via `useSearchParams()`
* Every state change updates the URL using `router.push()`
* Changes in URL cause `useEffect` to re-trigger filtering/sorting logic

This enables sharable URLs and deep-linking.

---

## 🌐 Connect to Real Backend API

### Replace mock logic:

```js
// Replace mock filtering with real fetch
const response = await fetch(`/api/properties?${params.toString()}`);
const data = await response.json();
setProperties(data.results);
setTotalPages(data.totalPages);
setTotalCount(data.totalCount);
```

### Example Response JSON Structure:

```json
{
  "results": [
    { "id": 1, "name": "Villa", ... },
    ...
  ],
  "totalCount": 40,
  "totalPages": 10
}
```

---

## ✅ Filter Example Logic (Status Checkbox):

```js
<input
  type="checkbox"
  checked={selectedStatuses.includes(status)}
  onChange={() => handleStatusChange(status)}
/>

const handleStatusChange = (status) => {
  const newStatuses = selectedStatuses.includes(status)
    ? selectedStatuses.filter(s => s !== status)
    : [...selectedStatuses, status];
  setSelectedStatuses(newStatuses);
  updateURL({ status: newStatuses, page: 1 });
};
```

---

## 📄 Summary of State Hooks

| State                      | Purpose                                |
| -------------------------- | -------------------------------------- |
| `selectedStatuses`         | Tracks status filters (e.g., "active") |
| `selectedTypes`            | Tracks type filters (e.g., "villa")    |
| `priceMin`, `priceMax`     | Numeric price filtering                |
| `searchTerm`               | Keyword filter for name/description    |
| `sortBy`, `sortOrder`      | Sorting field and direction            |
| `currentPage`              | Pagination control                     |
| `properties`               | Current display data                   |
| `totalPages`, `totalCount` | API response info                      |

---

## 📌 Extending This Project

You can extend this system to include:

* **Date filters** (e.g. createdAt)
* **Toggle favorites** (add/remove saved items)
* **Backend validation** for malformed query params
* **Server-side rendering (SSR)** using Next.js app directory and loading the filtered properties server-side

---

## 💡 Tips

* Always debounce input if search term affects backend query
* Use `useMemo` if filtering client-side with large datasets
* When you switch to backend API, return query-filtered and paginated data from your server

---

## 📎 Related Links

* [Next.js App Router docs](https://nextjs.org/docs/app/building-your-application/routing)
* [React useEffect docs](https://reactjs.org/docs/hooks-effect.html)
* [Tailwind CSS docs](https://tailwindcss.com/docs)
