import StatusBadge from "../atoms/StatusBadge"; 
import type { Order } from "./OrderTable";

export default function OrderRow({
  order,
  onClick,
}: {
  order: Order;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="hover:bg-gray-50 cursor-pointer border-b last:border-0"
    >
      <td className="px-4 py-3">{order.id}</td>
      <td className="px-4 py-3">{order.customerName}</td>
      <td className="px-4 py-3">{order.paymentStatus}</td>
      <td className="px-4 py-3">{order.amount}</td>
      <td className="px-4 py-3">{order.address}</td>
      <td className="px-4 py-3">{order.date}</td>
      <td className="px-4 py-3">
        <StatusBadge status={order.status} />
      </td>
    </tr>
  );
}
