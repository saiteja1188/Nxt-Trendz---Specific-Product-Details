// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {title, imageUrl, price, rating, brand} = similarProductDetails
  return (
    <div className="similar-product-view">
      <div className="similar-container">
        <img src={imageUrl} alt="title img" className="similar-img" />
        <h1 className="heading">{title}</h1>
        <p>By {brand}</p>
        <div className="rating-similar-container">
          <p className="price">Rs {price} </p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star-icon"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimilarProductItem
