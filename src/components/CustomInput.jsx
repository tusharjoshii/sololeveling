const CustomInput = ({ label, id, type = "text", ...props }) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
        <input
          id={id}
          type={type}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 focus:border-blue-500 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          {...props}
        />
      </div>
    )
  }
  
  export default CustomInput
  
  