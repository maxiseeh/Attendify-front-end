// simple input field with label
function Input({ label, id, type = 'text', value, onChange, placeholder = '', required = false }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}
export default Input
