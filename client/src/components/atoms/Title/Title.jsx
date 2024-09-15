import PropTypes from 'prop-types'

function Title ({ children }) {
  return (

    <h2 className='text-4xl mx-auto font-bold my-4 sm:mt-12 text-white text-center'>
      {children}
    </h2>
  )
}

Title.propTypes = {
  children: PropTypes.node
}

export default Title
