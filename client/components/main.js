import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Main = () => {
  const [category, setCategory] = useState('')
  const [filesName, setFilesName] = useState([])
  const [createCategory,setCreateCategory]=useState('')
  useEffect(() => {
    axios('/api/v1/categories').then(({ data }) => setFilesName(data))
  })
  const newCategory=(newcategory,title)=>{
    axios.post(`/api/v1/tasks/${newcategory}`,{title})
  }
  return (
    <div className="flex  items-center justify-center h-screen bg-green-300">
      <div className='flex flex-col items-center justify-center w-1/2'>
      <div className="mb-2 text-2xl text-blue-800">Category List</div>
      {filesName.map((file,index) => {
        return <div className='mb-2 text-blue-800'key={file}>{`${index +1}.${file}`}</div>
      })}
      <input
        className=" py-2 px-4 w-5/12 border border-red-400 rounded  focus:border-blue-500 text-blue-800 "
        placeholder="Enter category's name"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <Link
        type="button"
        className="text-center  mt-5 w-5/12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        to={`/${category}`}
      >
        Find the category
      </Link>
      </div>
      <div className='flex flex-col w-1/2 items-center justify-center'>
      <div className="my-4 text-2xl text-blue-800">Create a New Category</div>
      <input placeholder="Enter new category's name"className="text-blue-800 py-2 px-4 w-5/12 border border-red-400 rounded  focus:border-blue-500  "value={createCategory} type='text' onChange={e=>setCreateCategory(e.target.value)}/>
      <Link className="text-center  mt-5 w-5/12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"to={`/${createCategory}`} onClick={()=>newCategory(createCategory,'title')}>Create Category</Link>
      </div>
      
    </div>
  )
}
export default Main
