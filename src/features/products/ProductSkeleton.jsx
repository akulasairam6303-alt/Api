function ProductSkeleton() {
  return (
    <div className="card skeleton">
      <div className="skeleton-img"></div>

      <div className="skeleton-text title"></div>

      <div className="skeleton-text price"></div>

      <div className="skeleton-actions">
        <div className="skeleton-btn"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
}

export default ProductSkeleton;