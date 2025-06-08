import React from 'react'
import FoodData from '../FoodData/FoodData'

function Menu() {
  return (
    <div className='w-full h-full bg-gray-100 p-4 grid grid-cols-3 gap-7'>
      <FoodData length={""} ratings={0} />
    </div>
  )
}

export default Menu
