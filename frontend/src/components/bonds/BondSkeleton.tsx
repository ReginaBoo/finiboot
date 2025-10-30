export const BondSkeleton = () => {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse">
      <div className="col-span-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="col-span-2 text-right">
        <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto"></div>
      </div>
      <div className="col-span-2 text-right">
        <div className="h-4 bg-gray-200 rounded w-1/3 ml-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 ml-auto"></div>
      </div>
      <div className="col-span-2 text-right">
        <div className="h-4 bg-gray-200 rounded w-2/3 ml-auto"></div>
      </div>
      <div className="col-span-2 text-right">
        <div className="h-4 bg-gray-200 rounded w-2/3 ml-auto"></div>
      </div>
    </div>
  );
};