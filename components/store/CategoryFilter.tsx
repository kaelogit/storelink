"use client";

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-md py-3 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex gap-2 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => onSelect("all")}
          className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
            activeCategory === "all" 
              ? "bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-offset-1" 
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          All Items
        </button>
        
        {categories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
              activeCategory === cat.id 
                ? "bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-offset-1" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}