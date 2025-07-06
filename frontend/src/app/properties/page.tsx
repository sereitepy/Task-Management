'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock data (will be replaced by real API data)
const mockProperties = [
    { id: 1, name: "Sunset Villa", status: "active", type: "villa", price: 850000, rating: 4.5, lastUpdated: "2024-01-15", description: "Beautiful villa with ocean view" },
    { id: 2, name: "Downtown Apartment", status: "inactive", type: "apartment", price: 320000, rating: 3.8, lastUpdated: "2024-01-10", description: "Modern apartment in city center" },
    { id: 3, name: "Garden House", status: "active", type: "house", price: 650000, rating: 4.2, lastUpdated: "2024-01-20", description: "Spacious house with garden" },
    { id: 4, name: "City Building", status: "maintenance", type: "building", price: 1200000, rating: 4.0, lastUpdated: "2024-01-08", description: "Commercial building downtown" },
    { id: 5, name: "Beach Villa", status: "active", type: "villa", price: 950000, rating: 4.8, lastUpdated: "2024-01-22", description: "Luxury villa on the beach" },
    { id: 6, name: "Modern House", status: "inactive", type: "house", price: 480000, rating: 3.9, lastUpdated: "2024-01-12", description: "Contemporary house design" },
    { id: 7, name: "Luxury Apartment", status: "active", type: "apartment", price: 420000, rating: 4.3, lastUpdated: "2024-01-18", description: "High-end apartment with amenities" },
    { id: 8, name: "Office Building", status: "maintenance", type: "building", price: 2100000, rating: 4.1, lastUpdated: "2024-01-25", description: "Multi-story office complex" },
    { id: 9, name: "Cozy Cottage", status: "active", type: "house", price: 280000, rating: 4.0, lastUpdated: "2024-01-14", description: "Charming cottage in quiet area" },
    { id: 10, name: "Sky Apartment", status: "active", type: "apartment", price: 580000, rating: 4.6, lastUpdated: "2024-01-28", description: "Penthouse with city views" },
];

