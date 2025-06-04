import React from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <ApperIcon 
            name="MessageCircle" 
            className="h-24 w-24 text-primary mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            404 - Chat Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Looks like this conversation has disappeared into the digital void.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-soft"
        >
          <ApperIcon name="ArrowLeft" className="h-5 w-5 mr-2" />
          Back to ChatterFlow
        </Link>
      </div>
    </div>
  )
}

export default NotFound