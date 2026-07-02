import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, getItemQty, getItemId, updateQuantity } = useCart();
  const qty = getItemQty(product._id);
  const itemId = getItemId(product._id);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product._id, 1, product);
      toast.success('Added to cart', { duration: 1200, icon: '🛒' });
    } catch {
      toast.error('Could not add item');
    }
  };

  const handleInc = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (itemId) await updateQuantity(itemId, qty + 1, product._id);
      else await addToCart(product._id, 1, product);
    } catch (err) {
      console.warn('[ProductCard] handleInc error:', err?.message);
    }
  };

  const handleDec = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (itemId) await updateQuantity(itemId, qty - 1, product._id);
      else await updateQuantity(product._id, qty - 1, product._id);
    } catch (err) {
      console.warn('[ProductCard] handleDec error:', err?.message);
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="pcard group" style={{ textDecoration: 'none' }}>
      {/* Image */}
      <div className="pcard__img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400/F8F9FA/9CA3AF?text=FreshMart'; }}
        />
        {!product.isAvailable && (
          <span className="pcard__badge pcard__badge--out">Out of stock</span>
        )}
      </div>

      {/* Body */}
      <div className="pcard__body">
        <h3 className="pcard__name">{product.name}</h3>
        <span className="pcard__unit">{product.unit}</span>

        <div className="pcard__footer">
          <span className="pcard__price">${product.price.toFixed(2)}</span>

          {qty === 0 ? (
            <button
              className="btn-add"
              onClick={handleAdd}
              disabled={!product.isAvailable}
            >
              ADD
            </button>
          ) : (
            <div
              className="qty-ctrl"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <button className="qty-ctrl__btn" onClick={handleDec}>−</button>
              <span className="qty-ctrl__num">{qty}</span>
              <button className="qty-ctrl__btn" onClick={handleInc}>+</button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
