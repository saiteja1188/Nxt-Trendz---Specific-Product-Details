// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: [],
    apiStatus: apiStatusConstants.initial,
    similarProductData: [],
    quantity: 0,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUlr = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUlr, options)
    if (response.ok) {
      const fetchData = await response.json()
      const updatedData = this.getFormattedData(fetchData)
      const updatedSimilarData = fetchData.similar_products.map(
        eachSimilarItem => this.getFormattedData(eachSimilarItem),
      )
      this.setState({
        productDetails: updatedData,
        apiStatus: apiStatusConstants.success,
        similarProductData: updatedSimilarData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div>
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecrease = () => {
    const {quantity} = this.state
    if (quantity > 0) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrease = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderSuccessView = () => {
    const {productDetails, quantity, similarProductData} = this.state
    const {
      title,
      imageUrl,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails

    return (
      <div className="product-details-success-view">
        <div className="product-success-view-container">
          <img src={imageUrl} alt="title img" className="product-img" />
          <div className="product-content">
            <h1 className="product-details-heading">{title}</h1>
            <p className="product-details-price">Rs {price} /-</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p className="review">{totalReviews} Review</p>
            </div>
            <p className="description">{description}</p>
            <p>
              <span className="span">Available: </span>
              {availability}
            </p>
            <p>
              <span className="span">Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="increase-decrease-btn">
              <button
                type="button"
                className="button"
                onClick={this.onDecrease}
              >
                -
              </button>
              <p className="button-item">{quantity}</p>
              <button
                type="button"
                className="button"
                onClick={this.onIncrease}
              >
                +
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-heading">Similar products</h1>
        <ul className="product-ul-list">
          {similarProductData.map(eachProduct => (
            <SimilarProductItem
              similarProductDetails={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
