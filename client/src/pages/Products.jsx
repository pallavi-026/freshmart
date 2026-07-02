import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';

const Products = () => {
  const { products, pagination, categories, loading, fetchProducts, fetchCategories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    const params = {};
    const cat = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    if (cat) { params.category = cat; setSelectedCat(cat); }
    if (search) { params.search = search; setLocalSearch(search); }
    if (sort) params.sort = sort;
    params.page = searchParams.get('page') || 1;
    params.limit = 20;
    fetchProducts(params);
  }, [searchParams, sort]);

  const applyFilters = (overrides = {}) => {
    const p = {};
    if (overrides.cat !== undefined ? overrides.cat : selectedCat) p.category = overrides.cat !== undefined ? overrides.cat : selectedCat;
    if (overrides.search !== undefined ? overrides.search : localSearch) p.search = overrides.search !== undefined ? overrides.search : localSearch;
    if (sort) p.sort = sort;
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters({ search: localSearch });
  };

  const handleCat = (cat) => {
    const next = cat === selectedCat ? '' : cat;
    setSelectedCat(next);
    applyFilters({ cat: next });
  };

  const handlePage = (page) => {
    const p = Object.fromEntries(searchParams);
    p.page = page;
    setSearchParams(p);
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh' }}>
      <div className="app-container" style={{ paddingTop: '24px', paddingBottom: '32px' }}>

        {/* Page header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
            {selectedCat || 'All Products'}
          </h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>
            {pagination.total || 0} products available
          </p>
        </div>

        {/* Filter bar */}
        <div style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
          {/* Search + Sort row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '200px', display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  placeholder="Search products..."
                  style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: '13px', background: '#F8F9FA', border: '1.5px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', color: '#111827' }}
                  onFocus={e => e.target.style.borderColor = '#22C55E'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <button type="submit" style={{ padding: '8px 18px', fontSize: '13px', fontWeight: 700, background: '#22C55E', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </form>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{ padding: '8px 14px', fontSize: '13px', background: '#F8F9FA', border: '1.5px solid #E5E7EB', borderRadius: '8px', outline: 'none', color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <option value="">Sort: Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }} className="no-scrollbar">
            <button
              onClick={() => handleCat('')}
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '5px 14px',
                fontSize: '12px', fontWeight: 600, borderRadius: '99px',
                border: '1.5px solid', whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'inherit',
                background: !selectedCat ? '#22C55E' : '#fff',
                color: !selectedCat ? '#fff' : '#374151',
                borderColor: !selectedCat ? '#22C55E' : '#E5E7EB',
                transition: 'all 0.15s',
              }}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCat(cat)}
                style={{
                  display: 'inline-flex', alignItems: 'center', padding: '5px 14px',
                  fontSize: '12px', fontWeight: 600, borderRadius: '99px',
                  border: '1.5px solid', whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'inherit',
                  background: selectedCat === cat ? '#22C55E' : '#fff',
                  color: selectedCat === cat ? '#fff' : '#374151',
                  borderColor: selectedCat === cat ? '#22C55E' : '#E5E7EB',
                  transition: 'all 0.15s',
                }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <EmptyState icon="🔍" title="No products found" description="Try a different search term or category." />
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
            }} className="product-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '28px' }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePage(page)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', border: '1.5px solid', fontFamily: 'inherit', transition: 'all 0.15s',
                      background: pagination.page === page ? '#22C55E' : '#fff',
                      color: pagination.page === page ? '#fff' : '#374151',
                      borderColor: pagination.page === page ? '#22C55E' : '#E5E7EB',
                    }}
                  >{page}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Responsive grid CSS */}
      <style>{`
        @media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        @media (max-width: 768px)  { .product-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 480px)  { .product-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 1024px) { .grid-cols-5-mobile { grid-template-columns: repeat(5, 1fr) !important; } }
        @media (max-width: 480px)  { .grid-cols-5-mobile { grid-template-columns: repeat(5, 1fr) !important; } }
      `}</style>
    </div>
  );
};

export default Products;