export default function PropertyFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filter states
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);

    // API states
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Initialize state from URL on mount
    useEffect(() => {
        const statusParams = searchParams.getAll('status');
        const typeParams = searchParams.getAll('type');
        const minPrice = searchParams.get('priceMin');
        const maxPrice = searchParams.get('priceMax');
        const search = searchParams.get('search');
        const sort = searchParams.get('sortBy');
        const order = searchParams.get('sortOrder');
        const page = searchParams.get('page');

        if (statusParams.length > 0) setSelectedStatuses(statusParams);
        if (typeParams.length > 0) setSelectedTypes(typeParams);
        if (minPrice) setPriceMin(minPrice);
        if (maxPrice) setPriceMax(maxPrice);
        if (search) setSearchTerm(search);
        if (sort) setSortBy(sort);
        if (order) setSortOrder(order);
        if (page) setCurrentPage(parseInt(page));
    }, [searchParams]);

    // Call API whenever URL params change
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                // Get current URL params
                const params = new URLSearchParams(window.location.search);

                // For demo purposes, we'll use mock data and simulate API behavior
                // In your real app, replace this with:
                // const response = await fetch(`/api/properties?${params.toString()}`);
                // const data = await response.json();

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Mock filtering logic (your backend will handle this)
                let filtered = [...mockProperties];

                // Apply filters based on URL params
                const statusFilter = searchParams.getAll('status');
                const typeFilter = searchParams.getAll('type');
                const minPrice = searchParams.get('priceMin');
                const maxPrice = searchParams.get('priceMax');
                const search = searchParams.get('search');
                const sort = searchParams.get('sortBy');
                const order = searchParams.get('sortOrder');
                const page = parseInt(searchParams.get('page')) || 1;

                if (statusFilter.length > 0) {
                    filtered = filtered.filter(p => statusFilter.includes(p.status));
                }
                if (typeFilter.length > 0) {
                    filtered = filtered.filter(p => typeFilter.includes(p.type));
                }
                if (minPrice) {
                    filtered = filtered.filter(p => p.price >= parseInt(minPrice));
                }
                if (maxPrice) {
                    filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
                }
                if (search) {
                    filtered = filtered.filter(p =>
                        p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase())
                    );
                }
                if (sort) {
                    filtered.sort((a, b) => {
                        let aValue = a[sort];
                        let bValue = b[sort];
                        if (sort === 'lastUpdated') {
                            aValue = new Date(aValue);
                            bValue = new Date(bValue);
                        }
                        return order === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
                    });
                }

                // Pagination
                const total = Math.ceil(filtered.length / itemsPerPage);
                const startIndex = (page - 1) * itemsPerPage;
                const paginatedResults = filtered.slice(startIndex, startIndex + itemsPerPage);

                setProperties(paginatedResults);
                setTotalPages(total);
                setTotalCount(filtered.length);

            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [searchParams]);

    // Generate active filter tags
    const getActiveFilterTags = () => {
        const tags = [];

        // Status tags
        selectedStatuses.forEach(status => {
            tags.push({
                id: `status-${status}`,
                label: `Status: ${status}`,
                type: 'status',
                value: status,
                remove: () => removeStatusFilter(status)
            });
        });

        // Type tags
        selectedTypes.forEach(type => {
            tags.push({
                id: `type-${type}`,
                label: `Type: ${type}`,
                type: 'type',
                value: type,
                remove: () => removeTypeFilter(type)
            });
        });

        // Price range tag
        if (priceMin || priceMax) {
            const priceLabel = `Price: ${priceMin ? `$${parseInt(priceMin).toLocaleString()}` : 'Any'} - ${priceMax ? `$${parseInt(priceMax).toLocaleString()}` : 'Any'}`;
            tags.push({
                id: 'price-range',
                label: priceLabel,
                type: 'price',
                remove: () => removePriceFilter()
            });
        }

        // Search tag
        if (searchTerm) {
            tags.push({
                id: 'search',
                label: `Search: "${searchTerm}"`,
                type: 'search',
                remove: () => removeSearchFilter()
            });
        }

        // Sort tag
        if (sortBy) {
            tags.push({
                id: 'sort',
                label: `Sort: ${sortBy} (${sortOrder})`,
                type: 'sort',
                remove: () => removeSortFilter()
            });
        }

        return tags;
    };

    // Remove filter functions
    const removeStatusFilter = (status) => {
        const newStatuses = selectedStatuses.filter(s => s !== status);
        setSelectedStatuses(newStatuses);
        setCurrentPage(1);
        updateURL({ status: newStatuses, page: 1 });
    };

    const removeTypeFilter = (type) => {
        const newTypes = selectedTypes.filter(t => t !== type);
        setSelectedTypes(newTypes);
        setCurrentPage(1);
        updateURL({ type: newTypes, page: 1 });
    };

    const removePriceFilter = () => {
        setPriceMin('');
        setPriceMax('');
        setCurrentPage(1);
        updateURL({ priceMin: '', priceMax: '', page: 1 });
    };

    const removeSearchFilter = () => {
        setSearchTerm('');
        setCurrentPage(1);
        updateURL({ search: '', page: 1 });
    };

    const removeSortFilter = () => {
        setSortBy('');
        setSortOrder('asc');
        setCurrentPage(1);
        updateURL({ sortBy: '', sortOrder: 'asc', page: 1 });
    };

    // Update URL with all params
    const updateURL = (updates = {}) => {
        const params = new URLSearchParams();

        // Get current values or use updates
        const currentStatus = updates.status !== undefined ? updates.status : selectedStatuses;
        const currentType = updates.type !== undefined ? updates.type : selectedTypes;
        const currentPriceMin = updates.priceMin !== undefined ? updates.priceMin : priceMin;
        const currentPriceMax = updates.priceMax !== undefined ? updates.priceMax : priceMax;
        const currentSearch = updates.search !== undefined ? updates.search : searchTerm;
        const currentSortBy = updates.sortBy !== undefined ? updates.sortBy : sortBy;
        const currentSortOrder = updates.sortOrder !== undefined ? updates.sortOrder : sortOrder;
        const currentPage = updates.page !== undefined ? updates.page : 1;

        // Add multiple status params
        currentStatus.forEach(s => params.append('status', s));

        // Add multiple type params
        currentType.forEach(t => params.append('type', t));

        // Add other single params
        if (currentPriceMin) params.set('priceMin', currentPriceMin);
        if (currentPriceMax) params.set('priceMax', currentPriceMax);
        if (currentSearch) params.set('search', currentSearch);
        if (currentSortBy) params.set('sortBy', currentSortBy);
        if (currentSortOrder && currentSortBy) params.set('sortOrder', currentSortOrder);
        if (currentPage > 1) params.set('page', currentPage.toString());

        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Handle status checkbox change
    const handleStatusChange = (status) => {
        const newStatuses = selectedStatuses.includes(status)
            ? selectedStatuses.filter(s => s !== status)
            : [...selectedStatuses, status];

        setSelectedStatuses(newStatuses);
        setCurrentPage(1);
        updateURL({ status: newStatuses, page: 1 });
    };

    // Handle type checkbox change
    const handleTypeChange = (type) => {
        const newTypes = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type];

        setSelectedTypes(newTypes);
        setCurrentPage(1);
        updateURL({ type: newTypes, page: 1 });
    };

    // Handle price min change
    const handlePriceMinChange = (value) => {
        setPriceMin(value);
        setCurrentPage(1);
        updateURL({ priceMin: value, page: 1 });
    };

    // Handle price max change
    const handlePriceMaxChange = (value) => {
        setPriceMax(value);
        setCurrentPage(1);
        updateURL({ priceMax: value, page: 1 });
    };

    // Handle search change
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        updateURL({ search: value, page: 1 });
    };

    // Handle sort change
    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
        updateURL({ sortBy: value, page: 1 });
    };

    // Handle sort order change
    const handleSortOrderChange = (value) => {
        setSortOrder(value);
        setCurrentPage(1);
        updateURL({ sortOrder: value, page: 1 });
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        updateURL({ page: page });
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedStatuses([]);
        setSelectedTypes([]);
        setPriceMin('');
        setPriceMax('');
        setSearchTerm('');
        setSortBy('');
        setSortOrder('asc');
        setCurrentPage(1);
        router.push('?', { scroll: false });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Property Filter Demo - Complete System</h1>

            {/* Active Filter Tags */}
            {getActiveFilterTags().length > 0 && (
                <div className="mb-6 p-4 border  rounded-lg">
                    <h3 className="font-semibold mb-2 ">Active Filters:</h3>
                    <div className="flex flex-wrap gap-2">
                        {getActiveFilterTags().map(tag => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                {tag.label}
                                <button
                                    onClick={tag.remove}
                                    className="ml-1 hover:bg-blue-200 rounded-full p-1"
                                    aria-label={`Remove ${tag.label} filter`}
                                >
                  ×
                </button>
              </span>
                        ))}
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Status Filter */}
                <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Status</h3>
                    {['active', 'inactive', 'maintenance'].map(status => (
                        <div key={status} className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id={`status-${status}`}
                                checked={selectedStatuses.includes(status)}
                                onChange={() => handleStatusChange(status)}
                                className="w-4 h-4"
                            />
                            <label htmlFor={`status-${status}`} className="capitalize text-sm">
                                {status}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Type Filter */}
                <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Type</h3>
                    {['house', 'villa', 'building', 'apartment'].map(type => (
                        <div key={type} className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id={`type-${type}`}
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleTypeChange(type)}
                                className="w-4 h-4"
                            />
                            <label htmlFor={`type-${type}`} className="capitalize text-sm">
                                {type}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Price Range Filter */}
                <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="space-y-2">
                        <input
                            type="number"
                            placeholder="Min price"
                            value={priceMin}
                            onChange={(e) => handlePriceMinChange(e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                        />
                        <input
                            type="number"
                            placeholder="Max price"
                            value={priceMax}
                            onChange={(e) => handlePriceMaxChange(e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                        />
                    </div>
                </div>

                {/* Search & Sort */}
                <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Search & Sort</h3>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                        >
                            <option value="">Sort by...</option>
                            <option value="price">Price</option>
                            <option value="rating">Rating</option>
                            <option value="lastUpdated">Last Updated</option>
                        </select>
                        {sortBy && (
                            <select
                                value={sortOrder}
                                onChange={(e) => handleSortOrderChange(e.target.value)}
                                className="w-full px-2 py-1 border rounded text-sm"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* API Integration Note */}
            <div className="mb-4 p-3 bg-yellow-50 border   rounded">
                <strong>🔌 API Integration:</strong> This demo simulates your backend API. Replace the mock data section with your real API call to <code>/api/properties</code>
            </div>

            {/* Current URL Display */}
            <div className="bg-pink-200 border-pink-200 p-3 rounded  mb-6">
                <strong>Current URL:</strong> <span className="text-sm break-all">{typeof window !== 'undefined' ? window.location.search : ''}</span>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading properties...</p>
                </div>
            )}

            {/* Results */}
            {!loading && (
                <div>
                    <h3 className="font-semibold mb-3">
                        Properties ({totalCount} total, Page {currentPage} of {totalPages})
                    </h3>
                    <div className="grid gap-4 mb-6">
                        {properties.map(property => (
                            <div key={property.id} className="border p-4 rounded-lg">
                                <h4 className="font-medium">{property.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{property.description}</p>
                                <div className="flex justify-between items-center text-sm">
                  <span>
                    Status: <span className="capitalize">{property.status}</span> |
                    Type: <span className="capitalize">{property.type}</span>
                  </span>
                                    <span>
                    ${property.price.toLocaleString()} | ★{property.rating} | {property.lastUpdated}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1 border rounded text-sm ${
                                        currentPage === i + 1 ? 'bg-blue-500 ' : ''
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}