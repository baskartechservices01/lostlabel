import React, { useState, useEffect } from "react";
import { Search, Filter, ShieldCheck, Eye } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import OrderVerificationModal from "../../components/admin/OrderVerificationModal";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { getOrders, verifyPayment, rejectPayment, updateOrderStatus } from "../../services/orderService";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders({ statusFilter });
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const filteredOrders = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.transactionId?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout title="Order Management & Payment Audits">
      <div className="space-y-6 text-left">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#1c1c1c]">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All" },
              { id: "submitted", label: "Submitted UTR" },
              { id: "pending", label: "Pending Payment" },
              { id: "verified", label: "Verified" },
              { id: "shipped", label: "Shipped" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                  statusFilter === tab.id
                    ? "bg-[#e8e4d9] text-[#070707] font-semibold"
                    : "bg-[#111] text-[#777] hover:text-[#e8e4d9] border border-[#222]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#666]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order #, Phone, UTR..."
              className="w-full bg-[#111] border border-[#262626] pl-9 pr-3 py-2 text-xs text-[#e8e4d9] focus:outline-none focus:border-[#e8e4d9]"
            />
          </div>
        </div>

        {/* Order Table */}
        <div className="bg-[#0c0c0c] border border-[#222] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111] text-[#777] uppercase tracking-wider border-b border-[#1c1c1c]">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#666] italic">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id || ord.orderNumber} className="hover:bg-[#111]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#e8e4d9]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#e8e4d9] block">{ord.customerName}</span>
                      <span className="text-[10px] text-[#666] font-mono">{ord.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#e8e4d9]">
                      {formatCurrency(ord.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={ord.paymentStatus === "verified" ? "verified" : ord.paymentStatus === "submitted" ? "submitted" : "pending"}>
                        {ord.paymentStatus}
                      </Badge>
                      {ord.transactionId && (
                        <span className="block text-[9px] font-mono text-[#777] mt-0.5">
                          UTR: {ord.transactionId}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[11px] text-[#b3b0a6]">
                      {ord.orderStatus.replace(/_/g, " ")}
                    </td>
                    <td className="py-3.5 px-4 text-[#666]">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant={ord.paymentStatus === "submitted" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setSelectedOrder(ord)}
                      >
                        {ord.paymentStatus === "submitted" ? "Audit UTR" : "Inspect"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect / Verification Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Dossier: ${selectedOrder.orderNumber}`}
          maxWidth="max-w-2xl"
        >
          <OrderVerificationModal
            order={selectedOrder}
            onVerify={async (id) => {
              await verifyPayment(id);
              fetchOrders();
            }}
            onReject={async (id, reason) => {
              await rejectPayment(id, reason);
              fetchOrders();
            }}
            onUpdateStatus={async (id, status) => {
              await updateOrderStatus(id, status);
              fetchOrders();
            }}
            onClose={() => setSelectedOrder(null)}
          />
        </Modal>
      )}
    </AdminLayout>
  );
}
