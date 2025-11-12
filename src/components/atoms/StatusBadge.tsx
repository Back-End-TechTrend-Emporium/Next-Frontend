export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Confirmed: "bg-green-100 text-green-800",
    "In Process": "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
