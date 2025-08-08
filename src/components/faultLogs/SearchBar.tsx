interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
}

export default function SearchBar({ searchTerm, onSearchChange, loading }: Props) {
  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tag data across all records..."
          disabled={loading}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          </div>
        )}
      </div>
      {searchTerm && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Searching for: <span className="font-medium">"{searchTerm}"</span>
          </p>
          <button onClick={() => onSearchChange("")} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}