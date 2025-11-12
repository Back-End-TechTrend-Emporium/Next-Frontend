// src/components/molecules/OrderTable.tsx

/** 1) Exporta el tipo primero (OrderRow lo importa desde aquí) */
export type Order = {
  id: number;
  customerName: string;
  paymentStatus: string;
  amount: string;
  address: string;
  date: string;
  status: string;
};

/** 2) Luego importa el componente de fila (mismo folder) */
import OrderRow from "./OrderRow";

/** 3) Tabla que renderiza OrderRow */
export default function OrdersTable({
  orders,
  onSelect,
}: {
  orders: Order[];
  onSelect: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3">Order No.</th>
            <th className="px-4 py-3">Customer Name</th>
            <th className="px-4 py-3">Payment Status</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Order Date</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} onClick={() => onSelect(o.id)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
